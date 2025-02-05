"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tradeDriftPerpAccountAction = void 0;
const zod_1 = require("zod");
const tools_1 = require("../../tools");
exports.tradeDriftPerpAccountAction = {
    name: "TRADE_DRIFT_PERP_ACCOUNT",
    similes: [
        "trade drift perp account",
        "trade drift perp",
        "trade drift perpetual account",
        "trade perp account",
        "trade account",
    ],
    description: "Trade a perpetual account on Drift protocol",
    examples: [
        [
            {
                input: {
                    amount: 100,
                    symbol: "SOL",
                    action: "long",
                    type: "market",
                },
                output: {
                    status: "success",
                    message: "Trade successful",
                },
                explanation: "Open a $100 long position on SOL.",
            },
        ],
        [
            {
                input: {
                    amount: 50,
                    symbol: "BTC",
                    action: "short",
                    type: "limit",
                    price: 50000,
                },
                output: {
                    status: "success",
                    message: "Trade successful",
                },
                explanation: "$50 short position on BTC at $50,000.",
            },
        ],
    ],
    schema: zod_1.z.object({
        amount: zod_1.z
            .number()
            .positive()
            .describe("The amount of the token to trade in normal token amounts e.g 50 SOL, 100 USDC"),
        symbol: zod_1.z
            .string()
            .toUpperCase()
            .describe("Symbol of the token to open a position on "),
        action: zod_1.z
            .enum(["long", "short"])
            .describe("The action you would like to carry out whether it be a long or a short"),
        type: zod_1.z
            .enum(["market", "limit"])
            .describe("The type of trade you would like to open, market or limit order"),
        price: zod_1.z.number().positive().optional().describe("USD price of the token"),
    }),
    handler: async (agent, input) => {
        try {
            const signature = await (0, tools_1.driftPerpTrade)(agent, {
                action: input.action,
                amount: input.amount,
                symbol: input.symbol,
                type: input.type,
                price: input.price,
            });
            return {
                status: "success",
                signature: signature,
            };
        }
        catch (e) {
            return {
                status: "error",
                // @ts-expect-error - error message is a string
                message: `Failed to trade perp account: ${e.message}`,
            };
        }
    },
};
exports.default = exports.tradeDriftPerpAccountAction;
//# sourceMappingURL=tradePerpAccount.js.map