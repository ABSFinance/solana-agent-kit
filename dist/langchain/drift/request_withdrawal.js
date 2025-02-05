"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaRequestDriftWithdrawalTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaRequestDriftWithdrawalTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "request_withdrawal_from_drift_vault";
        this.description = `Request a withdrawal from an existing drift vault.
  
  Inputs (JSON string):
  - vaultAddress: string, vault address (required)
  - amount: number, amount of shares to withdraw (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const tx = await this.solanaKit.requestWithdrawalFromDriftVault(parsedInput.amount, parsedInput.vaultAddress);
            return JSON.stringify({
                status: "success",
                message: "Withdrawal request successful",
                signature: tx,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "REQUEST_DRIFT_WITHDRAWAL_ERROR",
            });
        }
    }
}
exports.SolanaRequestDriftWithdrawalTool = SolanaRequestDriftWithdrawalTool;
//# sourceMappingURL=request_withdrawal.js.map