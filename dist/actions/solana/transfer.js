"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const transferAction = {
    name: "TRANSFER",
    similes: [
        "send tokens",
        "transfer funds",
        "send money",
        "send sol",
        "transfer tokens",
    ],
    description: `Transfer tokens or SOL to another address (also called as wallet address).`,
    examples: [
        [
            {
                input: {
                    to: "8x2dR8Mpzuz2YqyZyZjUbYWKSWesBo5jMx2Q9Y86udVk",
                    amount: 1,
                },
                output: {
                    status: "success",
                    message: "Transfer completed successfully",
                    amount: 1,
                    recipient: "8x2dR8Mpzuz2YqyZyZjUbYWKSWesBo5jMx2Q9Y86udVk",
                    token: "SOL",
                    transaction: "5UfgJ5vVZxUxefDGqzqkVLHzHxVTyYH9StYyHKgvHYmXJgqJKxEqy9k4Rz9LpXrHF9kUZB7",
                },
                explanation: "Transfer 1 SOL to the recipient address",
            },
        ],
        [
            {
                input: {
                    to: "8x2dR8Mpzuz2YqyZyZjUbYWKSWesBo5jMx2Q9Y86udVk",
                    amount: 100,
                    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                },
                output: {
                    status: "success",
                    message: "Transfer completed successfully",
                    amount: 100,
                    recipient: "8x2dR8Mpzuz2YqyZyZjUbYWKSWesBo5jMx2Q9Y86udVk",
                    token: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                    transaction: "4VfgJ5vVZxUxefDGqzqkVLHzHxVTyYH9StYyHKgvHYmXJgqJKxEqy9k4Rz9LpXrHF9kUZB7",
                },
                explanation: "Transfer 100 USDC tokens to the recipient address",
            },
        ],
    ],
    schema: zod_1.z.object({
        to: zod_1.z.string().min(32, "Invalid Solana address"),
        amount: zod_1.z.number().positive("Amount must be positive"),
        mint: zod_1.z.string().optional(),
    }),
    handler: async (agent, input) => {
        const recipient = new web3_js_1.PublicKey(input.to);
        const mintAddress = input.mint ? new web3_js_1.PublicKey(input.mint) : undefined;
        const tx = await (0, tools_1.transfer)(agent, recipient, input.amount, mintAddress);
        return {
            status: "success",
            message: "Transfer completed successfully",
            amount: input.amount,
            recipient: input.to,
            token: input.mint || "SOL",
            transaction: tx,
        };
    },
};
exports.default = transferAction;
//# sourceMappingURL=transfer.js.map