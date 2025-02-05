"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const compressedAirdropAction = {
    name: "COMPRESSED_AIRDROP",
    similes: [
        "ZK Compressed airdrop",
        "Airdrop tokens with compression",
        "Send compressed SPL airdrop",
        "Airdrop to multiple recipients",
    ],
    description: "Airdrop SPL tokens with ZK Compression (also known as airdropping tokens) to multiple recipients",
    examples: [
        [
            {
                input: {
                    mintAddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
                    amount: 42,
                    decimals: 6,
                    recipients: [
                        "1nc1nerator11111111111111111111111111111111",
                        "BrFndAe111111111111111111111111111111111",
                    ],
                    priorityFeeInLamports: 30000,
                    shouldLog: true,
                },
                output: {
                    status: "success",
                    message: "Airdropped 42 tokens to 2 recipients.",
                    transactionHashes: ["4uyfBN...", "9XsF2N..."],
                },
                explanation: "Airdrops 42 tokens (with 6 decimals) to 2 recipients, optionally logging progress to stdout.",
            },
        ],
    ],
    // Validate inputs with zod
    schema: zod_1.z.object({
        mintAddress: zod_1.z
            .string()
            .min(1)
            .describe("Mint address of the token, e.g., 'JUPy...'"),
        amount: zod_1.z
            .number()
            .positive()
            .describe("Number of tokens to airdrop per recipient, e.g., 42"),
        decimals: zod_1.z
            .number()
            .nonnegative()
            .int()
            .describe("Decimals of the token, e.g., 6"),
        recipients: zod_1.z
            .array(zod_1.z.string())
            .nonempty()
            .describe("Array of recipient addresses, e.g., ['1nc1n...']"),
        priorityFeeInLamports: zod_1.z
            .number()
            .optional()
            .describe("Priority fee in lamports (default is 30_000)"),
        shouldLog: zod_1.z
            .boolean()
            .optional()
            .describe("Whether to log progress to stdout (default is false)"),
    }),
    handler: async (agent, input) => {
        try {
            const { mintAddress, amount, decimals, recipients, priorityFeeInLamports, shouldLog, } = input;
            // Call your airdrop method on the SolanaAgentKit
            const txs = await (0, tools_1.sendCompressedAirdrop)(mintAddress, amount, decimals, recipients, priorityFeeInLamports || 30000, shouldLog || false);
            return {
                status: "success",
                message: `Airdropped ${amount} tokens to ${recipients.length} recipients.`,
                transactionHashes: txs,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to airdrop tokens: ${error.message}`,
                code: error.code || "UNKNOWN_ERROR",
            };
        }
    },
};
exports.default = compressedAirdropAction;
//# sourceMappingURL=compressedAirdrop.js.map