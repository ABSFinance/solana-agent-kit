"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const unstakeFromDriftInsuranceFundAction = {
    name: "UNSTAKE_FROM_DRIFT_INSURANCE_FUND_ACTION",
    description: "Unstake requested unstake token from the Drift Insurance fund once the cool period has elapsed",
    similes: [
        "unstake from the drift insurance fund",
        "withdraw from the drift insurance fund",
        "take out funds from the drift insurance fund",
    ],
    examples: [
        [
            {
                input: {
                    symbol: "SOL",
                },
                output: {
                    status: "success",
                    message: "Unstaked your SOL from the Drift Insurance Fund",
                    signature: "4FdasklhiIHyOI",
                },
                explanation: "Unstake SOL from the Drift Insurance Fund",
            },
        ],
    ],
    schema: zod_1.z.object({
        symbol: zod_1.z.string().describe("Symbol of the token to unstake"),
    }),
    handler: async (agent, input) => {
        try {
            const tx = await (0, tools_1.unstakeFromDriftInsuranceFund)(agent, input.symbol);
            return {
                status: "success",
                message: `Unstaked your ${input.symbol} from the Drift Insurance Fund`,
                signature: tx,
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
exports.default = unstakeFromDriftInsuranceFundAction;
//# sourceMappingURL=unstakeFromDriftInsuranceFund.js.map