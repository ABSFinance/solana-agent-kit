"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const flash_1 = require("../../tools/flash");
const flashCloseTradeAction = {
    name: "FLASH_CLOSE_TRADE",
    similes: [
        "close trade",
        "close leveraged trade",
        "exit position",
        "close position",
        "exit trade",
        "close long",
        "close short",
        "take profit",
        "stop loss",
    ],
    description: "Close an existing leveraged trading position on Flash.Trade protocol",
    examples: [
        [
            {
                input: {
                    token: "SOL",
                    side: "long",
                },
                output: {
                    status: "success",
                    signature: "4xKpN2...",
                    message: "Successfully closed long position on SOL",
                },
                explanation: "Close an existing long position on SOL",
            },
        ],
    ],
    schema: zod_1.z.object({
        token: zod_1.z
            .string()
            .describe("Token symbol of the position to close (e.g. SOL, ETH)"),
        side: zod_1.z
            .enum(["long", "short"])
            .describe("Position side to close - long or short"),
    }),
    handler: async (agent, input) => {
        try {
            const params = {
                token: input.token,
                side: input.side,
            };
            const response = await (0, flash_1.flashCloseTrade)(agent, params);
            return {
                status: "success",
                signature: response,
                message: `Successfully closed ${params.side} position on ${params.token}`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Flash trade close failed: ${error.message}`,
            };
        }
    },
};
exports.default = flashCloseTradeAction;
//# sourceMappingURL=flashCloseTrade.js.map