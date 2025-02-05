"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.request_faucet_funds = request_faucet_funds;
const web3_js_1 = require("@solana/web3.js");
/**
 * Request SOL from the Solana faucet (devnet/testnet only)
 * @param agent - SolanaAgentKit instance
 * @returns Transaction signature
 * @throws Error if the request fails or times out
 */
async function request_faucet_funds(agent) {
    const tx = await agent.connection.requestAirdrop(agent.wallet_address, 5 * web3_js_1.LAMPORTS_PER_SOL);
    const latestBlockHash = await agent.connection.getLatestBlockhash();
    await agent.connection.confirmTransaction({
        signature: tx,
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    });
    return tx;
}
//# sourceMappingURL=request_faucet_funds.js.map