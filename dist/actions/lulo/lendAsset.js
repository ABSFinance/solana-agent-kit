"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const lulo_1 = require("../../tools/lulo");
const lendAssetAction = {
    name: "LEND_ASSET",
    similes: [
        "lend usdc",
        "deposit for yield",
        "earn yield",
        "lend with lulo",
        "deposit usdc",
        "lending",
    ],
    description: "Lend USDC tokens to earn yield using Lulo protocol",
    examples: [
        [
            {
                input: {
                    amount: 100,
                },
                output: {
                    status: "success",
                    signature: "4xKpN2...",
                    message: "Successfully lent 100 USDC",
                },
                explanation: "Lend 100 USDC to earn yield on Lulo",
            },
        ],
    ],
    schema: zod_1.z.object({
        amount: zod_1.z.number().positive().describe("Amount of USDC to lend"),
    }),
    handler: async (agent, input) => {
        try {
            const amount = input.amount;
            const response = await (0, lulo_1.lendAsset)(agent, amount);
            return {
                status: "success",
                signature: response,
                message: `Successfully lent ${amount} USDC`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Lending failed: ${error.message}`,
            };
        }
    },
};
exports.default = lendAssetAction;
//# sourceMappingURL=lendAsset.js.map