"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaTradeDelegatedDriftVaultTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaTradeDelegatedDriftVaultTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "trade_delegated_drift_vault";
        this.description = `Carry out trades in a Drift vault.
  
  Inputs (JSON string):
  - vaultAddress: string, address of the Drift vault
  - amount: number, amount to trade
  - symbol: string, symbol of the token to trade
  - action: "long" | "short", trade direction
  - type: "market" | "limit", order type
  - price: number, optional limit price`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const tx = await this.solanaKit.tradeUsingDelegatedDriftVault(parsedInput.vaultAddress, parsedInput.amount, parsedInput.symbol, parsedInput.action, parsedInput.type, parsedInput.price);
            return JSON.stringify({
                status: "success",
                message: parsedInput.type === "limit"
                    ? "Order placed successfully"
                    : "Trade successful",
                transactionId: tx,
                ...parsedInput,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "TRADE_DRIFT_VAULT_ERROR",
            });
        }
    }
}
exports.SolanaTradeDelegatedDriftVaultTool = SolanaTradeDelegatedDriftVaultTool;
//# sourceMappingURL=trade_delegated_vault.js.map