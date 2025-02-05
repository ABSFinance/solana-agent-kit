import { SolanaAgentKit } from "../../agent";
/**
 * Close Empty SPL Token accounts of the agent
 * @param agent SolanaAgentKit instance
 * @returns transaction signature and total number of accounts closed
 */
export declare function closeEmptyTokenAccounts(agent: SolanaAgentKit): Promise<{
    signature: string;
    size: number;
}>;
//# sourceMappingURL=close_empty_token_accounts.d.ts.map