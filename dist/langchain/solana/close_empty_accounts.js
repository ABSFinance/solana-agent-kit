"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaCloseEmptyTokenAccounts = void 0;
const tools_1 = require("langchain/tools");
class SolanaCloseEmptyTokenAccounts extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "close_empty_token_accounts";
        this.description = `Close all empty spl-token accounts and reclaim the rent`;
    }
    async _call() {
        try {
            const { signature, size } = await this.solanaKit.closeEmptyTokenAccounts();
            return JSON.stringify({
                status: "success",
                message: `${size} accounts closed successfully. ${size === 48 ? "48 accounts can be closed in a single transaction try again to close more accounts" : ""}`,
                signature,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaCloseEmptyTokenAccounts = SolanaCloseEmptyTokenAccounts;
//# sourceMappingURL=close_empty_accounts.js.map