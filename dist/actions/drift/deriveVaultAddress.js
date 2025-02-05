"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const deriveDriftVaultAddressAction = {
    name: "DERIVE_DRIFT_VAULT_ADDRESS_ACTION",
    similes: ["derive drift vault address", "get drift vault address"],
    description: "Derive a drift vault address from the vaults name",
    examples: [
        [
            {
                input: {
                    name: "My Drift Vault",
                },
                output: {
                    status: "success",
                    message: "Vault address derived successfully",
                    address: "2nFeP7taii3wGVgrWk4YiLMPmhtu3Zg9iXCUu4zGBD",
                },
                explanation: "Derive a drift vault address",
            },
        ],
    ],
    schema: zod_1.z.object({
        name: zod_1.z.string().describe("The name of the vault to derive the address of"),
    }),
    handler: async (agent, input) => {
        try {
            const address = await (0, tools_1.getVaultAddress)(agent, input.name);
            return {
                status: "success",
                message: "Vault address derived successfully",
                address,
            };
        }
        catch (e) {
            return {
                status: "error",
                // @ts-expect-error - error message
                message: `Failed to derive vault address: ${e.message}`,
            };
        }
    },
};
exports.default = deriveDriftVaultAddressAction;
//# sourceMappingURL=deriveVaultAddress.js.map