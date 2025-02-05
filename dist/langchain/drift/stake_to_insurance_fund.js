"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaStakeToDriftInsuranceFundTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaStakeToDriftInsuranceFundTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "stake_to_drift_insurance_fund";
        this.description = `Stake a token to Drift Insurance Fund.
  
  Inputs (JSON string):
  - amount: number, amount to stake (required)
  - symbol: string, token symbol (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const tx = await this.solanaKit.stakeToDriftInsuranceFund(parsedInput.amount, parsedInput.symbol);
            return JSON.stringify({
                status: "success",
                message: `Staked ${parsedInput.amount} ${parsedInput.symbol} to the Drift Insurance Fund`,
                signature: tx,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "STAKE_TO_DRIFT_INSURANCE_FUND_ERROR",
            });
        }
    }
}
exports.SolanaStakeToDriftInsuranceFundTool = SolanaStakeToDriftInsuranceFundTool;
//# sourceMappingURL=stake_to_insurance_fund.js.map