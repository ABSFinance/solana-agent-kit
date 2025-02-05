import { SolanaAgentKit } from "../../agent";
import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";
import { ActivationType } from "@meteora-ag/dlmm";
/**
 * Create Meteora DLMM pool
 * @param agent SolanaAgentKit instance
 * @param binStep DLMM pool bin step
 * @param tokenAMint Token A mint
 * @param tokenBMint Token B mint
 * @param initialPrice Initial pool price in ratio tokenA / tokenB
 * @param priceRoundingUp Whether to rounding up the initial pool price
 * @param feeBps Pool trading fee in BPS
 * @param activationType Pool activation type (ActivationType.Timestamp or ActivationType.Slot)
 * @param hasAlphaVault Whether the pool has Meteora alpha vault or not
 * @param activationPoint Activation point depending on activation type, or null if pool doesn't have an activation point
 * @returns Transaction signature
 */
export declare function createMeteoraDlmmPool(agent: SolanaAgentKit, binStep: number, tokenAMint: PublicKey, tokenBMint: PublicKey, initialPrice: number, priceRoundingUp: boolean, feeBps: number, activationType: ActivationType, hasAlphaVault: boolean, activationPoint: BN | undefined): Promise<string>;
//# sourceMappingURL=create_meteora_dlmm_pool.d.ts.map