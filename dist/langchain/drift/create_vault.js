"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaCreateDriftVaultTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaCreateDriftVaultTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "create_drift_vault";
        this.description = `Create a new drift vault delegating the agents address as the owner.
  
  Inputs (JSON string):
  - name: string, unique vault name (min 5 chars)
  - marketName: string, market name in TOKEN-SPOT format
  - redeemPeriod: number, days to wait before funds can be redeemed (min 1)
  - maxTokens: number, maximum tokens vault can accommodate (min 100)
  - minDepositAmount: number, minimum deposit amount
  - managementFee: number, fee percentage for managing funds (max 20)
  - profitShare: number, profit sharing percentage (max 90, default 5)
  - hurdleRate: number, optional hurdle rate
  - permissioned: boolean, whether vault has whitelist`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const tx = await this.solanaKit.createDriftVault(parsedInput);
            return JSON.stringify({
                status: "success",
                message: "Drift vault created successfully",
                vaultName: parsedInput.name,
                signature: tx,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "CREATE_DRIFT_VAULT_ERROR",
            });
        }
    }
}
exports.SolanaCreateDriftVaultTool = SolanaCreateDriftVaultTool;
//# sourceMappingURL=create_vault.js.map