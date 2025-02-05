"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const stakeToDriftInsuranceFundAction = {
    name: "STAKE_TO_DRIFT_INSURANCE_FUND_ACTION",
    description: "Stake a token to Drift Insurance Fund",
    similes: ["Stake a token to Drift Insurance Fund"],
    examples: [
        [
            {
                input: {
                    amount: 100,
                    symbol: "SOL",
                },
                output: {
                    status: "success",
                    message: "Staked 100 SOL to the Drift Insurance Fund",
                    data: {
                        signature: "signature",
                    },
                },
                explanation: "Stake 100 SOL to the Drift Insurance Fund",
            },
        ],
    ],
    schema: zod_1.z.object({
        amount: zod_1.z
            .number()
            .positive()
            .describe("Amount to stake in normal units e.g 50 === 50 SOL"),
        symbol: zod_1.z.string().describe("Symbol of the token stake"),
    }),
    handler: async (agent, input) => {
        try {
            const tx = await (0, tools_1.stakeToDriftInsuranceFund)(agent, input.amount, input.symbol);
            return {
                status: "sucess",
                message: `Staked ${input.amount} ${input.symbol} to the Drift Insurance Fund`,
                data: {
                    signature: tx,
                },
            };
        }
        catch (error) {
            return {
                status: "error",
                // @ts-expect-error error is not a string
                message: error.message,
            };
        }
    },
};
exports.default = stakeToDriftInsuranceFundAction;
//# sourceMappingURL=stakeToDriftInsuranceFund.js.map