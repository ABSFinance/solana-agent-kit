"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const web3_js_1 = require("@solana/web3.js");
const transferFromMultisigAction = {
    name: "TRANSFER_FROM_MULTISIG_ACTION",
    similes: [
        "transfer from multisig",
        "transfer from squads multisig",
        "transfer SOL from 2-by-2 multisig",
        "transfer from 2-of-2 multisig account",
        "transfer from 2-of-2 multisig account on Solana",
    ],
    description: `Create a transaction to transfer funds from a 2-of-2 multisig account on Solana using Squads with the user and the agent, where both approvals will be required to run the transactions.`,
    examples: [
        [
            {
                input: {
                    amount: 1,
                    recipient: "7nE9GvcwsqzYxmJLSrYmSB1V1YoJWVK1KWzAcWAzjXkN",
                },
                output: {
                    status: "success",
                    message: "Transaction added to 2-by-2 multisig account successfully",
                    transaction: "4xKpN2...",
                    amount: "1",
                    recipient: "7nE9GvcwsqzYxmJLSrYmSB1V1YoJWVK1KWzAcWAzjXkN",
                },
                explanation: "Transfer 1 SOL from 2-of-2 multisig account on Solana",
            },
        ],
    ],
    schema: zod_1.z.object({
        amount: zod_1.z.number().min(0, "Amount must be greater than 0"),
        recipient: zod_1.z.string(),
    }),
    handler: async (agent, input) => {
        const multisig = await (0, tools_1.multisig_transfer_from_treasury)(agent, input.amount, new web3_js_1.PublicKey(input.recipient));
        return {
            status: "success",
            message: "Transaction added to 2-by-2 multisig account successfully",
            transaction: multisig,
            amount: input.amount,
            recipient: input.recipient,
        };
    },
};
exports.default = transferFromMultisigAction;
//# sourceMappingURL=transferFromMultisigTreasury.js.map