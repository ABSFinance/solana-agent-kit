"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const getPriceInferenceAction = {
    name: "ALLORA_GET_PRICE_INFERENCE",
    similes: [
        "get price inference for SOL in 10m",
        "get price forecast for SOL in 10m",
        "get allora price inference for SOL in 10m",
        "get allora price forecast for SOL in 10m",
    ],
    description: "Get the price inference for a given token and timeframe from Allora's API",
    examples: [
        [
            {
                input: {
                    tokenSymbol: "SOL",
                    timeframe: "10m",
                },
                output: {
                    status: "success",
                    message: "Price inference fetched successfully",
                    priceInference: "The price of SOL is expected to be 100 in 10 minutes",
                },
                explanation: "Get the price inference for SOL/USD price feed for the next 10 minutes",
            },
        ],
    ],
    schema: zod_1.z.object({
        tokenSymbol: zod_1.z
            .string()
            .min(1)
            .describe("The token symbol to get the price inference for"),
        timeframe: zod_1.z
            .string()
            .min(1)
            .describe("The timeframe to get the price inference for"),
    }),
    handler: async (agent, input) => {
        try {
            const { tokenSymbol, timeframe } = input;
            const price = await (0, tools_1.getPriceInference)(agent, tokenSymbol, timeframe);
            return {
                status: "success",
                message: "Price inference fetched successfully",
                priceInference: `The price of ${tokenSymbol} is expected to be ${price} in ${timeframe}`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to fetch price inference from Allora: ${error.message}`,
            };
        }
    },
};
exports.default = getPriceInferenceAction;
//# sourceMappingURL=getPriceInference.js.map