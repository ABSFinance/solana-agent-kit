"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaWithdrawFromDriftVaultTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaWithdrawFromDriftVaultTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "withdraw_from_drift_vault";
        this.description = `Withdraw funds from a vault given the redemption time has elapsed.
  
  Inputs (JSON string):
  - vaultAddress: string, vault address (required)`;
    }
    async _call(input) {
        try {
            const tx = await this.solanaKit.withdrawFromDriftVault(input);
            return JSON.stringify({
                status: "success",
                message: "Withdrawal successful",
                signature: tx,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "WITHDRAW_FROM_DRIFT_VAULT_ERROR",
            });
        }
    }
}
exports.SolanaWithdrawFromDriftVaultTool = SolanaWithdrawFromDriftVaultTool;
//# sourceMappingURL=withdraw_from_vault.js.map