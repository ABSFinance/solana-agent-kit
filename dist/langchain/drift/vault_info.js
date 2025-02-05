"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaDriftVaultInfoTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaDriftVaultInfoTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "drift_vault_info";
        this.description = `Get information about a drift vault.
  
  Inputs (JSON string):
  - vaultNameOrAddress: string, name or address of the vault (required)`;
    }
    async _call(input) {
        try {
            const vaultInfo = await this.solanaKit.getDriftVaultInfo(input);
            return JSON.stringify({
                status: "success",
                message: "Vault info retrieved successfully",
                data: vaultInfo,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "DRIFT_VAULT_INFO_ERROR",
            });
        }
    }
}
exports.SolanaDriftVaultInfoTool = SolanaDriftVaultInfoTool;
//# sourceMappingURL=vault_info.js.map