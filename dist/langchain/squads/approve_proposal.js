"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaApproveProposal2by2Multisig = void 0;
const tools_1 = require("langchain/tools");
class SolanaApproveProposal2by2Multisig extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "approve_proposal_2by2_multisig";
        this.description = `Approve a proposal to transfer funds from a 2-of-2 multisig account on Solana with the user and the agent, where both approvals will be required to run the transactions.
  
  If proposalIndex is not provided, the latest index will automatically be fetched and used.

  Inputs (JSON string):
  - proposalIndex: number, the index of the proposal (optional).`;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const proposalIndex = inputFormat.proposalIndex ?? undefined;
            const tx = await this.solanaKit.approveMultisigProposal(proposalIndex);
            return JSON.stringify({
                status: "success",
                message: "Proposal approved successfully",
                transaction: tx,
                proposalIndex: proposalIndex.toString(),
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "APPROVE_PROPOSAL_2BY2_MULTISIG_ERROR",
            });
        }
    }
}
exports.SolanaApproveProposal2by2Multisig = SolanaApproveProposal2by2Multisig;
//# sourceMappingURL=approve_proposal.js.map