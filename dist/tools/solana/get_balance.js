"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_balance = get_balance;
const web3_js_1 = require("@solana/web3.js");
/**
 * Get the balance of SOL or an SPL token for the agent's wallet
 * @param agent - SolanaAgentKit instance
 * @param token_address - Optional SPL token mint address. If not provided, returns SOL balance
 * @returns Promise resolving to the balance as a number (in UI units) or null if account doesn't exist
 */
async function get_balance(agent, token_address) {
    if (!token_address) {
        return ((await agent.connection.getBalance(agent.wallet_address)) /
            web3_js_1.LAMPORTS_PER_SOL);
    }
    const token_account = await agent.connection.getTokenAccountBalance(token_address);
    return token_account.value.uiAmount || 0;
}
//# sourceMappingURL=get_balance.js.map