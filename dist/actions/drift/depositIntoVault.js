"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const depositIntoDriftVaultAction = {
    name: "DEPOSIT_INTO_DRIFT_VAULT",
    description: "Deposit funds into an existing drift vault",
    similes: ["deposit into drift vault", "add funds to drift vault"],
    examples: [
        [
            {
                input: {
                    amount: 100,
                    vaultAddress: "2nFeP7taii3wGVgrWk4YiLMPmhtu3Zg9iXCUu4zGBD",
                },
                output: {
                    status: "success",
                    message: "Funds deposited successfully",
                    signature: "2nFeP7taii3wGVgrWk4YiLMPmhtu3Zg9iXCUu4zGBDadwunHw8reXFxRWT7khbFsQ9JT3zK4RYDLNDFDRYvM3wJk",
                },
                explanation: "Deposit 100 USDC into a drift vault",
            },
        ],
    ],
    schema: zod_1.z.object({
        vaultAddress: zod_1.z.string(),
        amount: zod_1.z
            .number()
            .positive()
            .describe("The amount in tokens you'd like to deposit into the vault in normal token amounts e.g 50 SOL, 100 USDC, etc"),
    }),
    handler: async (agent, input) => {
        try {
            const tx = await (0, tools_1.depositIntoVault)(agent, input.amount, input.vaultAddress);
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
exports.default = depositIntoDriftVaultAction;
//# sourceMappingURL=depositIntoVault.js.map