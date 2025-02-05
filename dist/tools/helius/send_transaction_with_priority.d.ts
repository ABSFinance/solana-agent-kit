import { SolanaAgentKit } from "../../index";
import { PublicKey } from "@solana/web3.js";
/**
 * Sends a transaction with an estimated priority fee using the provided SolanaAgentKit.
 *
 * @param agent         An instance of SolanaAgentKit containing connection, wallet, etc.
 * @param priorityLevel The priority level (e.g., "Min", "Low", "Medium", "High", "VeryHigh", or "UnsafeMax").
 * @param amount        The amount of SOL to send (in SOL, not lamports).
 * @param to            The recipient's PublicKey.
 * @returns             The transaction signature (string) once confirmed along with the fee used.
 */
export declare function sendTransactionWithPriorityFee(agent: SolanaAgentKit, priorityLevel: string, amount: number, to: PublicKey, splmintAddress?: PublicKey): Promise<{
    transactionId: string;
    fee: number;
}>;
//# sourceMappingURL=send_transaction_with_priority.d.ts.map