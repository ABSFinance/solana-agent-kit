"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const executeMultisigProposalAction = {
    name: "EXECUTE_MULTISIG_PROPOSAL_ACTION",
    similes: [
        "execute proposal",
        "execute proposal to transfer funds",
        "execute proposal to transfer funds from 2-of-2 multisig",
        "execute proposal to transfer funds from 2-of-2 multisig account",
        "execute proposal to transfer funds from 2-of-2 multisig account on Solana",
    ],
    description: `Execute a proposal to transfer funds from a 2-of-2 multisig account on Solana with the user and the agent, where both approvals will be required to run the transactions.`,
    examples: [
        [
            {
                input: {
                    proposalIndex: 0,
                },
                output: {
                    status: "success",
                    message: "Proposal executed successfully",
                    transaction: "4xKpN2...",
                    proposalIndex: "0",
                },
                explanation: "Execute a proposal to transfer 1 SOL from 2-of-2 multisig account on Solana",
            },
        ],
    ],
    schema: zod_1.z.object({
        proposalIndex: zod_1.z.number().optional(),
    }),
    handler: async (agent, input) => {
        const proposalIndex = input.proposalIndex !== undefined
            ? Number(input.proposalIndex)
            : undefined;
        const multisig = await (0, tools_1.multisig_execute_proposal)(agent, proposalIndex);
        return {
            status: "success",
            message: "Proposal executed successfully",
            transaction: multisig,
            proposalIndex,
        };
    },
};
exports.default = executeMultisigProposalAction;
//# sourceMappingURL=executeMultisigProposal.js.map