"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const createMultisigProposalAction = {
    name: "CREATE_MULTISIG_PROPOSAL_ACTION",
    similes: [
        "create proposal",
        "create proposal to transfer funds",
        "create proposal to transfer funds from 2-of-2 multisig",
        "create proposal to transfer funds from 2-of-2 multisig account",
        "create proposal to transfer funds from 2-of-2 multisig account on Solana",
    ],
    description: `Create a proposal to transfer funds from a 2-of-2 multisig account on Solana with the user and the agent, where both approvals will be required to run the transactions.
  
  If transactionIndex is not provided, the latest index will automatically be fetched and used.`,
    examples: [
        [
            {
                input: {
                    transactionIndex: 0,
                },
                output: {
                    status: "success",
                    message: "Proposal created successfully",
                    transaction: "4xKpN2...",
                    transactionIndex: "0",
                },
                explanation: "Create a proposal to transfer 1 SOL from 2-of-2 multisig account on Solana",
            },
        ],
    ],
    schema: zod_1.z.object({
        transactionIndex: zod_1.z.number().optional(),
    }),
    handler: async (agent, input) => {
        const transactionIndex = input.transactionIndex !== undefined
            ? Number(input.transactionIndex)
            : undefined;
        const multisig = await (0, tools_1.multisig_create_proposal)(agent, transactionIndex);
        return {
            status: "success",
            message: "Proposal created successfully",
            transaction: multisig,
            transactionIndex: transactionIndex,
        };
    },
};
exports.default = createMultisigProposalAction;
//# sourceMappingURL=createMultisigProposal.js.map