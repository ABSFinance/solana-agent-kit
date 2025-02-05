"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const depositToDriftUserAccountAction = {
    name: "DEPOSIT_TO_DRIFT_USER_ACCOUNT",
    description: "Deposit funds into your drift user account",
    similes: [
        "deposit into drift user account",
        "add funds to drift user account",
        "add funds to my drift account",
        "deposit collateral into drift account",
    ],
    examples: [
        [
            {
                input: {
                    amount: 100,
                    symbol: "usdc",
                },
                output: {
                    status: "success",
                    message: "Funds deposited successfully",
                    signature: "2nFeP7taii3wGVgrWk4YiLMPmhtu3Zg9iXCUu4zGBDadwunHw8reXFxRWT7khbFsQ9JT3zK4RYDLNDFDRYvM3wJk",
                },
                explanation: "Deposit 100 USDC into your drift user account",
            },
        ],
    ],
    schema: zod_1.z.object({
        amount: zod_1.z
            .number()
            .positive()
            .describe("The amount in tokens you'd like to deposit into your drift user account in normal token amounts e.g 50 SOL, 100 USDC, etc"),
        symbol: zod_1.z
            .string()
            .toUpperCase()
            .describe("The symbol of the token you'd like to deposit"),
        repay: zod_1.z
            .boolean()
            .optional()
            .default(false)
            .describe("Whether or not to repay the borrowed funds in the account"),
    }),
    handler: async (agent, input) => {
        try {
            const tx = await (0, tools_1.depositToDriftUserAccount)(agent, input.amount, input.symbol, input.repay);
            return {
                status: "success",
                message: "Funds deposited successfully",
                signature: tx,
            };
        }
        catch (e) {
            return {
                status: "error",
                // @ts-expect-error - error message
                message: `Failed to deposit funds: ${e.message}`,
            };
        }
    },
};
exports.default = depositToDriftUserAccountAction;
//# sourceMappingURL=depositToDriftUserAccount.js.map