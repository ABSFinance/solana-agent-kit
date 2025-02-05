import { PublicKey } from "@solana/web3.js";
import type SolanaAgentKit from "../../agent";
import { BN } from "bn.js";
export declare function getMarketIndexAndType(name: `${string}-${string}`): {
    marketIndex: number;
    marketType: {
        perp: {};
    };
} | {
    marketIndex: number;
    marketType: {
        spot: {};
    };
};
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
export declare function createVault(agent: SolanaAgentKit, params: {
    name: string;
    marketName: `${string}-${string}`;
    redeemPeriod: number;
    maxTokens: number;
    minDepositAmount: number;
    managementFee: number;
    profitShare: number;
    hurdleRate?: number;
    permissioned?: boolean;
}): Promise<string>;
export declare function updateVaultDelegate(agent: SolanaAgentKit, vault: string, delegateAddress: string): Promise<string>;
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
export declare function updateVault(agent: SolanaAgentKit, vault: string, params: {
    redeemPeriod?: number;
    maxTokens?: number;
    minDepositAmount?: number;
    managementFee?: number;
    profitShare?: number;
    hurdleRate?: number;
    permissioned?: boolean;
}): Promise<string>;
export declare const validateAndEncodeAddress: (input: string, programId: string) => PublicKey;
/**
 * Get information on a particular vault given its name
 * @param agent
 * @param vaultNameOrAddress
 * @returns
 */
export declare function getVaultInfo(agent: SolanaAgentKit, vaultNameOrAddress: string): Promise<{
    name: string;
    delegate: string;
    address: string;
    marketName: string;
    balance: string;
    redeemPeriod: number;
    maxTokens: number;
    minDepositAmount: number;
    managementFee: number;
    profitShare: number;
    hurdleRate: number;
    permissioned: boolean;
}>;
/**
  Deposit tokens into a vault
  @param agent SolanaAgentKit instance
  @param amount Amount to deposit into the vault (in tokens)
  @param vault Vault address
  @returns Promise<anchor.Web3.TransactionSignature> - The transaction signature of the deposit
*/
export declare function depositIntoVault(agent: SolanaAgentKit, amount: number, vault: string): Promise<string>;
/**
  Request a withdrawal from a vault. If successful redemption period starts and the user can redeem the tokens after the period ends
  @param agent SolanaAgentKit instance
  @param amount Amount to withdraw from the vault (in shares)
  @param vault Vault address
*/
export declare function requestWithdrawalFromVault(agent: SolanaAgentKit, amount: number, vault: string): Promise<string>;
/**
  Withdraw tokens once the redemption period has elapsed.
  @param agent SolanaAgentKit instance
  @param vault Vault address
  @returns Promise<anchor.Web3.TransactionSignature> - The transaction signature of the redemption
*/
export declare function withdrawFromDriftVault(agent: SolanaAgentKit, vault: string): Promise<string>;
/**
 * Get a vaults address using the vault's name
 * @param agent
 * @param name
 */
export declare function getVaultAddress(agent: SolanaAgentKit, name: string): Promise<PublicKey>;
/**
  Carry out a trade with a delegated vault
  @param agent SolanaAgentKit instance
  @param amount Amount to trade (in tokens)
  @param symbol Symbol of the token to trade
  @param action Action to take (e.g. "buy" or "sell")
  @param type Type of trade (e.g. "market" or "limit")
  @param vault Vault address
*/
export declare function tradeDriftVault(agent: SolanaAgentKit, vault: string, amount: number, symbol: string, action: "long" | "short", type: "market" | "limit", price?: number): Promise<import("@drift-labs/sdk").TxSigAndSlot>;
export declare function swapJupiterToDriftVault(agent: SolanaAgentKit, vault: string, params: {
    inputMint: PublicKey;
    outputMint: PublicKey;
    amount: InstanceType<typeof BN>;
    slippageBps?: number;
    swapMode?: "ExactIn" | "ExactOut";
}): Promise<string>;
export declare function addLiquidityBalToDriftVault(agent: SolanaAgentKit, vault: string, symbol: string, amount: number): Promise<string>;
export declare function removeLiquidityBalFromDriftVault(agent: SolanaAgentKit, vault: string, symbol: string): Promise<string>;
//# sourceMappingURL=drift_vault.d.ts.map