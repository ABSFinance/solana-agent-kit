"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const depositToMultisigAction = {
    name: "DEPOSIT_TO_MULTISIG_ACTION",
    similes: [
        "deposit to multisig",
        "deposit to squads multisig",
        "deposit to 2-of-2 multisig account",
        "deposit to 2-of-2 multisig account on Solana",
        "deposit SOL to 2-of-2 multisig",
        "deposit SPL tokens to 2-of-2 multisig",
    ],
    description: `Deposit funds to a 2-of-2 multisig account on Solana with the user and the agent, where both approvals will be required to run the transactions.`,
    examples: [
        [
            {
                input: {
                    amount: 1,
                },
                output: {
                    status: "success",
                    message: "Funds deposited to 2-by-2 multisig account successfully",
                    signature: "4xKpN2...",
                },
                explanation: "Deposit 1 SOL to 2-of-2 multisig account on Solana",
            },
        ],
    ],
    schema: zod_1.z.object({
        amount: zod_1.z.number().min(0, "Amount must be greater than 0"),
    }),
    handler: async (agent, input) => {
        const multisig = await (0, tools_1.multisig_deposit_to_treasury)(agent, input.amount);
        return {
            status: "success",
            message: "Funds deposited to 2-by-2 multisig account successfully",
            signature: multisig,
        };
    },
};
exports.default = depositToMultisigAction;
//# sourceMappingURL=depositToMultisigTreasury.js.map