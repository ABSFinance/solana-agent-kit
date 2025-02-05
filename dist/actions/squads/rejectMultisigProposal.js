"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const rejectMultisigProposalAction = {
    name: "REJECT_MULTISIG_PROPOSAL_ACTION",
    similes: [
        "reject proposal",
        "reject proposal to transfer funds",
        "reject proposal to transfer funds from 2-of-2 multisig",
        "reject proposal to transfer funds from 2-of-2 multisig account",
        "reject proposal to transfer funds from 2-of-2 multisig account on Solana",
    ],
    description: `Reject a proposal to transfer funds from a 2-of-2 multisig account on Solana with the user and the agent, where both approvals will be required to run the transactions.`,
    examples: [
        [
            {
                input: {
                    proposalIndex: 0,
                },
                output: {
                    status: "success",
                    message: "Proposal rejected successfully",
                    transaction: "4xKpN2...",
                    proposalIndex: "0",
                },
                explanation: "Reject a proposal to transfer 1 SOL from 2-of-2 multisig account on Solana",
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
        const tx = await (0, tools_1.multisig_reject_proposal)(agent, proposalIndex);
        return {
            status: "success",
            message: "Proposal rejected successfully",
            transaction: tx,
            proposalIndex,
        };
    },
};
exports.default = rejectMultisigProposalAction;
//# sourceMappingURL=rejectMultisigProposal.js.map