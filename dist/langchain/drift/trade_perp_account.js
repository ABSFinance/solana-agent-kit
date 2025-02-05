"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaTradeDriftPerpAccountTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaTradeDriftPerpAccountTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "trade_drift_perp_account";
        this.description = `Trade a perpetual account on Drift protocol.
  
  Inputs (JSON string):
  - amount: number, amount to trade (required)
  - symbol: string, token symbol (required)
  - action: "long" | "short", trade direction (required)
  - type: "market" | "limit", order type (required)
  - price: number, required for limit orders`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const signature = await this.solanaKit.tradeUsingDriftPerpAccount(parsedInput.amount, parsedInput.symbol, parsedInput.action, parsedInput.type, parsedInput.price);
            return JSON.stringify({
                status: "success",
                signature,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "TRADE_PERP_ACCOUNT_ERROR",
            });
        }
    }
}
exports.SolanaTradeDriftPerpAccountTool = SolanaTradeDriftPerpAccountTool;
//# sourceMappingURL=trade_perp_account.js.map