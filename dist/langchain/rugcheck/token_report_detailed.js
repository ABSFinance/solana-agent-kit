"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaFetchTokenDetailedReportTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaFetchTokenDetailedReportTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_fetch_token_detailed_report";
        this.description = `Fetches a detailed report for a specific token from RugCheck.
  Inputs:
  - mint: string, the mint address of the token, e.g., "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN" (required).`;
    }
    async _call(input) {
        try {
            const mint = input.trim();
            const detailedReport = await this.solanaKit.fetchTokenDetailedReport(mint);
            return JSON.stringify({
                status: "success",
                message: "Detailed token report fetched successfully",
                report: detailedReport,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "FETCH_TOKEN_DETAILED_REPORT_ERROR",
            });
        }
    }
}
exports.SolanaFetchTokenDetailedReportTool = SolanaFetchTokenDetailedReportTool;
//# sourceMappingURL=token_report_detailed.js.map