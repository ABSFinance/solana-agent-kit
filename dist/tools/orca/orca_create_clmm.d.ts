import { PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "../../agent";
import { Decimal } from "decimal.js";
import { FEE_TIERS } from "./orca_create_single_sided_liquidity_pool";
/**
 * # Creates a CLMM Pool (Concentrated Liquidity Market Maker Pool).
 *
 * This function initializes a new Whirlpool (CLMM Pool) on Orca. It only sets up the pool and does not seed it with liquidity.
 *
 * ## Example Usage:
 * Suppose you want to create a CLMM pool with two tokens, SHARK and USDC, and set the initial price of SHARK to 0.001 USDC.
 * You would call this function with `mintA` as SHARK's mint address and `mintB` as USDC's mint address. The pool is created
 * with the specified fee tier and tick spacing associated with that fee tier.
 *
 * ### Note for Experts:
 * The Whirlpool program determines the token mint order, which might not match your expectation. This function
 * adjusts the input order as needed and inverts the initial price accordingly.
 *
 * @param agent - The `SolanaAgentKit` instance representing the wallet and connection details.
 * @param mintDeploy - The mint of the token you want to deploy (e.g., SHARK).
 * @param mintPair - The mint of the token you want to pair the deployed mint with (e.g., USDC).
 * @param initialPrice - The initial price of `mintDeploy` in terms of `mintPair`.
 * @param feeTier - The fee tier bps for the pool, determining tick spacing and fee collection rates.
 *
 * @returns A promise that resolves to a transaction ID (`string`) of the transaction creating the pool.
 *
 * @throws Will throw an error if:
 * - Mint accounts for the tokens cannot be fetched.
 * - The network is unsupported.
 *
 * @remarks
 * This function only initializes the CLMM pool and does not add liquidity. For adding liquidity, you can use
 * a separate function after the pool is successfully created.
 * ```
 */
export declare function orcaCreateCLMM(agent: SolanaAgentKit, mintDeploy: PublicKey, mintPair: PublicKey, initialPrice: Decimal, feeTier: keyof typeof FEE_TIERS): Promise<string>;
//# sourceMappingURL=orca_create_clmm.d.ts.map