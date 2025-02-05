import { TokenCheck } from "../../types";
/**
 * Fetches a summary report for a specific token.
 * @async
 * @param {string} mint - The mint address of the token.
 * @returns {Promise<TokenCheck>} The token summary report.
 * @throws {Error} If the API call fails.
 */
export declare function fetchTokenReportSummary(mint: string): Promise<TokenCheck>;
/**
 * Fetches a detailed report for a specific token.
 * @async
 * @param {string} mint - The mint address of the token.
 * @returns {Promise<TokenCheck>} The detailed token report.
 * @throws {Error} If the API call fails.
 */
export declare function fetchTokenDetailedReport(mint: string): Promise<TokenCheck>;
//# sourceMappingURL=rugcheck.d.ts.map