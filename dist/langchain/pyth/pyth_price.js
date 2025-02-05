"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaPythFetchPrice = void 0;
const tools_1 = require("langchain/tools");
class SolanaPythFetchPrice extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_pyth_fetch_price";
        this.description = `Fetch the price of a given price feed from Pyth's Hermes service

  Inputs:
  tokenSymbol: string, e.g., BTC for bitcoin`;
    }
    async _call(input) {
        try {
            const priceFeedID = await this.solanaKit.getPythPriceFeedID(input);
            const price = await this.solanaKit.getPythPrice(priceFeedID);
            const response = {
                status: "success",
                tokenSymbol: input,
                priceFeedID,
                price,
            };
            return JSON.stringify(response);
        }
        catch (error) {
            const response = {
                status: "error",
                tokenSymbol: input,
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            };
            return JSON.stringify(response);
        }
    }
}
exports.SolanaPythFetchPrice = SolanaPythFetchPrice;
//# sourceMappingURL=pyth_price.js.map