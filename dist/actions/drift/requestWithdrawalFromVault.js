"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const requestWithdrawalFromVaultAction = {
    name: "REQUEST_WITHDRAWAL_FROM_DRIFT_VAULT",
    description: "Request a withdrawal from an existing drift vault",
    similes: ["withdraw from drift vault", "request withdrawal from vault"],
    examples: [
        [
            {
                input: {
                    amount: 100,
                    vaultAddress: "2nFeP7taii",
                },
                output: {
                    status: "success",
                    message: "Withdrawal request successful",
                    signature: "2nFeP7taii3wGVgrWk4YiLMPmhtu3Zg9iXCUu4zGBDadwunHw8reXFxRWT7khbFsQ9JT3zK4RYDLNDFDRYvM3wJk",
                },
                explanation: "Request a withdrawal of 100 USDC from a drift vault",
            },
        ],
    ],
    schema: zod_1.z.object({
        vaultAddress: zod_1.z.string(),
        amount: zod_1.z
            .number()
            .positive()
            .describe("Amount of shares you would like to withdraw from the vault in normal token amounts e.g 50 SOL, 100 USDC, etc"),
    }),
    handler: async (agent, input) => {
        try {
            const tx = await (0, tools_1.requestWithdrawalFromVault)(agent, input.amount, input.vaultAddress);
            return {
                status: "success",
                message: "Withdrawal request successful",
                signature: tx,
            };
        }
        catch (e) {
            return {
                status: "error",
                // @ts-expect-error - error message
                message: `Failed to request withdrawal: ${e.message}`,
            };
        }
    },
};
exports.default = requestWithdrawalFromVaultAction;
//# sourceMappingURL=requestWithdrawalFromVault.js.map