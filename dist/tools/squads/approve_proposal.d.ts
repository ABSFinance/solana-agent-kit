import { SolanaAgentKit } from "../../index";
/**
 * Approves a proposal in a Solana multisig wallet.
 *
 * @param {SolanaAgentKit} agent - The Solana agent kit instance.
 * @param {number | bigint} [transactionIndex] - The index of the transaction to approve. If not provided, the current transaction index will be used.
 * @returns {Promise<string>} - A promise that resolves to the transaction ID of the approved proposal.
 * @throws {Error} - Throws an error if the approval process fails.
 */
export declare function multisig_approve_proposal(agent: SolanaAgentKit, transactionIndex?: number | bigint): Promise<string>;
//# sourceMappingURL=approve_proposal.d.ts.map