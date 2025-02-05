"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const updateDriftVaultDelegateAction = {
    name: "UPDATE_DRIFT_VAULT_DELEGATE_ACTION",
    similes: ["update drift vault delegate", "change drift vault delegate"],
    description: "Update the delegate of a drift vault",
    examples: [
        [
            {
                input: {
                    vaultAddress: "2nFeP7taii3wGVgrWk4YiLMPmhtu3Zg9iXCUu4zGBD",
                    newDelegate: "2nFeP7tai",
                },
                output: {
                    status: "success",
                    message: "Vault delegate updated successfully",
                    signature: "2nFeP7taii3wGVgrWk4YiLMPmhtu3Zg9iXCUu4zGBDadwunHw8reXFxRWT7khbFsQ9JT3zK4RYDLNDFDRYvM3wJk",
                },
                explanation: "Update the delegate of a drift vault to another address",
            },
        ],
    ],
    schema: zod_1.z.object({
        vaultAddress: zod_1.z.string().describe("vault's address"),
        newDelegate: zod_1.z.string().describe("new address to delegate the vault to"),
    }),
    handler: async (agent, input) => {
        try {
            const tx = await (0, tools_1.updateVaultDelegate)(agent, input.vaultAddress, input.newDelegate);
            return {
                status: "success",
                message: "Vault delegate updated successfully",
                signature: tx,
            };
        }
        catch (e) {
            return {
                status: "error",
                // @ts-expect-error - error message
                message: `Failed to update vault delegate: ${e.message}`,
            };
        }
    },
};
exports.default = updateDriftVaultDelegateAction;
//# sourceMappingURL=updateDriftVaultDelegate.js.map