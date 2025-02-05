import { SolanaAgentKit } from "../../index";
/**
 * Withdraw tokens for yields using Lulo
 * @param agent SolanaAgentKit instance
 * @param mintAddress SPL Mint address
 * @param amount Amount to withdraw
 * @returns Transaction signature
 */
export declare function luloWithdraw(agent: SolanaAgentKit, mintAddress: string, amount: number): Promise<string>;
//# sourceMappingURL=lulo_withdraw.d.ts.map