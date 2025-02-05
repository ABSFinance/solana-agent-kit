"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaAlloraGetPriceInference = void 0;
const tools_1 = require("langchain/tools");
class SolanaAlloraGetPriceInference extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_allora_get_price_inference";
        this.description = `Get the price inference for a given token and timeframe from Allora's API
    Inputs (JSON string):
    - tokenSymbol: string, e.g., BTC for bitcoin
    - timeframe: string, e.g., 5m for 5 minutes`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const { tokenSymbol, timeframe } = parsedInput;
            const priceInference = await this.solanaKit.getPriceInference(tokenSymbol, timeframe);
            const response = {
                status: "success",
                message: "Price inference fetched successfully",
                tokenSymbol,
                timeframe,
                priceInference,
            };
            return JSON.stringify(response);
        }
        catch (error) {
            const response = {
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            };
            return JSON.stringify(response);
        }
    }
}
exports.SolanaAlloraGetPriceInference = SolanaAlloraGetPriceInference;
//# sourceMappingURL=get_price_inference.js.map