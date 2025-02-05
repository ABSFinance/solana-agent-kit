"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaRejectProposal2by2Multisig = void 0;
const tools_1 = require("langchain/tools");
class SolanaRejectProposal2by2Multisig extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "reject_proposal_2by2_multisig";
        this.description = `Reject a proposal to transfer funds from a 2-of-2 multisig account on Solana with the user and the agent, where both approvals will be required to run the transactions.
  
  If proposalIndex is not provided, the latest index will automatically be fetched and used.

  Inputs (JSON string):
  - proposalIndex: number, the index of the proposal (optional).`;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const proposalIndex = inputFormat.proposalIndex ?? undefined;
            const tx = await this.solanaKit.rejectMultisigProposal(proposalIndex);
            return JSON.stringify({
                status: "success",
                message: "Proposal rejected successfully",
                transaction: tx,
                proposalIndex: proposalIndex.toString(),
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "REJECT_PROPOSAL_2BY2_MULTISIG_ERROR",
            });
        }
    }
}
exports.SolanaRejectProposal2by2Multisig = SolanaRejectProposal2by2Multisig;
//# sourceMappingURL=reject_proposal.js.map