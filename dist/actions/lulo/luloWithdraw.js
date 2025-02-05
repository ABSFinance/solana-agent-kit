"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const lulo_1 = require("../../tools/lulo");
const luloWithdrawAction = {
    name: "LULO_WITHDRAW",
    similes: [
        "withdraw USDC with lulo",
        "withdraw PYUSD with lulo",
        "withdraw USDS with lulo",
        "withdraw USDT with lulo",
        "withdraw SQL with lulo",
        "withdraw jitoSQL with lulo",
        "withdraw bSQL with lulo",
        "withdraw mSQL with lulo",
        "withdraw BONK with lulo",
        "withdraw JUP with lulo",
    ],
    description: "Withdraw SPL tokens using Lulo protocol",
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
                    message: "Successfully withdraw 100 USDC",
                },
                explanation: "Withdraw 100 USDC on Lulo",
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
            const response = await (0, lulo_1.luloWithdraw)(agent, mintAddress, amount);
            return {
                status: "success",
                signature: response,
                message: `Successfully withdraw ${amount} of token ${mintAddress}`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Withdraw failed: ${error.message}`,
            };
        }
    },
};
exports.default = luloWithdrawAction;
//# sourceMappingURL=luloWithdraw.js.map