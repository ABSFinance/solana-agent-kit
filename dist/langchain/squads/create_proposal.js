"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaCreateProposal2by2Multisig = void 0;
const tools_1 = require("langchain/tools");
class SolanaCreateProposal2by2Multisig extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "create_proposal_2by2_multisig";
        this.description = `Create a proposal to transfer funds from a 2-of-2 multisig account on Solana with the user and the agent, where both approvals will be required to run the transactions.
  
  If transactionIndex is not provided, the latest index will automatically be fetched and used.

  Inputs (JSON string):
  - transactionIndex: number, the index of the transaction (optional).`;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const transactionIndex = inputFormat.transactionIndex ?? undefined;
            const tx = await this.solanaKit.createMultisigProposal(transactionIndex);
            return JSON.stringify({
                status: "success",
                message: "Proposal created successfully",
                transaction: tx,
                transactionIndex: transactionIndex?.toString(),
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "CREATE_PROPOSAL_2BY2_MULTISIG_ERROR",
            });
        }
    }
}
exports.SolanaCreateProposal2by2Multisig = SolanaCreateProposal2by2Multisig;
//# sourceMappingURL=create_proposal.js.map