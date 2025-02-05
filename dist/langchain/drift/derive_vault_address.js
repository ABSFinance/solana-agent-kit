"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaDeriveVaultAddressTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaDeriveVaultAddressTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "derive_drift_vault_address";
        this.description = `Derive a drift vault address from the vault's name.
  
  Inputs (JSON string):
  - name: string, name of the vault to derive the address of (required)`;
    }
    async _call(input) {
        try {
            const address = await this.solanaKit.deriveDriftVaultAddress(input);
            return JSON.stringify({
                status: "success",
                message: "Vault address derived successfully",
                address,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "DERIVE_VAULT_ADDRESS_ERROR",
            });
        }
    }
}
exports.SolanaDeriveVaultAddressTool = SolanaDeriveVaultAddressTool;
//# sourceMappingURL=derive_vault_address.js.map