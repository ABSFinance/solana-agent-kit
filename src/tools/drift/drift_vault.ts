import {
  BASE_PRECISION,
  convertToNumber,
  getLimitOrderParams,
  getMarketOrderParams,
  getOrderParams,
  JupiterClient,
  MainnetPerpMarkets,
  MainnetSpotMarkets,
  MarketType,
  numberToSafeBN,
  PERCENTAGE_PRECISION,
  PositionDirection,
  PostOnlyParams,
  PRICE_PRECISION,
  QUOTE_PRECISION,
  SwapReduceOnly,
  TEN,
} from "@drift-labs/sdk";
import {
  WithdrawUnit,
  decodeName,
  encodeName,
  getVaultAddressSync,
  getVaultDepositorAddressSync,
} from "@drift-labs/vaults-sdk";
import {
  ComputeBudgetProgram,
  PublicKey,
  VersionedTransaction,
  AddressLookupTableAccount,
  type TransactionInstruction,
} from "@solana/web3.js";
import type { SolanaAgentKit } from "../../agent";
import { BN } from "bn.js";
import { initClients } from "./drift";

import {
  Raydium,
  makeAddLiquidityInstruction,
  TokenAmount,
  ApiV3PoolInfoStandardItem,
} from "@raydium-io/raydium-sdk-v2";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

let lastBid: number | undefined;
let lastAsk: number | undefined;

const SUFFICIENT_QUOTE_CHANGE_BPS = 2; // only requote if quote price changes by 2 bps
const BPS_BASE = 10000;

function sufficientQuoteChange(newBid: number, newAsk: number): boolean {
	if (lastBid === undefined || lastAsk === undefined) {
		return true;
	}
	const bidDiff = newBid / lastBid - 1;
	const askDiff = newAsk / lastAsk - 1;

	if (
		Math.abs(bidDiff) > SUFFICIENT_QUOTE_CHANGE_BPS / BPS_BASE ||
		Math.abs(askDiff) > SUFFICIENT_QUOTE_CHANGE_BPS / BPS_BASE
	) {
		return true;
	}

	return false;
}

export function getMarketIndexAndType(name: `${string}-${string}`) {
  const [symbol, type] = name.toUpperCase().split("-");

  if (type === "PERP") {
    const token = MainnetPerpMarkets.find((v) => v.baseAssetSymbol === symbol);
    if (!token) {
      throw new Error(
        `Drift doesn't have that market. Here's a list of available perp markets: ${MainnetPerpMarkets.map((v) => v.baseAssetSymbol).join(", ")}`,
      );
    }
    return { marketIndex: token.marketIndex, marketType: MarketType.PERP };
  }

  const token = MainnetSpotMarkets.find((v) => v.symbol === symbol);
  if (!token) {
    throw new Error(
      `Drift doesn't have that market. Here's a list of available spot markets: ${MainnetSpotMarkets.map((v) => v.symbol).join(", ")}`,
    );
  }
  return { marketIndex: token.marketIndex, marketType: MarketType.SPOT };
}

