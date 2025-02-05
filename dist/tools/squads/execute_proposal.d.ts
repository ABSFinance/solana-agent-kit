import { SolanaAgentKit } from "../../index";
/**
 * Executes a transaction on the Solana blockchain using the provided agent.
 *
 * @param {SolanaAgentKit} agent - The Solana agent kit instance containing the wallet and connection.
 * @param {number | bigint} [transactionIndex] - Optional transaction index to execute. If not provided, the current transaction index from the multisig account will be used.
 * @returns {Promise<string>} - A promise that resolves to the transaction signature string.
 * @throws {Error} - Throws an error if the transaction execution fails.
 */
export declare function multisig_execute_proposal(agent: SolanaAgentKit, transactionIndex?: number | bigint): Promise<string>;
//# sourceMappingURL=execute_proposal.d.ts.map