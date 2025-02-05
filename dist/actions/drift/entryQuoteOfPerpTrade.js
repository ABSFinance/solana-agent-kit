"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const entryQuoteOfPerpTradeAction = {
    name: "DRIFT_GET_ENTRY_QUOTE_OF_PERP_TRADE_ACTION",
    description: "Get the entry quote of a perpetual trade on Drift",
    similes: [
        "get the entry quote of a perpetual trade on drift",
        "get the entry quote of a perp trade on drift",
        "get the entry quote of the BTC-PERP trade on drift",
        "get the entry quote of the SOL-PERP trade on drift",
        "get the entry quote of a 1000 USDC long on the SOL-PERP market",
        "get the entry quote of a 1000 USDC short on the SOL-PERP market",
        "quote for a $1000 long on the BTC-PERP market",
    ],
    examples: [
        [
            {
                input: {
                    marketSymbol: "BTC-PERP",
                    type: "long",
                    amount: 1000,
                },
                output: {
                    status: "success",
                    data: {
                        entryPrice: 100000,
                        priceImpact: 0.0001,
                        bestPrice: 100001,
                        worstPrice: 99999,
                        baseFilled: 1000,
                        quoteFilled: 1000,
                    },
                },
                explanation: "Get the entry quote of a $1000 long on the BTC-PERP market",
            },
        ],
    ],
    schema: zod_1.z.object({
        marketSymbol: zod_1.z.string().describe("Symbol of the perpetual market"),
        type: zod_1.z.enum(["long", "short"]).describe("Type of trade"),
        amount: zod_1.z.number().positive().describe("Amount to trade"),
    }),
    handler: async (agent, input) => {
        try {
            const data = await (0, tools_1.getEntryQuoteOfPerpTrade)(input.marketSymbol, input.amount, input.type);
            return data;
        }
        catch (e) {
            return {
                status: "error",
                // @ts-expect-error error is not a string
                message: e.message,
            };
        }
    },
};
exports.default = entryQuoteOfPerpTradeAction;
//# sourceMappingURL=entryQuoteOfPerpTrade.js.map