async function getOrCreateVaultDepositor(agent: SolanaAgentKit, vault: string) {
  const { vaultClient, cleanUp } = await initClients(agent);
  const vaultPublicKey = new PublicKey(vault);
  const vaultDepositor = getVaultDepositorAddressSync(
    vaultClient.program.programId,
    vaultPublicKey,
    agent.wallet.publicKey,
  );

  try {
    await vaultClient.getVaultDepositor(vaultDepositor);
    await cleanUp();
    return vaultDepositor;
  } catch (e) {
    // @ts-expect-error - error message is a string
    if (e.message.includes("Account does not exist")) {
      await vaultClient.initializeVaultDepositor(
        vaultPublicKey,
        agent.wallet.publicKey,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await cleanUp();
    return vaultDepositor;
  }
}

async function getVaultAvailableBalance(agent: SolanaAgentKit, vault: string) {
  try {
    const { cleanUp, vaultClient } = await initClients(agent);
    const vaultDetails = await vaultClient.getVault(new PublicKey(vault));

    const currentVaultBalance = convertToNumber(
      vaultDetails.netDeposits,
      QUOTE_PRECISION,
    );
    const vaultWithdrawalsRequested = convertToNumber(
      vaultDetails.totalWithdrawRequested,
      QUOTE_PRECISION,
    );
    const availableBalanceInUSD =
      currentVaultBalance - vaultWithdrawalsRequested;

    await cleanUp();

    return availableBalanceInUSD;
  } catch (e) {
    // @ts-expect-error - error message is a string
    throw new Error(`Failed to get vault available balance: ${e.message}`);
  }
}

/**
  Create a vault
  @param agent SolanaAgentKit instance
  @param params Vault creation parameters
  @param params.name Name of the vault (must be unique)
  @param params.marketName Market name of the vault (e.g. "USDC-SPOT")
  @param params.redeemPeriod Redeem period in seconds
  @param params.maxTokens Maximum amount that can be deposited into the vault (in tokens)
  @param params.minDepositAmount Minimum amount that can be deposited into the vault (in tokens)
  @param params.managementFee Management fee percentage (e.g 2 == 2%)
  @param params.profitShare Profit share percentage (e.g 20 == 20%)
  @param params.hurdleRate Hurdle rate percentage
  @param params.permissioned Whether the vault uses a whitelist
  @returns Promise<anchor.Web3.TransactionSignature> - The transaction signature of the vault creation
*/
export async function createVault(
  agent: SolanaAgentKit,
  params: {
    name: string;
    marketName: `${string}-${string}`;
    redeemPeriod: number;
    maxTokens: number;
    minDepositAmount: number;
    managementFee: number;
    profitShare: number;
    hurdleRate?: number;
    permissioned?: boolean;
  },
) {
  try {
    const { vaultClient, driftClient, cleanUp } = await initClients(agent);
    const marketIndexAndType = getMarketIndexAndType(params.marketName);

    const spotMarket = driftClient.getSpotMarketAccount(
      marketIndexAndType.marketIndex,
    );

    if (!spotMarket) {
      throw new Error(
        `Market not found. Here's a list of available spot markets: ${MainnetSpotMarkets.map((v) => `${v.symbol}-SPOT`).join(", ")}`,
      );
    }

    const spotPrecision = TEN.pow(new BN(spotMarket.decimals));

    if (marketIndexAndType.marketType === MarketType.PERP) {
      throw new Error(
        `Only SPOT market names are supported. Such as ${MainnetSpotMarkets.map((v) => `${v.symbol}-SPOT`).join(", ")}`,
      );
    }

    const tx = await vaultClient.initializeVault({
      name: encodeName(params.name),
      spotMarketIndex: marketIndexAndType.marketIndex,
      hurdleRate: new BN(params.hurdleRate ?? 0)
        .mul(PERCENTAGE_PRECISION)
        .div(new BN(100))
        .toNumber(),
      profitShare: new BN(params.profitShare)
        .mul(PERCENTAGE_PRECISION)
        .div(new BN(100))
        .toNumber(),
      minDepositAmount: numberToSafeBN(params.minDepositAmount, spotPrecision),
      redeemPeriod: new BN(params.redeemPeriod * 86400),
      maxTokens: numberToSafeBN(params.maxTokens, spotPrecision),
      managementFee: new BN(params.managementFee)
        .mul(PERCENTAGE_PRECISION)
        .div(new BN(100)),
      permissioned: params.permissioned ?? false,
    });

    await cleanUp();

    return tx;
  } catch (e) {
    // @ts-expect-error - error message is a string
    throw new Error(`Failed to create Drift vault: ${e.message}`);
  }
}

export async function updateVaultDelegate(
  agent: SolanaAgentKit,
  vault: string,
  delegateAddress: string,
) {
  try {
    const { vaultClient, cleanUp } = await initClients(agent);
    const signature = await vaultClient.updateDelegate(
      new PublicKey(vault),
      new PublicKey(delegateAddress),
    );
    await cleanUp();
    return signature;
  } catch (e) {
    throw new Error(
      // @ts-expect-error - error message is a string
      `Failed to update vault delegate: ${e.message}`,
    );
  }
}

/**
  Update the vault's info
  @param agent SolanaAgentKit instance
  @param vault Vault address
  @param params Vault update parameters
  @param params.redeemPeriod Redeem period in seconds
  @param params.maxTokens Maximum amount that can be deposited into the vault (in tokens)
  @param params.minDepositAmount Minimum amount that can be deposited into the vault (in tokens)
  @param params.managementFee Management fee percentage (e.g 2 == 2%)
  @param params.profitShare Profit share percentage (e.g 20 == 20%)
  @param params.hurdleRate Hurdle rate percentage
  @param params.permissioned Whether the vault uses a whitelist
  @returns Promise<anchor.Web3.TransactionSignature> - The transaction signature of the vault update
*/
export async function updateVault(
  agent: SolanaAgentKit,
  vault: string,
  params: {
    redeemPeriod?: number;
    maxTokens?: number;
    minDepositAmount?: number;
    managementFee?: number;
    profitShare?: number;
    hurdleRate?: number;
    permissioned?: boolean;
  },
) {
  try {
    const { vaultClient, cleanUp, driftClient } = await initClients(agent);
    const vaultPublicKey = new PublicKey(vault);
    const vaultDetails = await vaultClient.getVault(vaultPublicKey);

    const spotMarket = driftClient.getSpotMarketAccount(
      vaultDetails.spotMarketIndex,
    );

    if (!spotMarket) {
      throw new Error(
        "Market not found. This vault's market is no longer supported",
      );
    }

    const spotPrecision = TEN.pow(new BN(spotMarket.decimals));

    const tx = await vaultClient.managerUpdateVault(vaultPublicKey, {
      redeemPeriod: params.redeemPeriod
        ? new BN(params.redeemPeriod * 86400)
        : null,
      maxTokens: params.maxTokens
        ? numberToSafeBN(params.maxTokens, spotPrecision)
        : null,
      minDepositAmount: params.minDepositAmount
        ? numberToSafeBN(params.minDepositAmount, spotPrecision)
        : null,
      managementFee: params.managementFee
        ? new BN(params.managementFee)
            .mul(PERCENTAGE_PRECISION)
            .div(new BN(100))
        : null,
      profitShare: params.profitShare
        ? new BN(params.profitShare)
            .mul(PERCENTAGE_PRECISION)
            .div(new BN(100))
            .toNumber()
        : null,
      hurdleRate: params.hurdleRate
        ? new BN(params.hurdleRate)
            .mul(PERCENTAGE_PRECISION)
            .div(new BN(100))
            .toNumber()
        : null,
      permissioned: params.permissioned ?? vaultDetails.permissioned,
    });

    await cleanUp();

    return tx;
  } catch (e) {
    // @ts-expect-error - error message is a string
    throw new Error(`Failed to update Drift vault: ${e.message}`);
  }
}

export const validateAndEncodeAddress = (input: string, programId: string) => {
  try {
    return new PublicKey(input);
  } catch {
    return getVaultAddressSync(new PublicKey(programId), encodeName(input));
  }
};

/**
 * Get information on a particular vault given its name
 * @param agent
 * @param vaultNameOrAddress
 * @returns
 */
export async function getVaultInfo(
  agent: SolanaAgentKit,
  vaultNameOrAddress: string,
) {
  try {
    const { vaultClient, cleanUp } = await initClients(agent);
    const vaultPublicKey = validateAndEncodeAddress(
      vaultNameOrAddress,
      vaultClient.program.programId.toBase58(),
    );
    const [vaultDetails, vaultBalance] = await Promise.all([
      vaultClient.getVault(vaultPublicKey),
      getVaultAvailableBalance(agent, vaultPublicKey.toBase58()),
    ]);

    await cleanUp();

    const spotToken = MainnetSpotMarkets[vaultDetails.spotMarketIndex];
    const data = {
      name: decodeName(vaultDetails.name),
      delegate: vaultDetails.delegate.toBase58(),
      address: vaultPublicKey.toBase58(),
      marketName: `${spotToken.symbol}-SPOT`,
      balance: `${vaultBalance} ${spotToken.symbol}`,
      redeemPeriod: vaultDetails.redeemPeriod.toNumber(),
      maxTokens: vaultDetails.maxTokens.div(spotToken.precision).toNumber(),
      minDepositAmount: vaultDetails.minDepositAmount
        .div(spotToken.precision)
        .toNumber(),
      managementFee:
        (vaultDetails.managementFee.toNumber() /
          PERCENTAGE_PRECISION.toNumber()) *
        100,
      profitShare:
        (vaultDetails.profitShare / PERCENTAGE_PRECISION.toNumber()) * 100,
      hurdleRate:
        (vaultDetails.hurdleRate / PERCENTAGE_PRECISION.toNumber()) * 100,
      permissioned: vaultDetails.permissioned,
    };

    return data;
  } catch (e) {
    // @ts-expect-error - error message is a string
    throw new Error(`Failed to get vault info: ${e.message}`);
  }
}

/**
  Deposit tokens into a vault
  @param agent SolanaAgentKit instance
  @param amount Amount to deposit into the vault (in tokens)
  @param vault Vault address
  @returns Promise<anchor.Web3.TransactionSignature> - The transaction signature of the deposit
*/
export async function depositIntoVault(
  agent: SolanaAgentKit,
  amount: number,
  vault: string,
) {
  const { vaultClient, driftClient, cleanUp } = await initClients(agent);

  try {
    const vaultPublicKey = new PublicKey(vault);
    const [isOwned, vaultDetails, vaultDepositor] = await Promise.all([
      getIsOwned(agent, vault),
      vaultClient.getVault(vaultPublicKey),
      getOrCreateVaultDepositor(agent, vault),
    ]);
    const spotMarket = driftClient.getSpotMarketAccount(
      vaultDetails.spotMarketIndex,
    );

    if (!spotMarket) {
      throw new Error(
        "Market not found. This vaults market is no longer supported",
      );
    }

    const spotPrecision = TEN.pow(new BN(spotMarket.decimals));
    const amountBN = numberToSafeBN(amount, spotPrecision);

    if (isOwned) {
      return await vaultClient.managerDeposit(vaultPublicKey, amountBN);
    }

    const tx = await vaultClient.deposit(vaultDepositor, amountBN);

    await cleanUp();

    return tx;
  } catch (e) {
    // @ts-expect-error - error message is a string
    throw new Error(`Failed to deposit into Drift vault: ${e.message}`);
  }
}

/**
  Request a withdrawal from a vault. If successful redemption period starts and the user can redeem the tokens after the period ends
  @param agent SolanaAgentKit instance
  @param amount Amount to withdraw from the vault (in shares)
  @param vault Vault address
*/
export async function requestWithdrawalFromVault(
  agent: SolanaAgentKit,
  amount: number,
  vault: string,
) {
  try {
    const { vaultClient, cleanUp } = await initClients(agent);
    const vaultPublicKey = new PublicKey(vault);
    const isOwned = await getIsOwned(agent, vault);

    if (isOwned) {
      return await vaultClient.managerRequestWithdraw(
        vaultPublicKey,
        numberToSafeBN(amount, QUOTE_PRECISION),
        WithdrawUnit.TOKEN,
      );
    }

    const vaultDepositor = await getOrCreateVaultDepositor(agent, vault);

    const tx = await vaultClient.requestWithdraw(
      vaultDepositor,
      numberToSafeBN(amount, QUOTE_PRECISION),
      WithdrawUnit.TOKEN,
    );

    await cleanUp();

    return tx;
  } catch (e) {
    throw new Error(
      // @ts-expect-error - error message is a string
      `Failed to request withdrawal from Drift vault: ${e.message}`,
    );
  }
}

/**
  Withdraw tokens once the redemption period has elapsed.
  @param agent SolanaAgentKit instance
  @param vault Vault address
  @returns Promise<anchor.Web3.TransactionSignature> - The transaction signature of the redemption
*/
export async function withdrawFromDriftVault(
  agent: SolanaAgentKit,
  vault: string,
) {
  try {
    const { vaultClient, cleanUp } = await initClients(agent);
    const vaultPublicKey = new PublicKey(vault);
    const isOwned = await getIsOwned(agent, vault);

    if (isOwned) {
      return await vaultClient.managerWithdraw(vaultPublicKey);
    }

    const vaultDepositor = await getOrCreateVaultDepositor(agent, vault);

    const tx = await vaultClient.withdraw(vaultDepositor);

    await cleanUp();

    return tx;
  } catch (e) {
    // @ts-expect-error - error message is a string
    throw new Error(`Failed to redeem tokens from Drift vault: ${e.message}`);
  }
}

/**
  Get if vault is owned by the user
  @param agent SolanaAgentKit instance
  @param vault Vault address
  @returns Promise<boolean> - Whether the vault is owned by the user
*/
async function getIsOwned(agent: SolanaAgentKit, vault: string) {
  try {
    const { vaultClient, cleanUp } = await initClients(agent);
    const vaultPublicKey = new PublicKey(vault);
    const vaultDetails = await vaultClient.getVault(vaultPublicKey);
    const isOwned = vaultDetails.manager.equals(agent.wallet.publicKey);

    await cleanUp();

    return isOwned;
  } catch (e) {
    // @ts-expect-error - error message is a string
    throw new Error(`Failed to check if vault is owned: ${e.message}`);
  }
}

/**
 * Get a vaults address using the vault's name
 * @param agent
 * @param name
 */
export async function getVaultAddress(agent: SolanaAgentKit, name: string) {
  const encodedName = encodeName(name);

  try {
    const { vaultClient, cleanUp } = await initClients(agent);
    const vaultAddress = getVaultAddressSync(
      vaultClient.program.programId,
      encodedName,
    );

    await cleanUp();
    return vaultAddress;
  } catch (e) {
    throw new Error(
      // @ts-expect-error - error message is a string
      `Failed to get vault address: ${e.message}`,
    );
  }
}

/**
  Carry out a trade with a delegated vault
  @param agent SolanaAgentKit instance
  @param amount Amount to trade (in tokens)
  @param symbol Symbol of the token to trade
  @param action Action to take (e.g. "buy" or "sell")
  @param type Type of trade (e.g. "market" or "limit")
  @param vault Vault address
*/
export async function tradeDriftVault(
  agent: SolanaAgentKit,
  vault: string,
  amount: number,
  symbol: string,
  action: "long" | "short",
  type: "market" | "limit",
  price?: number,
) {
  try {
    const { driftClient, cleanUp } = await initClients(agent, {
      authority: new PublicKey(vault),
      activeSubAccountId: 0,
      subAccountIds: [6],
    });
    const [isOwned, driftLookupTableAccount] = await Promise.all([
      getIsOwned(agent, vault),
      driftClient.fetchMarketLookupTableAccount(),
    ]);

    if (!isOwned) {
      throw new Error(
        "This vault is owned/delegated to someone else, you can't trade with it",
      );
    }

    const usdcSpotMarket = driftClient.getSpotMarketAccount(0);
    if (!usdcSpotMarket) {
      throw new Error("USDC-SPOT market not found");
    }

    const perpMarketIndexAndType = getMarketIndexAndType(
      `${symbol.toUpperCase()}-PERP`,
    );
    const perpMarketAccount = driftClient.getPerpMarketAccount(
      perpMarketIndexAndType.marketIndex,
    );

    if (!perpMarketIndexAndType || !perpMarketAccount) {
      throw new Error(
        "Invalid symbol: Drift doesn't have a market for this token",
      );
    }

    const perpOracle = driftClient.getOracleDataForPerpMarket(
      perpMarketAccount.marketIndex,
    );
    const oraclePriceNumber = convertToNumber(
      perpOracle.price,
      PRICE_PRECISION,
    );
    const baseAmount = amount / oraclePriceNumber;
    const instructions: TransactionInstruction[] = [];

    instructions.push(
      ComputeBudgetProgram.setComputeUnitLimit({ units: 1400000 }),
    );

    if (type === "limit" || price) {
      if (!price) {
        throw new Error("Price is required for limit orders");
      }

      const instruction = await driftClient.getPlaceOrdersIx([
        getOrderParams(
          getLimitOrderParams({
            price: numberToSafeBN(price, PRICE_PRECISION),
            marketType: MarketType.PERP,
            baseAssetAmount: numberToSafeBN(baseAmount, BASE_PRECISION),
            direction:
              action === "long"
                ? PositionDirection.LONG
                : PositionDirection.SHORT,
            marketIndex: perpMarketAccount.marketIndex,
            postOnly: PostOnlyParams.SLIDE,
          }),
        ),
      ]);

      instructions.push(instruction);
    } else {
      // defaults to market order if type is not limit and price is not provided
      const instruction = await driftClient.getPlaceOrdersIx([
        getOrderParams(
          getMarketOrderParams({
            marketType: MarketType.PERP,
            baseAssetAmount: numberToSafeBN(baseAmount, BASE_PRECISION),
            direction:
              action === "long"
                ? PositionDirection.LONG
                : PositionDirection.SHORT,
            marketIndex: perpMarketAccount.marketIndex,
          }),
        ),
      ]);
      instructions.push(instruction);
    }

    const latestBlockhash = await driftClient.connection.getLatestBlockhash();
    const lookupTableAccount = await driftClient.connection.getAddressLookupTable(
      driftClient.marketLookupTable
    ).then(res => res.value);

    if (!lookupTableAccount) {
      throw new Error("Failed to fetch lookup table account");
    }

    const tx = await driftClient.txSender.sendVersionedTransaction(
      await driftClient.txSender.getVersionedTransaction(
        instructions,
        [lookupTableAccount],
        [],
        driftClient.opts,
        latestBlockhash,
      )
    );

    await cleanUp();

    return tx;
  } catch (e) {
    // @ts-expect-error - error message is a string
    throw new Error(`Failed to trade with Drift vault: ${e.message}`);
  }
}

export async function addLiquidityToDriftVault(
  agent: SolanaAgentKit,
  vault: string,
  poolId: string,
  amountInA: TokenAmount,
  amountInB: TokenAmount,
  otherAmountMin: TokenAmount,
  fixedSide: "a" | "b",
  config?: {
    bypassAssociatedCheck?: boolean;
    checkCreateATAOwner?: boolean;
  }
): Promise<string> {
  try {
    const { driftClient, cleanUp } = await initClients(agent, {
      authority: agent.wallet.publicKey,
      activeSubAccountId: 0,
      subAccountIds: [0],
    });

    const [isOwned, driftLookupTableAccount] = await Promise.all([
      getIsOwned(agent, vault),
      driftClient.fetchMarketLookupTableAccount(),
    ]);

    if (!isOwned) {
      throw new Error(
        "This vault is owned/delegated to someone else, you can't trade with it",
      );
    }

    const vaultPubkey = new PublicKey(vault);
    const raydium = await Raydium.load({
      owner: vaultPubkey,
      connection: agent.connection,
      apiRequestTimeout: 30000,
    });

    // Get pool info
    const data = await raydium.api.fetchPoolById({ ids: poolId });
    const poolInfo = data[0] as ApiV3PoolInfoStandardItem;

    if (amountInA.isZero() || amountInB.isZero()) {
      throw new Error("Amounts must be greater than zero");
    }

    const { account } = raydium;
    const { bypassAssociatedCheck = false, checkCreateATAOwner = false } = config || {};

    // Get token accounts
    const [tokenA, tokenB] = [amountInA.token, amountInB.token];
    const tokenAccountA = await account.getCreatedTokenAccount({
      mint: tokenA.mint,
      associatedOnly: false,
    });
    const tokenAccountB = await account.getCreatedTokenAccount({
      mint: tokenB.mint,
      associatedOnly: false,
    });

    if (!tokenAccountA || !tokenAccountB) {
      throw new Error(`Cannot find target token accounts. Token accounts: ${JSON.stringify(account.tokenAccounts)}`);
    }

    const lpTokenAccount = await account.getCreatedTokenAccount({
      mint: new PublicKey(poolInfo.lpMint),
      associatedOnly: false,
    });

    // Handle amount a & b and direction
    const sideA = amountInA.token.mint.toBase58() === poolInfo.mintA.address ? "base" : "quote";
    let _fixedSide: "base" | "quote" = "base";
    
    const tokens = [tokenA, tokenB];
    const tokenAccounts = [tokenAccountA, tokenAccountB];
    const rawAmounts = [amountInA.raw, amountInB.raw];

    if (sideA === "quote") {
      tokens.reverse();
      tokenAccounts.reverse();
      rawAmounts.reverse();
      _fixedSide = fixedSide === "a" ? "quote" : "base";
    } else {
      _fixedSide = fixedSide === "a" ? "base" : "quote";
    }

    const [baseToken, quoteToken] = tokens;
    const [baseTokenAccount, quoteTokenAccount] = tokenAccounts;
    const [baseAmountRaw, quoteAmountRaw] = rawAmounts;

    const instructions: TransactionInstruction[] = [];
    instructions.push(ComputeBudgetProgram.setComputeUnitLimit({ units: 1400000 }));

    // Handle token accounts
    const { tokenAccount: _baseTokenAccount, ...baseInstruction } = await account.handleTokenAccount({
      side: "in",
      amount: baseAmountRaw,
      mint: baseToken.mint,
      tokenAccount: baseTokenAccount!,
      bypassAssociatedCheck,
      checkCreateATAOwner,
    });
    if (baseInstruction.instructions) instructions.push(...baseInstruction.instructions);

    const { tokenAccount: _quoteTokenAccount, ...quoteInstruction } = await account.handleTokenAccount({
      side: "in",
      amount: quoteAmountRaw,
      mint: quoteToken.mint,
      tokenAccount: quoteTokenAccount!,
      bypassAssociatedCheck,
      checkCreateATAOwner,
    });
    if (quoteInstruction.instructions) instructions.push(...quoteInstruction.instructions);

    const { tokenAccount: _lpTokenAccount, ...lpInstruction } = await account.handleTokenAccount({
      side: "out",
      amount: new BN(0),
      mint: new PublicKey(poolInfo.lpMint),
      tokenAccount: lpTokenAccount!,
      bypassAssociatedCheck,
    });
    if (lpInstruction.instructions) instructions.push(...lpInstruction.instructions);

    // Get pool keys and create add liquidity instruction
    const poolKeys = await raydium.liquidity.getAmmPoolKeys(poolId);
    const addLiquidityInstruction = makeAddLiquidityInstruction({
      poolInfo,
      poolKeys,
      userKeys: {
        baseTokenAccount: _baseTokenAccount!,
        quoteTokenAccount: _quoteTokenAccount!,
        lpTokenAccount: _lpTokenAccount!,
        owner: vaultPubkey,
      },
      baseAmountIn: baseAmountRaw,
      quoteAmountIn: quoteAmountRaw,
      otherAmountMin: otherAmountMin.raw,
      fixedSide: _fixedSide,
    });

    instructions.push(addLiquidityInstruction);

    // Send transaction using drift client
    const latestBlockhash = await driftClient.connection.getLatestBlockhash();
    const lookupTableAccount = await driftClient.connection.getAddressLookupTable(
      driftClient.marketLookupTable
    ).then(res => res.value);

    if (!lookupTableAccount) {
      throw new Error("Failed to fetch lookup table account");
    }

    const txid = await driftClient.txSender.sendVersionedTransaction(
      await driftClient.txSender.getVersionedTransaction(
        instructions,
        [lookupTableAccount],
        [],
        driftClient.opts,
        latestBlockhash,
      )
    );
    
    await cleanUp();
    return txid.txSig;
  } catch (e) {
    // @ts-expect-error - error message is a string
    throw new Error(`Failed to add liquidity with Drift vault: ${e.message}`);
  }
}

export async function swapJupiterToDriftVault(
  agent: SolanaAgentKit,
  vault: string,
  params: {
    inputMint: PublicKey;
    outputMint: PublicKey;
    amount: InstanceType<typeof BN>;
    slippageBps?: number;
    swapMode?: "ExactIn" | "ExactOut";
  }
): Promise<string> {
  try {
    const { driftClient, vaultClient, cleanUp } = await initClients(agent, {
      authority: new PublicKey(vault),
      activeSubAccountId: 0,
      subAccountIds: [0],
    });

    const vaultPubkey = new PublicKey(vault);
    const [isOwned, driftLookupTableAccount, vaultAccount] = await Promise.all([
      getIsOwned(agent, vault),
      driftClient.fetchMarketLookupTableAccount(),
      vaultClient.getVault(vaultPubkey),
    ]);

    if (!isOwned) {
      throw new Error(
        "This vault is owned/delegated to someone else, you can't trade with it",
      );
    }

    const jupiterClient = new JupiterClient({ connection: agent.connection });

    // Get market indexes from mints
    const inputMarket = MainnetSpotMarkets.find(m => m.mint.equals(params.inputMint));
    const outputMarket = MainnetSpotMarkets.find(m => m.mint.equals(params.outputMint));
    
    if (!inputMarket || !outputMarket) {
      throw new Error("Could not find spot markets for input/output tokens");
    }

    // Get Jupiter swap instructions using drift client's method
    const { ixs, lookupTables } = await driftClient.getJupiterSwapIxV6({
      jupiterClient,
      inMarketIndex: inputMarket.marketIndex,
      outMarketIndex: outputMarket.marketIndex,
      amount: params.amount,
      slippageBps: params.slippageBps || 50,
      swapMode: params.swapMode || "ExactIn",
      userAccountPublicKey: vaultAccount.manager,
    });

    // Build final transaction with compute budget
    const instructions = [
      ComputeBudgetProgram.setComputeUnitLimit({ units: 1_400_000 }),
      ...ixs,
    ];

    // Send transaction using drift client
    const latestBlockhash = await driftClient.connection.getLatestBlockhash();
    const lookupTableAccount = await driftClient.connection.getAddressLookupTable(
      driftClient.marketLookupTable
    ).then(res => res.value);

    if (!lookupTableAccount) {
      throw new Error("Failed to fetch lookup table account");
    }

    const tx = await driftClient.txSender.sendVersionedTransaction(
      await driftClient.txSender.getVersionedTransaction(
        instructions,
        [...lookupTables, lookupTableAccount],
        [],
        driftClient.opts,
        latestBlockhash,
      )
    );

    await cleanUp();
    return tx.txSig;

  } catch (e) {
    // @ts-expect-error - error message is a string
    throw new Error(`Failed to swap via Jupiter to Drift vault: ${e.message}`);
  }
}

export async function addLiquidityBalToDriftVault(
  agent: SolanaAgentKit,
  vault: string,
  marketSymbol: string,
  bidSpreadBps: [number, number][],
  askSpreadBps: [number, number][],
): Promise<string> {
  try {
    const { driftClient, vaultClient, cleanUp }= await initClients(agent, {
      authority: new PublicKey(vault),
      activeSubAccountId: 0,
      subAccountIds: [0],
    });

    const [isOwned, driftLookupTableAccount] = await Promise.all([
      getIsOwned(agent, vault),
      driftClient.connection.getAddressLookupTable(
        // new PublicKey("FaMS3U4uBojvGn5FSDEPimddcXsCfwkKsFgMVVnDdxGb")
        driftClient.marketLookupTable
      ).then(res => res.value)
    ]);

    if (!isOwned) {
      throw new Error("Vault must be owned to add balanced liquidity");
    }

    // Market validation
    const marketInfo = getMarketIndexAndType(`${marketSymbol}-PERP`);
    const perpMarket = driftClient.getPerpMarketAccount(marketInfo.marketIndex);
    
    if (!perpMarket) {
      throw new Error(
        `Perp market not found for ${marketSymbol}-PERP. ` +
        `Valid markets: ${MainnetPerpMarkets.map(m => m.symbol).join(', ')}`
      );
    }

    // Oracle validation
    const oracleData = driftClient.getOracleDataForPerpMarket(marketInfo.marketIndex);
    if (!oracleData?.price) {
      throw new Error(`Oracle price not available for ${marketSymbol}-PERP`);
    }

    // Price calculations
    const oraclePrice = convertToNumber(oracleData.price, PRICE_PRECISION);


    // Size calculations
    const vaultValue = await getVaultAvailableBalance(agent, vault);

    const orders = [];
    let totalAmount = 0;
    for (const [amount, bidSpreadBp] of bidSpreadBps) {
      totalAmount += amount;

      const bidPrice = oraclePrice * (1 - bidSpreadBp / 10000);
      const baseAmountPerSide = (amount / oraclePrice) / 2; // Split amount evenly between bid and ask

      orders.push(
        getLimitOrderParams({
          marketType: MarketType.PERP,
          marketIndex: marketInfo.marketIndex,
          direction: PositionDirection.LONG,
          baseAssetAmount: numberToSafeBN(baseAmountPerSide, BASE_PRECISION),
          price: numberToSafeBN(bidPrice, PRICE_PRECISION),
          postOnly: PostOnlyParams.SLIDE,
        })
      )
    }

    for (const [amount, askSpreadBp] of askSpreadBps) {
      totalAmount += amount;

      const askPrice = oraclePrice * (1 + askSpreadBp / 10000);
      const baseAmountPerSide = (amount / oraclePrice) / 2; // Split amount evenly between bid and ask

      console.log("baseAmountPerSide", baseAmountPerSide);


      orders.push(
        getLimitOrderParams({
          marketType: MarketType.PERP,
          marketIndex: marketInfo.marketIndex,
          direction: PositionDirection.SHORT,
          baseAssetAmount: numberToSafeBN(baseAmountPerSide, BASE_PRECISION),
          price: numberToSafeBN(askPrice, PRICE_PRECISION),
          postOnly: PostOnlyParams.SLIDE,
        })
      )
      }

    if (totalAmount > vaultValue) {
      throw new Error(`Amount is greater than vault value : ${totalAmount} > ${vaultValue}`);
    }

    if (!driftLookupTableAccount) {
      throw new Error("Failed to fetch Drift market lookup table");
    }

    // Order construction
    const instructions = [
      ComputeBudgetProgram.setComputeUnitLimit({ units: 1_400_000 }),
      await driftClient.getPlaceOrdersIx(orders),
    ];
    

    // Transaction execution
    const latestBlockhash = await driftClient.connection.getLatestBlockhash();

    const tx = await driftClient.txSender.sendVersionedTransaction(
      await driftClient.txSender.getVersionedTransaction(
        instructions,
        [driftLookupTableAccount],
        [],
        driftClient.opts,
        latestBlockhash,
      )
    );

    await cleanUp();
    return tx.txSig;

  } catch (e) {
    throw new Error(`Failed to add balanced liquidity: ${(e as Error).message}`);
  }
}
