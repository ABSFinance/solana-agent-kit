"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaDepositTo2by2Multisig = void 0;
const tools_1 = require("langchain/tools");
const decimal_js_1 = __importDefault(require("decimal.js"));
class SolanaDepositTo2by2Multisig extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "deposit_to_2by2_multisig";
        this.description = `Deposit funds to a 2-of-2 multisig account on Solana with the user and the agent, where both approvals will be required to run the transactions.

  Inputs (JSON string):
  - amount: number, the amount to deposit in SOL (required).`;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const amount = new decimal_js_1.default(inputFormat.amount);
            const tx = await this.solanaKit.depositToMultisig(amount.toNumber());
            return JSON.stringify({
                status: "success",
                message: "Funds deposited to 2-by-2 multisig account successfully",
                transaction: tx,
                amount: amount.toString(),
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "DEPOSIT_TO_2BY2_MULTISIG_ERROR",
            });
        }
    }
}
exports.SolanaDepositTo2by2Multisig = SolanaDepositTo2by2Multisig;
//# sourceMappingURL=deposit_to_multisig.js.map