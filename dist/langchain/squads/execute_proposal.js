"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaExecuteProposal2by2Multisig = void 0;
const tools_1 = require("langchain/tools");
class SolanaExecuteProposal2by2Multisig extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "execute_proposal_2by2_multisig";
        this.description = `Execute a proposal/transaction to transfer funds from a 2-of-2 multisig account on Solana with the user and the agent, where both approvals will be required to run the transactions.
  
  If proposalIndex is not provided, the latest index will automatically be fetched and used.

  Inputs (JSON string):
  - proposalIndex: number, the index of the proposal (optional).`;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const proposalIndex = inputFormat.proposalIndex ?? undefined;
            const tx = await this.solanaKit.executeMultisigTransaction(proposalIndex);
            return JSON.stringify({
                status: "success",
                message: "Proposal executed successfully",
                transaction: tx,
                proposalIndex: proposalIndex.toString(),
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "EXECUTE_PROPOSAL_2BY2_MULTISIG_ERROR",
            });
        }
    }
}
exports.SolanaExecuteProposal2by2Multisig = SolanaExecuteProposal2by2Multisig;
//# sourceMappingURL=execute_proposal.js.map