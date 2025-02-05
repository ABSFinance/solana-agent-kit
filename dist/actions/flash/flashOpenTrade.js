"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const flash_1 = require("../../tools/flash");
const flashOpenTradeAction = {
    name: "FLASH_OPEN_TRADE",
    similes: [
        "open trade",
        "open leveraged trade",
        "start trading position",
        "open position",
        "long position",
        "short position",
        "leverage trade",
        "margin trade",
    ],
    description: "Open a leveraged trading position on Flash.Trade protocol",
    examples: [
        [
            {
                input: {
                    token: "SOL",
                    side: "long",
                    collateralUsd: 100,
                    leverage: 5,
                },
                output: {
                    status: "success",
                    signature: "4xKpN2...",
                    message: "Successfully opened 5x long position on SOL with $100 collateral",
                },
                explanation: "Open a 5x leveraged long position on SOL using $100 as collateral",
            },
        ],
    ],
    schema: zod_1.z.object({
        token: zod_1.z.string().describe("Token symbol to trade (e.g. SOL, ETH)"),
        side: zod_1.z
            .enum(["long", "short"])
            .describe("Trading direction - long or short"),
        collateralUsd: zod_1.z
            .number()
            .positive()
            .describe("Amount of collateral in USD"),
        leverage: zod_1.z
            .number()
            .positive()
            .describe("Leverage multiplier for the trade"),
    }),
    handler: async (agent, input) => {
        try {
            const params = {
                token: input.token,
                side: input.side,
                collateralUsd: input.collateralUsd,
                leverage: input.leverage,
            };
            const response = await (0, flash_1.flashOpenTrade)(agent, params);
            return {
                status: "success",
                signature: response,
                message: `Successfully opened ${params.leverage}x ${params.side} position on ${params.token} with $${params.collateralUsd} collateral`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Flash trade failed: ${error.message}`,
            };
        }
    },
};
exports.default = flashOpenTradeAction;
//# sourceMappingURL=flashOpenTrade.js.map