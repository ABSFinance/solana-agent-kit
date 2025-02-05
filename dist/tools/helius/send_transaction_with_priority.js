"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTransactionWithPriorityFee = sendTransactionWithPriorityFee;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const bs58_1 = __importDefault(require("bs58"));
/**
 * Sends a transaction with an estimated priority fee using the provided SolanaAgentKit.
 *
 * @param agent         An instance of SolanaAgentKit containing connection, wallet, etc.
 * @param priorityLevel The priority level (e.g., "Min", "Low", "Medium", "High", "VeryHigh", or "UnsafeMax").
 * @param amount        The amount of SOL to send (in SOL, not lamports).
 * @param to            The recipient's PublicKey.
 * @returns             The transaction signature (string) once confirmed along with the fee used.
 */
async function sendTransactionWithPriorityFee(agent, priorityLevel, amount, to, splmintAddress) {
    try {
        if (!splmintAddress) {
            const transaction = new web3_js_1.Transaction();
            const { blockhash, lastValidBlockHeight } = await agent.connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.lastValidBlockHeight = lastValidBlockHeight;
            transaction.feePayer = agent.wallet_address;
            const transferIx = web3_js_1.SystemProgram.transfer({
                fromPubkey: agent.wallet_address,
                toPubkey: to,
                lamports: amount * web3_js_1.LAMPORTS_PER_SOL,
            });
            transaction.add(transferIx);
            transaction.sign(agent.wallet);
            const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${agent.config.HELIUS_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: "1",
                    method: "getPriorityFeeEstimate",
                    params: [
                        {
                            transaction: bs58_1.default.encode(transaction.serialize()),
                            options: { priorityLevel: priorityLevel },
                        },
                    ],
                }),
            });
            const data = await response.json();
            if (data.error) {
                throw new Error("Error fetching priority fee:");
            }
            const feeEstimate = data.result.priorityFeeEstimate;
            // Set the priority fee if applicable
            const computePriceIx = web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: feeEstimate,
            });
            transaction.add(computePriceIx);
            // Send the transaction and confirm
            const txSignature = await (0, web3_js_1.sendAndConfirmTransaction)(agent.connection, transaction, [agent.wallet]);
            return {
                transactionId: txSignature,
                fee: feeEstimate,
            };
        }
        else {
            const fromAta = await (0, spl_token_1.getAssociatedTokenAddress)(splmintAddress, agent.wallet_address);
            const toAta = await (0, spl_token_1.getAssociatedTokenAddress)(splmintAddress, to);
            const mintInfo = await (0, spl_token_1.getMint)(agent.connection, splmintAddress);
            const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);
            const transaction = new web3_js_1.Transaction();
            const { blockhash, lastValidBlockHeight } = await agent.connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.lastValidBlockHeight = lastValidBlockHeight;
            transaction.feePayer = agent.wallet_address;
            const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${agent.config.HELIUS_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: "1",
                    method: "getPriorityFeeEstimate",
                    params: [
                        {
                            transaction: bs58_1.default.encode(transaction.serialize()),
                            options: { priorityLevel: priorityLevel },
                        },
                    ],
                }),
            });
            const data = await response.json();
            if (data.error) {
                throw new Error("Error fetching priority fee:");
            }
            const feeEstimate = data.result.priorityFeeEstimate;
            transaction.add(web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: feeEstimate,
            }));
            transaction.add((0, spl_token_1.createAssociatedTokenAccountInstruction)(agent.wallet_address, toAta, to, splmintAddress));
            transaction.add((0, spl_token_1.createTransferInstruction)(fromAta, toAta, agent.wallet_address, adjustedAmount));
            const txSignature = await (0, web3_js_1.sendAndConfirmTransaction)(agent.connection, transaction, [agent.wallet]);
            return {
                transactionId: txSignature,
                fee: feeEstimate,
            };
        }
    }
    catch (error) {
        throw new Error(`Failed to process transaction: ${error.message}`);
    }
}
//# sourceMappingURL=send_transaction_with_priority.js.map