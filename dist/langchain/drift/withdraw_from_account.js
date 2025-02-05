"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaWithdrawFromDriftAccountTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaWithdrawFromDriftAccountTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "withdraw_from_drift_account";
        this.description = `Withdraw or borrow funds from your drift account.
  
  Inputs (JSON string):
  - amount: number, amount to withdraw (required)
  - symbol: string, token symbol (required)
  - isBorrow: boolean, whether to borrow funds instead of withdrawing (optional, default: false)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const tx = await this.solanaKit.withdrawFromDriftAccount(parsedInput.amount, parsedInput.symbol, parsedInput.isBorrow);
            return JSON.stringify({
                status: "success",
                message: "Funds withdrawn successfully",
                signature: tx,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "WITHDRAW_FROM_DRIFT_ACCOUNT_ERROR",
            });
        }
    }
}
exports.SolanaWithdrawFromDriftAccountTool = SolanaWithdrawFromDriftAccountTool;
//# sourceMappingURL=withdraw_from_account.js.map