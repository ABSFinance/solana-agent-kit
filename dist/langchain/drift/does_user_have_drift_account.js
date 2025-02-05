"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaCheckDriftAccountTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaCheckDriftAccountTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "does_user_have_drift_account";
        this.description = `Check if a user has a Drift account.
  
  Inputs: No inputs required - checks the current user's account`;
    }
    async _call(_input) {
        try {
            const res = await this.solanaKit.doesUserHaveDriftAccount();
            if (!res.hasAccount) {
                return JSON.stringify({
                    status: "error",
                    message: "You do not have a Drift account",
                });
            }
            return JSON.stringify({
                status: "success",
                message: "Nice! You have a Drift account",
                account: res.account,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "CHECK_DRIFT_ACCOUNT_ERROR",
            });
        }
    }
}
exports.SolanaCheckDriftAccountTool = SolanaCheckDriftAccountTool;
//# sourceMappingURL=does_user_have_drift_account.js.map