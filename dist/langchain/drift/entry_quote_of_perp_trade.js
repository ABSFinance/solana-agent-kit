"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaDriftEntryQuoteOfPerpTradeTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaDriftEntryQuoteOfPerpTradeTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "drift_entry_quote_of_perp_trade";
        this.description = `Get an entry quote for a perpetual trade on Drift protocol.
  
  Inputs (JSON string):
  - amount: number, amount to trade (required)
  - symbol: string, market symbol (required)
  - action: "long" | "short", trade direction (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const quote = await this.solanaKit.getEntryQuoteOfPerpTrade(parsedInput.amount, parsedInput.symbol, parsedInput.action);
            return JSON.stringify({
                status: "success",
                message: `Entry quote retrieved for ${parsedInput.action} ${parsedInput.amount} ${parsedInput.symbol}`,
                data: quote,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "ENTRY_QUOTE_OF_PERP_TRADE_ERROR",
            });
        }
    }
}
exports.SolanaDriftEntryQuoteOfPerpTradeTool = SolanaDriftEntryQuoteOfPerpTradeTool;
//# sourceMappingURL=entry_quote_of_perp_trade.js.map