"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaDriftLendAndBorrowAPYTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaDriftLendAndBorrowAPYTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "drift_lend_and_borrow_apy";
        this.description = `Get lending and borrowing APY for a token on Drift protocol.
  
  Inputs (JSON string):
  - symbol: string, token symbol (required)`;
    }
    async _call(input) {
        try {
            const apyInfo = await this.solanaKit.getLendAndBorrowAPY(input);
            return JSON.stringify({
                status: "success",
                message: `APY information retrieved for ${input}`,
                data: apyInfo,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "LEND_AND_BORROW_APY_ERROR",
            });
        }
    }
}
exports.SolanaDriftLendAndBorrowAPYTool = SolanaDriftLendAndBorrowAPYTool;
//# sourceMappingURL=lend_and_borrow_apy.js.map