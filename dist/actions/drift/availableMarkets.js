"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@drift-labs/sdk");
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const availableDriftMarketsAction = {
    name: "AVAILABLE_DRIFT_MARKETS",
    description: "Get a list of available drift markets",
    similes: [
        "get drift markets",
        "drift markets",
        "available drift markets",
        "get available drift perp markets",
        "get available spot markets on drift",
    ],
    examples: [
        [
            {
                input: {
                    marketType: "spot",
                },
                output: {
                    status: "success",
                    message: `The list of available spot markets are ${sdk_1.MainnetSpotMarkets.map((v) => v.symbol).join(", ")}`,
                    data: sdk_1.MainnetSpotMarkets,
                },
                explanation: "Get the list of available spot markets/tokens on drift",
            },
        ],
    ],
    schema: zod_1.z.object({
        marketType: zod_1.z
            .enum(["spot", "perp"])
            .describe("Type of market to get")
            .optional(),
    }),
    handler: async (agent, input) => {
        switch (input.marketType) {
            case "perp":
                return (0, tools_1.getAvailableDriftPerpMarkets)();
            case "spot":
                return (0, tools_1.getAvailableDriftSpotMarkets)();
            default:
                return {
                    spot: (0, tools_1.getAvailableDriftSpotMarkets)(),
                    perp: (0, tools_1.getAvailableDriftPerpMarkets)(),
                };
        }
    },
};
exports.default = availableDriftMarketsAction;
//# sourceMappingURL=availableMarkets.js.map