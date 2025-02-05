"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const withdrawFromVaultAction = {
    name: "WITHDRAW_FROM_DRIFT_VAULT",
    description: "Withdraw funds from a vault given the redemption time has elapsed.",
    similes: ["withdraw from drift vault", "redeem funds from vault"],
    examples: [
        [
            {
                input: {
                    vaultAddress: "2nFeP7taii",
                },
                output: {
                    status: "success",
                    message: "Withdrawal successful",
                    signature: "2nFeP7taii3wGVgrWk4YiLMPmhtu3Zg9iXCUu4zGBDadwunHw8reXFxRWT7khbFsQ9JT3zK4RYDLNDFDRYvM3wJk",
                },
                explanation: "Withdraw funds from a drift vault",
            },
        ],
    ],
    schema: zod_1.z.object({
        vaultAddress: zod_1.z.string().describe("Vault's address"),
    }),
    handler: async (agent, input) => {
        try {
            const tx = await (0, tools_1.withdrawFromDriftVault)(agent, input.vaultAddress);
            return {
                status: "success",
                message: "Withdrawal successful",
                signature: tx,
            };
        }
        catch (e) {
            return {
                status: "error",
                // @ts-expect-error - error message
                message: `Failed to withdraw funds: ${e.message}`,
            };
        }
    },
};
exports.default = withdrawFromVaultAction;
//# sourceMappingURL=withdrawFromVault.js.map