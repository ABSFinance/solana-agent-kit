import { PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "../../index";
/**
 * Swap tokens using Jupiter Exchange
 * @param agent SolanaAgentKit instance
 * @param outputMint Target token mint address
 * @param inputAmount Amount to swap (in token decimals)
 * @param inputMint Source token mint address (defaults to USDC)
 * @param slippageBps Slippage tolerance in basis points (default: 300 = 3%)
 * @returns Transaction signature
 */
export declare function trade(agent: SolanaAgentKit, outputMint: PublicKey, inputAmount: number, inputMint?: PublicKey, slippageBps?: number): Promise<string>;
//# sourceMappingURL=trade.d.ts.map