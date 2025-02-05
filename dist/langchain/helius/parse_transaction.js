"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaParseTransactionHeliusTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaParseTransactionHeliusTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_parse_transaction_helius";
        this.description = `Parse a Solana transaction using Helius API.
    Inputs:
    - transactionId: string, the ID of the transaction to parse, e.g., "5h3k...9d2k" (required).`;
    }
    async _call(input) {
        try {
            const transactionId = input.trim();
            const parsedTransaction = await this.solanaKit.heliusParseTransactions(transactionId);
            return JSON.stringify({
                status: "success",
                message: "transaction parsed successfully",
                transaction: parsedTransaction,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "NOt able to Parse transaction",
            });
        }
    }
}
exports.SolanaParseTransactionHeliusTool = SolanaParseTransactionHeliusTool;
//# sourceMappingURL=parse_transaction.js.map