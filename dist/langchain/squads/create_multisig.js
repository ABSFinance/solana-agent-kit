"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaCreate2by2Multisig = void 0;
const tools_1 = require("langchain/tools");
const web3_js_1 = require("@solana/web3.js");
class SolanaCreate2by2Multisig extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "create_2by2_multisig";
        this.description = `Create a 2-of-2 multisig account on Solana with the user and the agent, where both approvals will be required to run the transactions.
  
  Note: For one AI agent, only one 2-by-2 multisig can be created as it is pair-wise.

  Inputs (JSON string):
  - creator: string, the public key of the creator (required).`;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const creator = new web3_js_1.PublicKey(inputFormat.creator);
            const multisig = await this.solanaKit.createSquadsMultisig(creator);
            return JSON.stringify({
                status: "success",
                message: "2-by-2 multisig account created successfully",
                multisig,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "CREATE_2BY2_MULTISIG_ERROR",
            });
        }
    }
}
exports.SolanaCreate2by2Multisig = SolanaCreate2by2Multisig;
//# sourceMappingURL=create_multisig.js.map