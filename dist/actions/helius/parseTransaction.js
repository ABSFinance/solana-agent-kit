"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const helius_1 = require("../../tools/helius");
const parseSolanaTransactionAction = {
    name: "PARSE_SOLANA_TRANSACTION",
    similes: [
        "parse transaction",
        "analyze transaction",
        "inspect transaction",
        "decode transaction",
    ],
    description: "Parse a Solana transaction to retrieve detailed information using the Helius Enhanced Transactions API",
    examples: [
        [
            {
                input: {
                    transactionId: "4zZVvbgzcriyjAeEiK1w7CeDCt7gYThUCZat3ULTNerzKHF4WLfRG2YUjbRovfFJ639TAyARB4oyRDcLVUvrakq7",
                },
                output: {
                    status: "success",
                    transaction: {
                        details: "Transaction details...",
                        involvedAccounts: ["Account1", "Account2"],
                        executedOperations: [{ operation: "Transfer", amount: "1000 SOL" }],
                    },
                    message: "Successfully parsed transaction: 4zZVvbgzcriyjAeEiK1w7CeDCt7gYThUCZat3ULTNerzKHF4WLfRG2YUjbRovfFJ639TAyARB4oyRDcLVUvrakq7",
                },
                explanation: "Parse a Transaction to transform it into human readable format.",
            },
        ],
    ],
    schema: zod_1.z.object({
        transactionId: zod_1.z
            .string()
            .min(1)
            .describe("The Solana transaction ID to parse"),
    }),
    handler: async (agent, input) => {
        try {
            const parsedTransactionData = await (0, helius_1.parseTransaction)(agent, input.transactionId);
            return {
                status: "success",
                transaction: parsedTransactionData,
                message: `Successfully parsed transaction: ${input.transactionId}`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to parse transaction: ${error.message}`,
            };
        }
    },
};
exports.default = parseSolanaTransactionAction;
//# sourceMappingURL=parseTransaction.js.map