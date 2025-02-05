"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaCreateDriftUserAccountTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaCreateDriftUserAccountTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "create_drift_user_account";
        this.description = `Create a new user account with a deposit on Drift protocol.
  
  Inputs (JSON string):
  - amount: number, amount of the token to deposit (required)
  - symbol: string, symbol of the token to deposit (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const res = await this.solanaKit.createDriftUserAccount(parsedInput.amount, parsedInput.symbol);
            return JSON.stringify({
                status: "success",
                message: `User account created with ${parsedInput.amount} ${parsedInput.symbol} successfully deposited`,
                account: res.account,
                signature: res.txSignature,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "CREATE_DRIFT_USER_ACCOUNT_ERROR",
            });
        }
    }
}
exports.SolanaCreateDriftUserAccountTool = SolanaCreateDriftUserAccountTool;
//# sourceMappingURL=create_user_account.js.map