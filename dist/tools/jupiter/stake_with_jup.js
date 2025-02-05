"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stakeWithJup = stakeWithJup;
const web3_js_1 = require("@solana/web3.js");
/**
 * Stake SOL with Jup validator
 * @param agent SolanaAgentKit instance
 * @param amount Amount of SOL to stake
 * @returns Transaction signature
 */
async function stakeWithJup(agent, amount) {
    try {
        const res = await fetch(`https://worker.jup.ag/blinks/swap/So11111111111111111111111111111111111111112/jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v/${amount}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                account: agent.wallet.publicKey.toBase58(),
            }),
        });
        const data = await res.json();
        const txn = web3_js_1.VersionedTransaction.deserialize(Buffer.from(data.transaction, "base64"));
        const { blockhash } = await agent.connection.getLatestBlockhash();
        txn.message.recentBlockhash = blockhash;
        // Sign and send transaction
        txn.sign([agent.wallet]);
        const signature = await agent.connection.sendTransaction(txn, {
            preflightCommitment: "confirmed",
            maxRetries: 3,
        });
        const latestBlockhash = await agent.connection.getLatestBlockhash();
        await agent.connection.confirmTransaction({
            signature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });
        return signature;
    }
    catch (error) {
        console.error(error);
        throw new Error(`jupSOL staking failed: ${error.message}`);
    }
}
//# sourceMappingURL=stake_with_jup.js.map