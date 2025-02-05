"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const lendAndBorrowAPYAction = {
    name: "DRIFT_GET_LEND_AND_BORROW_APY_ACTION",
    description: "Get the lending and borrowing APY (in %) of a token on Drift",
    similes: [
        "get the lending and borrowing APY of a token on drift",
        "get the lending and borrowing APY of a token on drift",
        "get the lending and borrowing APY of the USDC token on drift",
        "get the lending and borrowing APY of the SOL token on drift",
    ],
    examples: [
        [
            {
                input: {
                    symbol: "USDC",
                },
                output: {
                    status: "success",
                    data: {
                        lendingAPY: 10,
                        borrowingAPY: 12.1,
                    },
                },
                explanation: "Get the lending and borrowing APY of the USDC token",
            },
        ],
    ],
    schema: zod_1.z.object({
        symbol: zod_1.z.string().describe("Symbol of the token"),
    }),
    handler: async (agent, input) => {
        try {
            const data = await (0, tools_1.getLendingAndBorrowAPY)(agent, input.symbol);
            return {
                status: "success",
                data,
            };
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
exports.default = lendAndBorrowAPYAction;
//# sourceMappingURL=getLendAndBorrowAPY.js.map