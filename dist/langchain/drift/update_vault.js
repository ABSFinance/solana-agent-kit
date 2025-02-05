"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaUpdateDriftVaultTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaUpdateDriftVaultTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "update_drift_vault";
        this.description = `Update an existing drift vault with new settings.
  
  Inputs (JSON string):
  - vaultAddress: string, vault address (required)
  - redeemPeriod: number, days until redemption (optional)
  - maxTokens: number, maximum tokens allowed (optional)
  - minDepositAmount: number, minimum deposit amount (optional)
  - managementFee: number, management fee percentage (optional)
  - profitShare: number, profit sharing percentage (optional)
  - hurdleRate: number, hurdle rate (optional)
  - permissioned: boolean, whitelist requirement (optional)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const tx = await this.solanaKit.updateDriftVault(parsedInput.vaultAddress, 
            // @ts-expect-error - type mismatch
            {
                hurdleRate: parsedInput.hurdleRate,
                maxTokens: parsedInput.maxTokens,
                minDepositAmount: parsedInput.minDepositAmount,
                profitShare: parsedInput.profitShare,
                managementFee: parsedInput.managementFee,
                permissioned: parsedInput.permissioned,
                redeemPeriod: parsedInput.redeemPeriod,
            });
            return JSON.stringify({
                status: "success",
                message: "Drift vault parameters updated successfully",
                signature: tx,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UPDATE_DRIFT_VAULT_ERROR",
            });
        }
    }
}
exports.SolanaUpdateDriftVaultTool = SolanaUpdateDriftVaultTool;
//# sourceMappingURL=update_vault.js.map