"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaDepositIntoDriftVaultTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaDepositIntoDriftVaultTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "deposit_into_drift_vault";
        this.description = `Deposit funds into an existing drift vault.
  
  Inputs (JSON string):
  - vaultAddress: string, address of the vault (required)
  - amount: number, amount to deposit (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const tx = await this.solanaKit.depositIntoDriftVault(parsedInput.amount, parsedInput.vaultAddress);
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
                code: error.code || "DEPOSIT_INTO_VAULT_ERROR",
            });
        }
    }
}
exports.SolanaDepositIntoDriftVaultTool = SolanaDepositIntoDriftVaultTool;
//# sourceMappingURL=deposit_into_vault.js.map