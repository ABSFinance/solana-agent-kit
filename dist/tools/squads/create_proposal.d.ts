import { SolanaAgentKit } from "../../index";
/**
 * Creates a proposal for a multisig transaction.
 *
 * @param {SolanaAgentKit} agent - The Solana agent kit instance.
 * @param {number | bigint} [transactionIndex] - Optional transaction index. If not provided, the current transaction index will be used.
 * @returns {Promise<string>} - The transaction ID of the created proposal.
 * @throws {Error} - Throws an error if the proposal creation fails.
 */
export declare function multisig_create_proposal(agent: SolanaAgentKit, transactionIndex?: number | bigint): Promise<string>;
//# sourceMappingURL=create_proposal.d.ts.map