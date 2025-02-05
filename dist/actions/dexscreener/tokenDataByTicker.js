"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const dexscreener_1 = require("../../tools/dexscreener");
const tokenDataByTickerAction = {
    name: "GET_TOKEN_DATA_BY_TICKER",
    similes: [
        "token data by ticker",
        "fetch token info by ticker",
        "lookup token ticker info",
        "get token info by ticker",
    ],
    description: "Get the token data for a given token ticker",
    examples: [
        [
            {
                input: {
                    ticker: "USDC",
                },
                output: {
                    status: "success",
                    tokenData: {
                        // Some placeholder example data
                        symbol: "USDC",
                        name: "USD Coin",
                        decimals: 6,
                        mintAddress: "FhRg...",
                    },
                },
                explanation: "Fetches metadata for the USDC token by its ticker.",
            },
        ],
    ],
    schema: zod_1.z.object({
        ticker: zod_1.z.string().min(1).describe("Ticker of the token, e.g. 'USDC'"),
    }),
    handler: async (agent, input) => {
        try {
            const ticker = input.ticker;
            // Use agent’s method to get token data by ticker
            const tokenData = await (0, dexscreener_1.getTokenDataByTicker)(ticker);
            return {
                status: "success",
                tokenData: tokenData,
                message: `Successfully fetched token data for ticker: ${ticker}`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to fetch token data for ticker: ${input.ticker || ""}. ${error.message}`,
                code: error.code || "UNKNOWN_ERROR",
            };
        }
    },
};
exports.default = tokenDataByTickerAction;
//# sourceMappingURL=tokenDataByTicker.js.map