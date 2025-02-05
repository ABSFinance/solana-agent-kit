"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_wallet_address = get_wallet_address;
/**
 * Get the agents wallet address
 * @param agent - SolanaAgentKit instance
 * @returns string
 */
function get_wallet_address(agent) {
    return agent.wallet_address.toBase58();
}
//# sourceMappingURL=get_wallet_address.js.map