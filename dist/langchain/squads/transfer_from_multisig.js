"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaTransferFrom2by2Multisig = void 0;
const tools_1 = require("langchain/tools");
const web3_js_1 = require("@solana/web3.js");
const decimal_js_1 = __importDefault(require("decimal.js"));
class SolanaTransferFrom2by2Multisig extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "transfer_from_2by2_multisig";
        this.description = `Create a transaction to transfer funds from a 2-of-2 multisig account on Solana with the user and the agent, where both approvals will be required to run the transactions.

  Inputs (JSON string):
  - amount: number, the amount to transfer in SOL (required).
  - recipient: string, the public key of the recipient (required).`;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const amount = new decimal_js_1.default(inputFormat.amount);
            const recipient = new web3_js_1.PublicKey(inputFormat.recipient);
            const tx = await this.solanaKit.transferFromMultisig(amount.toNumber(), recipient);
            return JSON.stringify({
                status: "success",
                message: "Transaction added to 2-by-2 multisig account successfully",
                transaction: tx,
                amount: amount.toString(),
                recipient: recipient.toString(),
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "TRANSFER_FROM_2BY2_MULTISIG_ERROR",
            });
        }
    }
}
exports.SolanaTransferFrom2by2Multisig = SolanaTransferFrom2by2Multisig;
//# sourceMappingURL=transfer_from_multisig.js.map