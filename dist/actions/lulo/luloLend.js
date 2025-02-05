"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const lulo_1 = require("../../tools/lulo");
const luloLendAction = {
    name: "LULO_LEND",
    similes: [
        "lend USDC with lulo",
        "lend PYUSD with lulo",
        "lend USDS with lulo",
        "lend USDT with lulo",
        "lend SQL with lulo",
        "lend jitoSQL with lulo",
        "lend bSQL with lulo",
        "lend mSQL with lulo",
        "lend BONK with lulo",
        "lend JUP with lulo",
    ],
    description: "Lend SPL tokens using Lulo protocol",
    examples: [
        [
            {
                input: {
                    mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                    amount: 100,
                },
                output: {
                    status: "success",
                    signature: "4xKpN2...",
                    message: "Successfully lend 100 USDC",
                },
                explanation: "Lend 100 USDC on Lulo",
            },
        ],
    ],
    schema: zod_1.z.object({
        mintAddress: zod_1.z.string().describe("SPL Mint address"),
        amount: zod_1.z.number().positive().describe("Amount to lend"),
    }),
    handler: async (agent, input) => {
        try {
            const mintAddress = input.mintAddress;
            const amount = input.amount;
            const response = await (0, lulo_1.luloLend)(agent, mintAddress, amount);
            return {
                status: "success",
                signature: response,
                message: `Successfully lend ${amount} of token ${mintAddress}`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Lend failed: ${error.message}`,
            };
        }
    },
};
exports.default = luloLendAction;
//# sourceMappingURL=luloLend.js.map