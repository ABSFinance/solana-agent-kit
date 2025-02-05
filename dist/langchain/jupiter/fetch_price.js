"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaFetchPriceTool = void 0;
const tools_1 = require("langchain/tools");
/**
 * Tool to fetch the price of a token in USDC
 */
class SolanaFetchPriceTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_fetch_price";
        this.description = `Fetch the price of a given token in USDC.

  Inputs:
  - tokenId: string, the mint address of the token, e.g., "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"`;
    }
    async _call(input) {
        try {
            const price = await this.solanaKit.fetchTokenPrice(input.trim());
            return JSON.stringify({
                status: "success",
                tokenId: input.trim(),
                priceInUSDC: price,
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
exports.SolanaFetchPriceTool = SolanaFetchPriceTool;
//# sourceMappingURL=fetch_price.js.map