"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaRequestUnstakeFromDriftInsuranceFundTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaRequestUnstakeFromDriftInsuranceFundTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "request_unstake_from_drift_insurance_fund";
        this.description = `Request to unstake tokens from Drift Insurance Fund.
  
  Inputs (JSON string):
  - amount: number, amount to unstake (required)
  - symbol: string, token symbol (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const tx = await this.solanaKit.requestUnstakeFromDriftInsuranceFund(parsedInput.amount, parsedInput.symbol);
            return JSON.stringify({
                status: "success",
                message: `Requested unstake of ${parsedInput.amount} ${parsedInput.symbol} from the Drift Insurance Fund`,
                signature: tx,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "REQUEST_UNSTAKE_FROM_DRIFT_INSURANCE_FUND_ERROR",
            });
        }
    }
}
exports.SolanaRequestUnstakeFromDriftInsuranceFundTool = SolanaRequestUnstakeFromDriftInsuranceFundTool;
//# sourceMappingURL=request_unstake_from_insurance_fund.js.map