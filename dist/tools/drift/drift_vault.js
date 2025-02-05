"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndEncodeAddress = void 0;
exports.getMarketIndexAndType = getMarketIndexAndType;
exports.createVault = createVault;
exports.updateVaultDelegate = updateVaultDelegate;
exports.updateVault = updateVault;
exports.getVaultInfo = getVaultInfo;
exports.depositIntoVault = depositIntoVault;
exports.requestWithdrawalFromVault = requestWithdrawalFromVault;
exports.withdrawFromDriftVault = withdrawFromDriftVault;
exports.getVaultAddress = getVaultAddress;
exports.tradeDriftVault = tradeDriftVault;
exports.swapJupiterToDriftVault = swapJupiterToDriftVault;
exports.addLiquidityBalToDriftVault = addLiquidityBalToDriftVault;
exports.removeLiquidityBalFromDriftVault = removeLiquidityBalFromDriftVault;
const sdk_1 = require("@drift-labs/sdk");
const vaults_sdk_1 = require("@drift-labs/vaults-sdk");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = require("bn.js");
const drift_1 = require("./drift");
const sdk_2 = require("@drift-labs/sdk");
let lastBid;
let lastAsk;
const SUFFICIENT_QUOTE_CHANGE_BPS = 2; // only requote if quote price changes by 2 bps
const BPS_BASE = 10000;
function sufficientQuoteChange(newBid, newAsk) {
    if (lastBid === undefined || lastAsk === undefined) {
        return true;
    }
    const bidDiff = newBid / lastBid - 1;
    const askDiff = newAsk / lastAsk - 1;
    if (Math.abs(bidDiff) > SUFFICIENT_QUOTE_CHANGE_BPS / BPS_BASE ||
        Math.abs(askDiff) > SUFFICIENT_QUOTE_CHANGE_BPS / BPS_BASE) {
        return true;
    }
    return false;
}
function getMarketIndexAndType(name) {
    const [symbol, type] = name.toUpperCase().split("-");
    if (type === "PERP") {
        const token = sdk_1.MainnetPerpMarkets.find((v) => v.baseAssetSymbol === symbol);
        if (!token) {
            throw new Error(`Drift doesn't have that market. Here's a list of available perp markets: ${sdk_1.MainnetPerpMarkets.map((v) => v.baseAssetSymbol).join(", ")}`);
        }
        return { marketIndex: token.marketIndex, marketType: sdk_1.MarketType.PERP };
    }
    const token = sdk_1.MainnetSpotMarkets.find((v) => v.symbol === symbol);
    if (!token) {
        throw new Error(`Drift doesn't have that market. Here's a list of available spot markets: ${sdk_1.MainnetSpotMarkets.map((v) => v.symbol).join(", ")}`);
    }
    return { marketIndex: token.marketIndex, marketType: sdk_1.MarketType.SPOT };
}
async function getOrCreateVaultDepositor(agent, vault) {
    const { vaultClient, cleanUp } = await (0, drift_1.initClients)(agent);
    const vaultPublicKey = new web3_js_1.PublicKey(vault);
    const vaultDepositor = (0, vaults_sdk_1.getVaultDepositorAddressSync)(vaultClient.program.programId, vaultPublicKey, agent.wallet.publicKey);
    try {
        await vaultClient.getVaultDepositor(vaultDepositor);
        await cleanUp();
        return vaultDepositor;
    }
    catch (e) {
        // @ts-expect-error - error message is a string
        if (e.message.includes("Account does not exist")) {
            await vaultClient.initializeVaultDepositor(vaultPublicKey, agent.wallet.publicKey);
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await cleanUp();
        return vaultDepositor;
    }
}
async function getVaultAvailableBalance(agent, vault) {
    try {
        const { cleanUp, vaultClient } = await (0, drift_1.initClients)(agent);
        const vaultDetails = await vaultClient.getVault(new web3_js_1.PublicKey(vault));
        const currentVaultBalance = (0, sdk_1.convertToNumber)(vaultDetails.netDeposits, sdk_1.QUOTE_PRECISION);
        const vaultWithdrawalsRequested = (0, sdk_1.convertToNumber)(vaultDetails.totalWithdrawRequested, sdk_1.QUOTE_PRECISION);
        const availableBalanceInUSD = currentVaultBalance - vaultWithdrawalsRequested;
        await cleanUp();
        return availableBalanceInUSD;
    }
    catch (e) {
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
async function createVault(agent, params) {
    try {
        const { vaultClient, driftClient, cleanUp } = await (0, drift_1.initClients)(agent);
        const marketIndexAndType = getMarketIndexAndType(params.marketName);
        const spotMarket = driftClient.getSpotMarketAccount(marketIndexAndType.marketIndex);
        if (!spotMarket) {
            throw new Error(`Market not found. Here's a list of available spot markets: ${sdk_1.MainnetSpotMarkets.map((v) => `${v.symbol}-SPOT`).join(", ")}`);
        }
        const spotPrecision = sdk_1.TEN.pow(new bn_js_1.BN(spotMarket.decimals));
        if (marketIndexAndType.marketType === sdk_1.MarketType.PERP) {
            throw new Error(`Only SPOT market names are supported. Such as ${sdk_1.MainnetSpotMarkets.map((v) => `${v.symbol}-SPOT`).join(", ")}`);
        }
        const tx = await vaultClient.initializeVault({
            name: (0, vaults_sdk_1.encodeName)(params.name),
            spotMarketIndex: marketIndexAndType.marketIndex,
            hurdleRate: new bn_js_1.BN(params.hurdleRate ?? 0)
                .mul(sdk_1.PERCENTAGE_PRECISION)
                .div(new bn_js_1.BN(100))
                .toNumber(),
            profitShare: new bn_js_1.BN(params.profitShare)
                .mul(sdk_1.PERCENTAGE_PRECISION)
                .div(new bn_js_1.BN(100))
                .toNumber(),
            minDepositAmount: (0, sdk_1.numberToSafeBN)(params.minDepositAmount, spotPrecision),
            redeemPeriod: new bn_js_1.BN(params.redeemPeriod * 86400),
            maxTokens: (0, sdk_1.numberToSafeBN)(params.maxTokens, spotPrecision),
            managementFee: new bn_js_1.BN(params.managementFee)
                .mul(sdk_1.PERCENTAGE_PRECISION)
                .div(new bn_js_1.BN(100)),
            permissioned: params.permissioned ?? false,
        });
        await cleanUp();
        return tx;
    }
    catch (e) {
        // @ts-expect-error - error message is a string
        throw new Error(`Failed to create Drift vault: ${e.message}`);
    }
}
async function updateVaultDelegate(agent, vault, delegateAddress) {
    try {
        const { vaultClient, cleanUp } = await (0, drift_1.initClients)(agent);
        const signature = await vaultClient.updateDelegate(new web3_js_1.PublicKey(vault), new web3_js_1.PublicKey(delegateAddress));
        await cleanUp();
        return signature;
    }
    catch (e) {
        throw new Error(
        // @ts-expect-error - error message is a string
        `Failed to update vault delegate: ${e.message}`);
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
async function updateVault(agent, vault, params) {
    try {
        const { vaultClient, cleanUp, driftClient } = await (0, drift_1.initClients)(agent);
        const vaultPublicKey = new web3_js_1.PublicKey(vault);
        const vaultDetails = await vaultClient.getVault(vaultPublicKey);
        const spotMarket = driftClient.getSpotMarketAccount(vaultDetails.spotMarketIndex);
        if (!spotMarket) {
            throw new Error("Market not found. This vault's market is no longer supported");
        }
        const spotPrecision = sdk_1.TEN.pow(new bn_js_1.BN(spotMarket.decimals));
        const tx = await vaultClient.managerUpdateVault(vaultPublicKey, {
            redeemPeriod: params.redeemPeriod
                ? new bn_js_1.BN(params.redeemPeriod * 86400)
                : null,
            maxTokens: params.maxTokens
                ? (0, sdk_1.numberToSafeBN)(params.maxTokens, spotPrecision)
                : null,
            minDepositAmount: params.minDepositAmount
                ? (0, sdk_1.numberToSafeBN)(params.minDepositAmount, spotPrecision)
                : null,
            managementFee: params.managementFee
                ? new bn_js_1.BN(params.managementFee)
                    .mul(sdk_1.PERCENTAGE_PRECISION)
                    .div(new bn_js_1.BN(100))
                : null,
            profitShare: params.profitShare
                ? new bn_js_1.BN(params.profitShare)
                    .mul(sdk_1.PERCENTAGE_PRECISION)
                    .div(new bn_js_1.BN(100))
                    .toNumber()
                : null,
            hurdleRate: params.hurdleRate
                ? new bn_js_1.BN(params.hurdleRate)
                    .mul(sdk_1.PERCENTAGE_PRECISION)
                    .div(new bn_js_1.BN(100))
                    .toNumber()
                : null,
            permissioned: params.permissioned ?? vaultDetails.permissioned,
        });
        await cleanUp();
        return tx;
    }
    catch (e) {
        // @ts-expect-error - error message is a string
        throw new Error(`Failed to update Drift vault: ${e.message}`);
    }
}
const validateAndEncodeAddress = (input, programId) => {
    try {
        return new web3_js_1.PublicKey(input);
    }
    catch {
        return (0, vaults_sdk_1.getVaultAddressSync)(new web3_js_1.PublicKey(programId), (0, vaults_sdk_1.encodeName)(input));
    }
};
exports.validateAndEncodeAddress = validateAndEncodeAddress;
/**
 * Get information on a particular vault given its name
 * @param agent
 * @param vaultNameOrAddress
 * @returns
 */
async function getVaultInfo(agent, vaultNameOrAddress) {
    try {
        const { vaultClient, cleanUp } = await (0, drift_1.initClients)(agent);
        const vaultPublicKey = (0, exports.validateAndEncodeAddress)(vaultNameOrAddress, vaultClient.program.programId.toBase58());
        const [vaultDetails, vaultBalance] = await Promise.all([
            vaultClient.getVault(vaultPublicKey),
            getVaultAvailableBalance(agent, vaultPublicKey.toBase58()),
        ]);
        await cleanUp();
        const spotToken = sdk_1.MainnetSpotMarkets[vaultDetails.spotMarketIndex];
        const data = {
            name: (0, vaults_sdk_1.decodeName)(vaultDetails.name),
            delegate: vaultDetails.delegate.toBase58(),
            address: vaultPublicKey.toBase58(),
            marketName: `${spotToken.symbol}-SPOT`,
            balance: `${vaultBalance} ${spotToken.symbol}`,
            redeemPeriod: vaultDetails.redeemPeriod.toNumber(),
            maxTokens: vaultDetails.maxTokens.div(spotToken.precision).toNumber(),
            minDepositAmount: vaultDetails.minDepositAmount
                .div(spotToken.precision)
                .toNumber(),
            managementFee: (vaultDetails.managementFee.toNumber() /
                sdk_1.PERCENTAGE_PRECISION.toNumber()) *
                100,
            profitShare: (vaultDetails.profitShare / sdk_1.PERCENTAGE_PRECISION.toNumber()) * 100,
            hurdleRate: (vaultDetails.hurdleRate / sdk_1.PERCENTAGE_PRECISION.toNumber()) * 100,
            permissioned: vaultDetails.permissioned,
        };
        return data;
    }
    catch (e) {
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
async function depositIntoVault(agent, amount, vault) {
    const { vaultClient, driftClient, cleanUp } = await (0, drift_1.initClients)(agent);
    try {
        const vaultPublicKey = new web3_js_1.PublicKey(vault);
        const [isOwned, vaultDetails, vaultDepositor] = await Promise.all([
            getIsOwned(agent, vault),
            vaultClient.getVault(vaultPublicKey),
            getOrCreateVaultDepositor(agent, vault),
        ]);
        const spotMarket = driftClient.getSpotMarketAccount(vaultDetails.spotMarketIndex);
        if (!spotMarket) {
            throw new Error("Market not found. This vaults market is no longer supported");
        }
        const spotPrecision = sdk_1.TEN.pow(new bn_js_1.BN(spotMarket.decimals));
        const amountBN = (0, sdk_1.numberToSafeBN)(amount, spotPrecision);
        if (isOwned) {
            return await vaultClient.managerDeposit(vaultPublicKey, amountBN);
        }
        const tx = await vaultClient.deposit(vaultDepositor, amountBN);
        await cleanUp();
        return tx;
    }
    catch (e) {
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
async function requestWithdrawalFromVault(agent, amount, vault) {
    try {
        const { vaultClient, cleanUp } = await (0, drift_1.initClients)(agent);
        const vaultPublicKey = new web3_js_1.PublicKey(vault);
        const isOwned = await getIsOwned(agent, vault);
        if (isOwned) {
            return await vaultClient.managerRequestWithdraw(vaultPublicKey, (0, sdk_1.numberToSafeBN)(amount, sdk_1.QUOTE_PRECISION), vaults_sdk_1.WithdrawUnit.TOKEN);
        }
        const vaultDepositor = await getOrCreateVaultDepositor(agent, vault);
        const tx = await vaultClient.requestWithdraw(vaultDepositor, (0, sdk_1.numberToSafeBN)(amount, sdk_1.QUOTE_PRECISION), vaults_sdk_1.WithdrawUnit.TOKEN);
        await cleanUp();
        return tx;
    }
    catch (e) {
        throw new Error(
        // @ts-expect-error - error message is a string
        `Failed to request withdrawal from Drift vault: ${e.message}`);
    }
}
/**
  Withdraw tokens once the redemption period has elapsed.
  @param agent SolanaAgentKit instance
  @param vault Vault address
  @returns Promise<anchor.Web3.TransactionSignature> - The transaction signature of the redemption
*/
async function withdrawFromDriftVault(agent, vault) {
    try {
        const { vaultClient, cleanUp } = await (0, drift_1.initClients)(agent);
        const vaultPublicKey = new web3_js_1.PublicKey(vault);
        const isOwned = await getIsOwned(agent, vault);
        if (isOwned) {
            return await vaultClient.managerWithdraw(vaultPublicKey);
        }
        const vaultDepositor = await getOrCreateVaultDepositor(agent, vault);
        const tx = await vaultClient.withdraw(vaultDepositor);
        await cleanUp();
        return tx;
    }
    catch (e) {
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
async function getIsOwned(agent, vault) {
    try {
        const { vaultClient, cleanUp } = await (0, drift_1.initClients)(agent);
        const vaultPublicKey = new web3_js_1.PublicKey(vault);
        const vaultDetails = await vaultClient.getVault(vaultPublicKey);
        const isOwned = vaultDetails.manager.equals(agent.wallet.publicKey);
        await cleanUp();
        return isOwned;
    }
    catch (e) {
        // @ts-expect-error - error message is a string
        throw new Error(`Failed to check if vault is owned: ${e.message}`);
    }
}
/**
 * Get a vaults address using the vault's name
 * @param agent
 * @param name
 */
async function getVaultAddress(agent, name) {
    const encodedName = (0, vaults_sdk_1.encodeName)(name);
    try {
        const { vaultClient, cleanUp } = await (0, drift_1.initClients)(agent);
        const vaultAddress = (0, vaults_sdk_1.getVaultAddressSync)(vaultClient.program.programId, encodedName);
        await cleanUp();
        return vaultAddress;
    }
    catch (e) {
        throw new Error(
        // @ts-expect-error - error message is a string
        `Failed to get vault address: ${e.message}`);
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
async function tradeDriftVault(agent, vault, amount, symbol, action, type, price) {
    try {
        const { driftClient, cleanUp } = await (0, drift_1.initClients)(agent, {
            authority: new web3_js_1.PublicKey(vault),
            activeSubAccountId: 0,
            subAccountIds: [6],
        });
        const [isOwned, driftLookupTableAccount] = await Promise.all([
            getIsOwned(agent, vault),
            driftClient.fetchMarketLookupTableAccount(),
        ]);
        if (!isOwned) {
            throw new Error("This vault is owned/delegated to someone else, you can't trade with it");
        }
        const usdcSpotMarket = driftClient.getSpotMarketAccount(0);
        if (!usdcSpotMarket) {
            throw new Error("USDC-SPOT market not found");
        }
        const perpMarketIndexAndType = getMarketIndexAndType(`${symbol.toUpperCase()}-PERP`);
        const perpMarketAccount = driftClient.getPerpMarketAccount(perpMarketIndexAndType.marketIndex);
        if (!perpMarketIndexAndType || !perpMarketAccount) {
            throw new Error("Invalid symbol: Drift doesn't have a market for this token");
        }
        const perpOracle = driftClient.getOracleDataForPerpMarket(perpMarketAccount.marketIndex);
        const oraclePriceNumber = (0, sdk_1.convertToNumber)(perpOracle.price, sdk_1.PRICE_PRECISION);
        const baseAmount = amount / oraclePriceNumber;
        const instructions = [];
        instructions.push(web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({ units: 1400000 }));
        if (type === "limit" || price) {
            if (!price) {
                throw new Error("Price is required for limit orders");
            }
            const instruction = await driftClient.getPlaceOrdersIx([
                (0, sdk_1.getOrderParams)((0, sdk_1.getLimitOrderParams)({
                    price: (0, sdk_1.numberToSafeBN)(price, sdk_1.PRICE_PRECISION),
                    marketType: sdk_1.MarketType.PERP,
                    baseAssetAmount: (0, sdk_1.numberToSafeBN)(baseAmount, sdk_1.BASE_PRECISION),
                    direction: action === "long"
                        ? sdk_1.PositionDirection.LONG
                        : sdk_1.PositionDirection.SHORT,
                    marketIndex: perpMarketAccount.marketIndex,
                    postOnly: sdk_1.PostOnlyParams.SLIDE,
                })),
            ]);
            instructions.push(instruction);
        }
        else {
            // defaults to market order if type is not limit and price is not provided
            const instruction = await driftClient.getPlaceOrdersIx([
                (0, sdk_1.getOrderParams)((0, sdk_1.getMarketOrderParams)({
                    marketType: sdk_1.MarketType.PERP,
                    baseAssetAmount: (0, sdk_1.numberToSafeBN)(baseAmount, sdk_1.BASE_PRECISION),
                    direction: action === "long"
                        ? sdk_1.PositionDirection.LONG
                        : sdk_1.PositionDirection.SHORT,
                    marketIndex: perpMarketAccount.marketIndex,
                })),
            ]);
            instructions.push(instruction);
        }
        const latestBlockhash = await driftClient.connection.getLatestBlockhash();
        const lookupTableAccount = await driftClient.connection
            .getAddressLookupTable(driftClient.marketLookupTable)
            .then((res) => res.value);
        if (!lookupTableAccount) {
            throw new Error("Failed to fetch lookup table account");
        }
        const tx = await driftClient.txSender.sendVersionedTransaction(await driftClient.txSender.getVersionedTransaction(instructions, [lookupTableAccount], [], driftClient.opts, latestBlockhash));
        await cleanUp();
        return tx;
    }
    catch (e) {
        // @ts-expect-error - error message is a string
        throw new Error(`Failed to trade with Drift vault: ${e.message}`);
    }
}
// export async function addLiquidityToDriftVault(
//   agent: SolanaAgentKit,
//   vault: string,
//   poolId: string,
//   amountInA: TokenAmount,
//   amountInB: TokenAmount,
//   otherAmountMin: TokenAmount,
//   fixedSide: "a" | "b",
//   config?: {
//     bypassAssociatedCheck?: boolean;
//     checkCreateATAOwner?: boolean;
//   },
// ): Promise<string> {
//   try {
//     const { driftClient, cleanUp } = await initClients(agent, {
//       authority: agent.wallet.publicKey,
//       activeSubAccountId: 0,
//       subAccountIds: [0],
//     });
//     const [isOwned, driftLookupTableAccount] = await Promise.all([
//       getIsOwned(agent, vault),
//       driftClient.fetchMarketLookupTableAccount(),
//     ]);
//     if (!isOwned) {
//       throw new Error(
//         "This vault is owned/delegated to someone else, you can't trade with it",
//       );
//     }
//     const vaultPubkey = new PublicKey(vault);
//     const raydium = await Raydium.load({
//       owner: vaultPubkey,
//       connection: agent.connection,
//       apiRequestTimeout: 30000,
//     });
//     // Get pool info
//     const data = await raydium.api.fetchPoolById({ ids: poolId });
//     const poolInfo = data[0] as ApiV3PoolInfoStandardItem;
//     if (amountInA.isZero() || amountInB.isZero()) {
//       throw new Error("Amounts must be greater than zero");
//     }
//     const { account } = raydium;
//     const { bypassAssociatedCheck = false, checkCreateATAOwner = false } =
//       config || {};
//     // Get token accounts
//     const [tokenA, tokenB] = [amountInA.token, amountInB.token];
//     const tokenAccountA = await account.getCreatedTokenAccount({
//       mint: tokenA.mint,
//       associatedOnly: false,
//     });
//     const tokenAccountB = await account.getCreatedTokenAccount({
//       mint: tokenB.mint,
//       associatedOnly: false,
//     });
//     if (!tokenAccountA || !tokenAccountB) {
//       throw new Error(
//         `Cannot find target token accounts. Token accounts: ${JSON.stringify(account.tokenAccounts)}`,
//       );
//     }
//     const lpTokenAccount = await account.getCreatedTokenAccount({
//       mint: new PublicKey(poolInfo.lpMint),
//       associatedOnly: false,
//     });
//     // Handle amount a & b and direction
//     const sideA =
//       amountInA.token.mint.toBase58() === poolInfo.mintA.address
//         ? "base"
//         : "quote";
//     let _fixedSide: "base" | "quote" = "base";
//     const tokens = [tokenA, tokenB];
//     const tokenAccounts = [tokenAccountA, tokenAccountB];
//     const rawAmounts = [amountInA.raw, amountInB.raw];
//     if (sideA === "quote") {
//       tokens.reverse();
//       tokenAccounts.reverse();
//       rawAmounts.reverse();
//       _fixedSide = fixedSide === "a" ? "quote" : "base";
//     } else {
//       _fixedSide = fixedSide === "a" ? "base" : "quote";
//     }
//     const [baseToken, quoteToken] = tokens;
//     const [baseTokenAccount, quoteTokenAccount] = tokenAccounts;
//     const [baseAmountRaw, quoteAmountRaw] = rawAmounts;
//     const instructions: TransactionInstruction[] = [];
//     instructions.push(
//       ComputeBudgetProgram.setComputeUnitLimit({ units: 1400000 }),
//     );
//     // Handle token accounts
//     const { tokenAccount: _baseTokenAccount, ...baseInstruction } =
//       await account.handleTokenAccount({
//         side: "in",
//         amount: baseAmountRaw,
//         mint: baseToken.mint,
//         tokenAccount: baseTokenAccount!,
//         bypassAssociatedCheck,
//         checkCreateATAOwner,
//       });
//     if (baseInstruction.instructions)
//       instructions.push(...baseInstruction.instructions);
//     const { tokenAccount: _quoteTokenAccount, ...quoteInstruction } =
//       await account.handleTokenAccount({
//         side: "in",
//         amount: quoteAmountRaw,
//         mint: quoteToken.mint,
//         tokenAccount: quoteTokenAccount!,
//         bypassAssociatedCheck,
//         checkCreateATAOwner,
//       });
//     if (quoteInstruction.instructions)
//       instructions.push(...quoteInstruction.instructions);
//     const { tokenAccount: _lpTokenAccount, ...lpInstruction } =
//       await account.handleTokenAccount({
//         side: "out",
//         amount: new BN(0),
//         mint: new PublicKey(poolInfo.lpMint),
//         tokenAccount: lpTokenAccount!,
//         bypassAssociatedCheck,
//       });
//     if (lpInstruction.instructions)
//       instructions.push(...lpInstruction.instructions);
//     // Get pool keys and create add liquidity instruction
//     const poolKeys = await raydium.liquidity.getAmmPoolKeys(poolId);
//     const addLiquidityInstruction = makeAddLiquidityInstruction({
//       poolInfo,
//       poolKeys,
//       userKeys: {
//         baseTokenAccount: _baseTokenAccount!,
//         quoteTokenAccount: _quoteTokenAccount!,
//         lpTokenAccount: _lpTokenAccount!,
//         owner: vaultPubkey,
//       },
//       baseAmountIn: baseAmountRaw,
//       quoteAmountIn: quoteAmountRaw,
//       otherAmountMin: otherAmountMin.raw,
//       fixedSide: _fixedSide,
//     });
//     instructions.push(addLiquidityInstruction);
//     // Send transaction using drift client
//     const latestBlockhash = await driftClient.connection.getLatestBlockhash();
//     const lookupTableAccount = await driftClient.connection
//       .getAddressLookupTable(driftClient.marketLookupTable)
//       .then((res) => res.value);
//     if (!lookupTableAccount) {
//       throw new Error("Failed to fetch lookup table account");
//     }
//     const txid = await driftClient.txSender.sendVersionedTransaction(
//       await driftClient.txSender.getVersionedTransaction(
//         instructions,
//         [lookupTableAccount],
//         [],
//         driftClient.opts,
//         latestBlockhash,
//       ),
//     );
//     await cleanUp();
//     return txid.txSig;
//   } catch (e) {
//     // @ts-expect-error - error message is a string
//     throw new Error(`Failed to add liquidity with Drift vault: ${e.message}`);
//   }
// }
async function swapJupiterToDriftVault(agent, vault, params) {
    try {
        const { driftClient, vaultClient, cleanUp } = await (0, drift_1.initClients)(agent, {
            authority: new web3_js_1.PublicKey(vault),
            activeSubAccountId: 0,
            subAccountIds: [0],
        });
        const vaultPubkey = new web3_js_1.PublicKey(vault);
        const [isOwned, driftLookupTableAccount, vaultAccount] = await Promise.all([
            getIsOwned(agent, vault),
            driftClient.fetchMarketLookupTableAccount(),
            vaultClient.getVault(vaultPubkey),
        ]);
        if (!isOwned) {
            throw new Error("This vault is owned/delegated to someone else, you can't trade with it");
        }
        const jupiterClient = new sdk_1.JupiterClient({ connection: agent.connection });
        // Get market indexes from mints
        const inputMarket = sdk_1.MainnetSpotMarkets.find((m) => m.mint.equals(params.inputMint));
        const outputMarket = sdk_1.MainnetSpotMarkets.find((m) => m.mint.equals(params.outputMint));
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
            web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({ units: 1400000 }),
            ...ixs,
        ];
        // Send transaction using drift client
        const latestBlockhash = await driftClient.connection.getLatestBlockhash();
        const lookupTableAccount = await driftClient.connection
            .getAddressLookupTable(driftClient.marketLookupTable)
            .then((res) => res.value);
        if (!lookupTableAccount) {
            throw new Error("Failed to fetch lookup table account");
        }
        const tx = await driftClient.txSender.sendVersionedTransaction(await driftClient.txSender.getVersionedTransaction(instructions, [...lookupTables, lookupTableAccount], [], driftClient.opts, latestBlockhash));
        await cleanUp();
        return tx.txSig;
    }
    catch (e) {
        // @ts-expect-error - error message is a string
        throw new Error(`Failed to swap via Jupiter to Drift vault: ${e.message}`);
    }
}
// LP Utils
function getLpSharesAmountForQuote(driftClient, marketIndex, quoteAmount) {
    const tenMillionBigNum = sdk_2.BigNum.fromPrint("10000000", sdk_1.QUOTE_PRECISION_EXP);
    const pricePerLpShare = driftClient.getQuoteValuePerLpShare(marketIndex);
    const result = sdk_2.BigNum.from(quoteAmount.toString(), sdk_1.QUOTE_PRECISION_EXP)
        .scale(tenMillionBigNum.toNum(), sdk_2.BigNum.from(pricePerLpShare.toString(), sdk_1.QUOTE_PRECISION_EXP)
        .mul(tenMillionBigNum)
        .toNum())
        .shiftTo(sdk_1.AMM_RESERVE_PRECISION_EXP);
    return new bn_js_1.BN(result.val.toString());
}
async function addLiquidityBalToDriftVault(agent, vault, symbol, amount) {
    try {
        const { driftClient, cleanUp } = await (0, drift_1.initClients)(agent, {
            authority: new web3_js_1.PublicKey(vault),
            activeSubAccountId: 0,
            subAccountIds: [0],
        });
        const [isOwned, driftLookupTableAccount] = await Promise.all([
            getIsOwned(agent, vault),
            driftClient.connection
                .getAddressLookupTable(new web3_js_1.PublicKey("FaMS3U4uBojvGn5FSDEPimddcXsCfwkKsFgMVVnDdxGb"))
                .then((res) => res.value),
        ]);
        if (!isOwned) {
            throw new Error("Vault must be owned to add liquidity");
        }
        if (!driftLookupTableAccount) {
            throw new Error("Failed to fetch Drift market lookup table");
        }
        // Market validation
        const marketInfo = getMarketIndexAndType(`${symbol}-PERP`);
        const perpMarket = driftClient.getPerpMarketAccount(marketInfo.marketIndex);
        if (!perpMarket) {
            throw new Error(`Perp market not found for ${symbol}-PERP. ` +
                `Valid markets: ${sdk_1.MainnetPerpMarkets.map((m) => m.symbol).join(", ")}`);
        }
        const instructions = [
            web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({ units: 98160 }),
            web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 306761 }),
        ];
        const quoteAmount = new bn_js_1.BN(amount * sdk_1.QUOTE_PRECISION.toNumber());
        const lpSharesAmount = getLpSharesAmountForQuote(driftClient, marketInfo.marketIndex, quoteAmount);
        const addLpSharesIx = await driftClient.getAddPerpLpSharesIx(lpSharesAmount, marketInfo.marketIndex);
        instructions.push(addLpSharesIx);
        const latestBlockhash = await driftClient.connection.getLatestBlockhash();
        const tx = await driftClient.txSender.sendVersionedTransaction(await driftClient.txSender.getVersionedTransaction(instructions, [driftLookupTableAccount], [], driftClient.opts, latestBlockhash));
        await cleanUp();
        return tx.txSig;
    }
    catch (e) {
        throw new Error(`Failed to add liquidity: ${e.message}`);
    }
}
async function removeLiquidityBalFromDriftVault(agent, vault, symbol) {
    try {
        const { driftClient, cleanUp } = await (0, drift_1.initClients)(agent, {
            authority: new web3_js_1.PublicKey(vault),
            activeSubAccountId: 0,
            subAccountIds: [0],
        });
        const [isOwned, driftLookupTableAccount] = await Promise.all([
            getIsOwned(agent, vault),
            driftClient.connection
                .getAddressLookupTable(new web3_js_1.PublicKey("FaMS3U4uBojvGn5FSDEPimddcXsCfwkKsFgMVVnDdxGb"))
                .then((res) => res.value),
        ]);
        if (!isOwned) {
            throw new Error("Vault must be owned to remove liquidity");
        }
        if (!driftLookupTableAccount) {
            throw new Error("Failed to fetch Drift market lookup table");
        }
        // Market validation
        const marketInfo = getMarketIndexAndType(`${symbol}-PERP`);
        const perpMarket = driftClient.getPerpMarketAccount(marketInfo.marketIndex);
        if (!perpMarket) {
            throw new Error(`Perp market not found for ${symbol}-PERP. ` +
                `Valid markets: ${sdk_1.MainnetPerpMarkets.map((m) => m.symbol).join(", ")}`);
        }
        const instructions = [
            web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({ units: 98160 }),
            web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 306761 }),
        ];
        const removeLpSharesIx = await driftClient.getRemovePerpLpSharesIx(marketInfo.marketIndex);
        instructions.push(removeLpSharesIx);
        const latestBlockhash = await driftClient.connection.getLatestBlockhash();
        const tx = await driftClient.txSender.sendVersionedTransaction(await driftClient.txSender.getVersionedTransaction(instructions, [driftLookupTableAccount], [], driftClient.opts, latestBlockhash));
        await cleanUp();
        return tx.txSig;
    }
    catch (e) {
        throw new Error(`Failed to remove liquidity: ${e.message}`);
    }
}
//# sourceMappingURL=drift_vault.js.map