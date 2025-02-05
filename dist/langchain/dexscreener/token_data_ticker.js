"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaTokenDataByTickerTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaTokenDataByTickerTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_token_data_by_ticker";
        this.description = `Get the token data for a given token ticker

  Inputs: ticker is required.
  ticker: string, eg "USDC" (required)`;
    }
    async _call(input) {
        try {
            const ticker = input.trim();
            const tokenData = await this.solanaKit.getTokenDataByTicker(ticker);
            return JSON.stringify({
                status: "success",
                tokenData,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaTokenDataByTickerTool = SolanaTokenDataByTickerTool;
//# sourceMappingURL=token_data_ticker.js.map