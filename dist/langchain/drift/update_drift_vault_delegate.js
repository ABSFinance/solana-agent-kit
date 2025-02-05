"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaUpdateDriftVaultDelegateTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaUpdateDriftVaultDelegateTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "update_drift_vault_delegate";
        this.description = `Update the delegate of a drift vault.
  
  Inputs (JSON string):
  - vaultAddress: string, address of the vault (required)
  - newDelegate: string, address of the new delegate (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const tx = await this.solanaKit.updateDriftVaultDelegate(parsedInput.vaultAddress, parsedInput.newDelegate);
            return JSON.stringify({
                status: "success",
                message: "Vault delegate updated successfully",
                signature: tx,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UPDATE_DRIFT_VAULT_DELEGATE_ERROR",
            });
        }
    }
}
exports.SolanaUpdateDriftVaultDelegateTool = SolanaUpdateDriftVaultDelegateTool;
//# sourceMappingURL=update_drift_vault_delegate.js.map