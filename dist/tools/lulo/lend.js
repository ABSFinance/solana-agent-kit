"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lendAsset = lendAsset;
const web3_js_1 = require("@solana/web3.js");
/**
 * Lend tokens for yields using Lulo
 * @param agent SolanaAgentKit instance
 * @param amount Amount of USDC to lend
 * @returns Transaction signature
 */
async function lendAsset(agent, amount) {
    try {
        const response = await fetch(`https://blink.lulo.fi/actions?amount=${amount}&symbol=USDC`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                account: agent.wallet.publicKey.toBase58(),
            }),
        });
        const data = await response.json();
        // Deserialize the transaction
        const luloTxn = web3_js_1.VersionedTransaction.deserialize(Buffer.from(data.transaction, "base64"));
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
//# sourceMappingURL=lend.js.map