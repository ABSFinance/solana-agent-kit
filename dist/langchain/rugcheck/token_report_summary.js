"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaFetchTokenReportSummaryTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaFetchTokenReportSummaryTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_fetch_token_report_summary";
        this.description = `Fetches a summary report for a specific token from RugCheck.
  Inputs:
  - mint: string, the mint address of the token, e.g., "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN" (required).`;
    }
    async _call(input) {
        try {
            const mint = input.trim();
            const report = await this.solanaKit.fetchTokenReportSummary(mint);
            return JSON.stringify({
                status: "success",
                message: "Token report summary fetched successfully",
                report,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "FETCH_TOKEN_REPORT_SUMMARY_ERROR",
            });
        }
    }
}
exports.SolanaFetchTokenReportSummaryTool = SolanaFetchTokenReportSummaryTool;
//# sourceMappingURL=token_report_summary.js.map