"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_gibwork_task = create_gibwork_task;
const web3_js_1 = require("@solana/web3.js");
/**
 * Create an new task on Gibwork
 * @param agent SolanaAgentKit instance
 * @param title Title of the task
 * @param content Description of the task
 * @param requirements Requirements to complete the task
 * @param tags List of tags associated with the task
 * @param payer Payer address for the task (default: agent wallet address)
 * @param tokenMintAddress Token mint address for payment
 * @param tokenAmount Payment amount for the task
 * @returns Object containing task creation transaction and generated taskId
 */
async function create_gibwork_task(agent, title, content, requirements, tags, tokenMintAddress, tokenAmount, payer) {
    try {
        const apiResponse = await fetch("https://api2.gib.work/tasks/public/transaction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                content: content,
                requirements: requirements,
                tags: tags,
                payer: payer?.toBase58() || agent.wallet.publicKey.toBase58(),
                token: {
                    mintAddress: tokenMintAddress.toBase58(),
                    amount: tokenAmount,
                },
            }),
        });
        const responseData = await apiResponse.json();
        if (!responseData.taskId && !responseData.serializedTransaction) {
            throw new Error(`${responseData.message}`);
        }
        const serializedTransaction = Buffer.from(responseData.serializedTransaction, "base64");
        const tx = web3_js_1.VersionedTransaction.deserialize(serializedTransaction);
        tx.sign([agent.wallet]);
        const signature = await agent.connection.sendTransaction(tx, {
            preflightCommitment: "confirmed",
            maxRetries: 3,
        });
        const latestBlockhash = await agent.connection.getLatestBlockhash();
        await agent.connection.confirmTransaction({
            signature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });
        return {
            status: "success",
            taskId: responseData.taskId,
            signature: signature,
        };
    }
    catch (err) {
        throw new Error(`${err.message}`);
    }
}
//# sourceMappingURL=create_gibwork_task.js.map