"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const helius_1 = require("../../tools/helius");
const web3_js_1 = require("@solana/web3.js");
const sendTransactionWithPriorityFeeAction = {
    name: "SEND_TRANSACTION_WITH_PRIORITY_FEE",
    similes: [
        "send SOL with fee",
        "transfer tokens with priority",
        "execute priority transaction",
    ],
    description: "Sends SOL or SPL tokens from a wallet with an estimated priority fee, ensuring faster processing on the Solana network.",
    examples: [
        [
            {
                input: {
                    priorityLevel: "High",
                    amount: 2,
                    to: "BVdNLvyG2DNiWAXBE9qAmc4MTQXymd5Bzfo9xrQSUzVP",
                    splmintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                },
                output: {
                    status: "success",
                    transactionId: "5Xgq9xVABhwXpNStWpfqxS6Vm5Eau91pjfeHNwJbRgis",
                    fee: 5000,
                    message: "Transaction sent with priority fee successfully.",
                },
                explanation: "Sends 2 USDC to BVdNLvyG2DNiWAXBE9qAmc4MTQXymd5Bzfo9xrQSUzVP with High priority fee option.",
            },
        ],
    ],
    schema: zod_1.z.object({
        priorityLevel: zod_1.z
            .enum(["Min", "Low", "Medium", "High", "VeryHigh", "UnsafeMax"])
            .describe("Priority level to determine the urgency of the transaction."),
        amount: zod_1.z
            .number()
            .positive()
            .describe("Amount of SOL or SPL tokens to send."),
        to: zod_1.z.string().describe("Recipient's PublicKey."),
        splmintAddress: zod_1.z
            .string()
            .optional()
            .describe("Optional SPL token address, if transferring tokens other than SOL."),
    }),
    handler: async (agent, input) => {
        const { priorityLevel, amount, to, splmintAddress } = input;
        const toPublicKey = new web3_js_1.PublicKey(to);
        const splmintPublicKey = splmintAddress
            ? new web3_js_1.PublicKey(splmintAddress)
            : undefined;
        const result = await (0, helius_1.sendTransactionWithPriorityFee)(agent, priorityLevel, amount, toPublicKey, splmintPublicKey);
        return {
            status: "success",
            transactionId: result.transactionId,
            fee: result.fee,
            message: "Transaction sent with priority fee successfully.",
        };
    },
};
exports.default = sendTransactionWithPriorityFeeAction;
//# sourceMappingURL=sendTransactionWithPriority.js.map