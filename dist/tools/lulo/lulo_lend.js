"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.luloLend = luloLend;
const web3_js_1 = require("@solana/web3.js");
/**
 * Lend tokens for yields using Lulo
 * @param agent SolanaAgentKit instance
 * @param mintAddress SPL Mint address
 * @param amount Amount to lend
 * @returns Transaction signature
 */
async function luloLend(agent, mintAddress, amount) {
    try {
        const response = await fetch(`https://api.flexlend.fi/generate/account/deposit?priorityFee=50000`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-wallet-pubkey": agent.wallet.publicKey.toBase58(),
                "x-api-key": process.env.FLEXLEND_API_KEY,
            },
            body: JSON.stringify({
                owner: agent.wallet.publicKey.toBase58(),
                mintAddress: mintAddress,
                depositAmount: amount.toString(),
            }),
        });
        const { data: { transactionMeta }, } = await response.json();
        // Deserialize the transaction
        const luloTxn = web3_js_1.VersionedTransaction.deserialize(Buffer.from(transactionMeta[0].transaction, "base64"));
        // Get a recent blockhash and set it
        const { blockhash } = await agent.connection.getLatestBlockhash();
        luloTxn.message.recentBlockhash = blockhash;
        // Sign and send transaction
        luloTxn.sign([agent.wallet]);
        const signature = await agent.connection.sendTransaction(luloTxn, {
            preflightCommitment: "confirmed",
            maxRetries: 3,
        });
        // Wait for confirmation using the latest strategy
        const latestBlockhash = await agent.connection.getLatestBlockhash();
        await agent.connection.confirmTransaction({
            signature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });
        return signature;
    }
    catch (error) {
        throw new Error(`Lending failed: ${error.message}`);
    }
}
//# sourceMappingURL=lulo_lend.js.map