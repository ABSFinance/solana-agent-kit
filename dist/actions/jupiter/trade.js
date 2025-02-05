"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const tradeAction = {
    name: "TRADE",
    similes: [
        "swap tokens",
        "exchange tokens",
        "trade tokens",
        "convert tokens",
        "swap sol",
    ],
    description: `This tool can be used to swap tokens to another token (It uses Jupiter Exchange).`,
    examples: [
        [
            {
                input: {
                    outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                    inputAmount: 1,
                },
                output: {
                    status: "success",
                    message: "Trade executed successfully",
                    transaction: "5UfgJ5vVZxUxefDGqzqkVLHzHxVTyYH9StYyHKgvHYmXJgqJKxEqy9k4Rz9LpXrHF9kUZB7",
                    inputAmount: 1,
                    inputToken: "SOL",
                    outputToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                },
                explanation: "Swap 1 SOL for USDC",
            },
        ],
        [
            {
                input: {
                    outputMint: "So11111111111111111111111111111111111111112",
                    inputAmount: 100,
                    inputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                    slippageBps: 100,
                },
                output: {
                    status: "success",
                    message: "Trade executed successfully",
                    transaction: "4VfgJ5vVZxUxefDGqzqkVLHzHxVTyYH9StYyHKgvHYmXJgqJKxEqy9k4Rz9LpXrHF9kUZB7",
                    inputAmount: 100,
                    inputToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                    outputToken: "So11111111111111111111111111111111111111112",
                },
                explanation: "Swap 100 USDC for SOL with 1% slippage",
            },
        ],
    ],
    schema: zod_1.z.object({
        outputMint: zod_1.z.string().min(32, "Invalid output mint address"),
        inputAmount: zod_1.z.number().positive("Input amount must be positive"),
        inputMint: zod_1.z.string().min(32, "Invalid input mint address").optional(),
        slippageBps: zod_1.z.number().min(0).max(10000).optional(),
    }),
    handler: async (agent, input) => {
        const tx = await (0, tools_1.trade)(agent, new web3_js_1.PublicKey(input.outputMint), input.inputAmount, input.inputMint
            ? new web3_js_1.PublicKey(input.inputMint)
            : new web3_js_1.PublicKey("So11111111111111111111111111111111111111112"), input.slippageBps);
        return {
            status: "success",
            message: "Trade executed successfully",
            transaction: tx,
            inputAmount: input.inputAmount,
            inputToken: input.inputMint || "SOL",
            outputToken: input.outputMint,
        };
    },
};
exports.default = tradeAction;
//# sourceMappingURL=trade.js.map