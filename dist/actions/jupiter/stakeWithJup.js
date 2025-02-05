"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const stakeWithJupAction = {
    name: "STAKE_WITH_JUPITER",
    similes: [
        "stake sol",
        "stake with jupiter",
        "jup staking",
        "stake with jup",
        "liquid staking",
        "get jupsol",
    ],
    description: "Stake SOL tokens with Jupiter's liquid staking protocol to receive jupSOL",
    examples: [
        [
            {
                input: {
                    amount: 1.5,
                },
                output: {
                    status: "success",
                    signature: "5KtPn3...",
                    message: "Successfully staked 1.5 SOL for jupSOL",
                },
                explanation: "Stake 1.5 SOL to receive jupSOL tokens",
            },
        ],
    ],
    schema: zod_1.z.object({
        amount: zod_1.z.number().positive().describe("Amount of SOL to stake"),
    }),
    handler: async (agent, input) => {
        try {
            const amount = input.amount;
            const res = await (0, tools_1.stakeWithJup)(agent, amount);
            return {
                status: "success",
                res,
                message: `Successfully staked ${amount} SOL for jupSOL`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `jupSOL staking failed: ${error.message}`,
            };
        }
    },
};
exports.default = stakeWithJupAction;
//# sourceMappingURL=stakeWithJup.js.map