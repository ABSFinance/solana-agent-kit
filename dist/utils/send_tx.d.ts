import { SolanaAgentKit } from "../agent";
import { Keypair, TransactionInstruction } from "@solana/web3.js";
declare const feeTiers: {
    min: number;
    mid: number;
    max: number;
};
/**
 * Get priority fees for the current block
 * @param connection - Solana RPC connection
 * @returns Priority fees statistics and instructions for different fee levels
 */
export declare function getComputeBudgetInstructions(agent: SolanaAgentKit, instructions: TransactionInstruction[], feeTier: keyof typeof feeTiers): Promise<{
    blockhash: string;
    computeBudgetLimitInstruction: TransactionInstruction;
    computeBudgetPriorityFeeInstructions: TransactionInstruction;
}>;
/**
 * Send a transaction with priority fees
 * @param agent - SolanaAgentKit instance
 * @param tx - Transaction to send
 * @returns Transaction ID
 */
export declare function sendTx(agent: SolanaAgentKit, instructions: TransactionInstruction[], otherKeypairs?: Keypair[]): Promise<any>;
export {};
//# sourceMappingURL=send_tx.d.ts.map