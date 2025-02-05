"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const pythFetchPriceAction = {
    name: "PYTH_FETCH_PRICE",
    similes: [
        "get pyth price",
        "check pyth price",
        "pyth oracle price",
        "fetch from pyth",
        "pyth price feed",
        "oracle price",
    ],
    description: "Fetch the current price from a Pyth oracle price feed",
    examples: [
        [
            {
                input: {
                    tokenSymbol: "SOL", // SOL/USD price feed
                },
                output: {
                    status: "success",
                    price: "23.45",
                    message: "Current price: $23.45",
                },
                explanation: "Get the current SOL/USD price from Pyth oracle",
            },
        ],
    ],
    schema: zod_1.z.object({
        tokenSymbol: zod_1.z
            .string()
            .min(1)
            .describe("The token symbol to fetch the price for"),
    }),
    handler: async (_agent, input) => {
        try {
            const priceFeedId = await (0, tools_1.fetchPythPriceFeedID)(input.tokenSymbol);
            const priceStr = await (0, tools_1.fetchPythPrice)(priceFeedId);
            return {
                status: "success",
                price: priceStr,
                message: `Current price: $${priceStr}`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to fetch price from Pyth: ${error.message}`,
            };
        }
    },
};
exports.default = pythFetchPriceAction;
//# sourceMappingURL=pythFetchPrice.js.map