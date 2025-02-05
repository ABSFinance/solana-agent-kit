import { SolanaAgentKit } from "../../index";
/**
 * Rejects a proposal in a Solana multisig setup.
 *
 * @param agent - The SolanaAgentKit instance containing the wallet and connection.
 * @param transactionIndex - Optional. The index of the transaction to reject. If not provided, the current transaction index will be used.
 * @returns A promise that resolves to the transaction ID of the rejection transaction.
 * @throws Will throw an error if the transaction fails.
 */
export declare function multisig_reject_proposal(agent: SolanaAgentKit, transactionIndex?: number | bigint): Promise<string>;
//# sourceMappingURL=reject_proposal.d.ts.map