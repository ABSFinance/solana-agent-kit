"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaDepositToDriftUserAccountTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaDepositToDriftUserAccountTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "deposit_to_drift_user_account";
        this.description = `Deposit funds into your drift user account.
  
  Inputs (JSON string):
  - amount: number, amount to deposit (required)
  - symbol: string, token symbol (required)
  - repay: boolean, whether to repay borrowed funds (optional, default: false)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const tx = await this.solanaKit.depositToDriftUserAccount(parsedInput.amount, parsedInput.symbol, parsedInput.repay);
            return JSON.stringify({
                status: "success",
                message: "Funds deposited successfully",
                signature: tx,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "DEPOSIT_TO_DRIFT_ACCOUNT_ERROR",
            });
        }
    }
}
exports.SolanaDepositToDriftUserAccountTool = SolanaDepositToDriftUserAccountTool;
//# sourceMappingURL=deposit_to_user_account.js.map