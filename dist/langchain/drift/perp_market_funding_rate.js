"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaDriftPerpMarketFundingRateTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaDriftPerpMarketFundingRateTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "drift_perp_market_funding_rate";
        this.description = `Get the funding rate for a perpetual market on Drift protocol.
  
  Inputs (JSON string):
  - symbol: string, market symbol (required)
	- period: year or hour (default: hour)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const fundingRate = await this.solanaKit.getPerpMarketFundingRate(parsedInput.symbol, parsedInput.period);
            return JSON.stringify({
                status: "success",
                message: `Funding rate retrieved for ${parsedInput.symbol}`,
                data: fundingRate,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
            });
        }
    }
}
exports.SolanaDriftPerpMarketFundingRateTool = SolanaDriftPerpMarketFundingRateTool;
//# sourceMappingURL=perp_market_funding_rate.js.map