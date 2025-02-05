import { SolanaAgentKit } from "../../index";
/**
 * Lend tokens for yields using Lulo
 * @param agent SolanaAgentKit instance
 * @param mintAddress SPL Mint address
 * @param amount Amount to lend
 * @returns Transaction signature
 */
export declare function luloLend(agent: SolanaAgentKit, mintAddress: string, amount: number): Promise<string>;
//# sourceMappingURL=lulo_lend.d.ts.map