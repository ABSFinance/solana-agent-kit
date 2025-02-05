"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaSendTransactionWithPriorityFee = void 0;
const tools_1 = require("langchain/tools");
const web3_js_1 = require("@solana/web3.js");
class SolanaSendTransactionWithPriorityFee extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_send_transaction_with_priority_fee";
        this.description = `Sends a Solana transaction with a user-defined priority fee.
    **Inputs (JSON-encoded string)**:
    - priorityLevel: string — the priority level ("NONE", "Min", "Low", "Medium", "High", "VeryHigh", or "UnsafeMax")
    - amount: number — the amount of SOL to send
    - to: string — the recipient's wallet address (public key in base58);`;
    }
    async _call(input) {
        try {
            const { priorityLevel, amount, to, splmintAddress } = JSON.parse(input);
            const validPriorityLevels = [
                "NONE",
                "Min",
                "Low",
                "Medium",
                "High",
                "VeryHigh",
                "UnsafeMax",
            ];
            if (!validPriorityLevels.includes(priorityLevel)) {
                throw new Error(`Invalid priority level. Must be one of: ${validPriorityLevels.join(", ")}. Received: ${priorityLevel}`);
            }
            if (!amount || !to) {
                throw new Error(`Missing required fields. Received: priorityLevel=${priorityLevel}, amount=${amount}, to=${to}`);
            }
            const toPubkey = new web3_js_1.PublicKey(to);
            const priorityFeeTx = await this.solanaKit.sendTranctionWithPriority(priorityLevel, amount, toPubkey, splmintAddress);
            return JSON.stringify({
                status: "success",
                message: "Transaction sent successfully",
                priorityFeeTx,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaSendTransactionWithPriorityFee = SolanaSendTransactionWithPriorityFee;
//# sourceMappingURL=send_transaction_priority.js.map