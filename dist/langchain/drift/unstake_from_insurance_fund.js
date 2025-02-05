"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaUnstakeFromDriftInsuranceFundTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaUnstakeFromDriftInsuranceFundTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "unstake_from_drift_insurance_fund";
        this.description = `Unstake tokens from Drift Insurance Fund after request period has elapsed.
  
  Inputs (JSON string):
  - symbol: string, token symbol (required)`;
    }
    async _call(input) {
        try {
            const tx = await this.solanaKit.unstakeFromDriftInsuranceFund(input);
            return JSON.stringify({
                status: "success",
                message: `Unstaked ${input} from the Drift Insurance Fund`,
                signature: tx,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNSTAKE_FROM_DRIFT_INSURANCE_FUND_ERROR",
            });
        }
    }
}
exports.SolanaUnstakeFromDriftInsuranceFundTool = SolanaUnstakeFromDriftInsuranceFundTool;
//# sourceMappingURL=unstake_from_insurance_fund.js.map