"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const stakeWithSolayerAction = {
    name: "STAKE_WITH_SOLAYER",
    similes: [
        "stake sol",
        "solayer sol",
        "ssol",
        "stake with solayer",
        "solayer restaking",
        "solayer staking",
        "stake with sol",
        "liquid staking solayer",
        "get solayer sol",
        "solayer sol restaking",
        "solayer sol staking",
    ],
    description: "Stake native SOL with Solayer's restaking protocol to receive Solayer SOL (sSOL)",
    examples: [
        [
            {
                input: {
                    amount: 1.0,
                },
                output: {
                    status: "success",
                    signature: "3FgHn9...",
                    message: "Successfully staked 1.0 SOL for Solayer SOL (sSOL)",
                },
                explanation: "Stake 1.0 SOL to receive Solayer SOL (sSOL)",
            },
        ],
    ],
    schema: zod_1.z.object({
        amount: zod_1.z.number().positive().describe("Amount of SOL to stake"),
    }),
    handler: async (agent, input) => {
        try {
            const amount = input.amount;
            const res = await (0, tools_1.stakeWithSolayer)(agent, amount);
            return {
                status: "success",
                res,
                message: `Successfully staked ${amount} SOL for Solayer SOL (sSOL)`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Solayer staking failed: ${error.message}`,
            };
        }
    },
};
exports.default = stakeWithSolayerAction;
//# sourceMappingURL=stakeWithSolayer.js.map