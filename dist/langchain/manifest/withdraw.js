"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaWithdrawAllTool = void 0;
const web3_js_1 = require("@solana/web3.js");
const tools_1 = require("langchain/tools");
class SolanaWithdrawAllTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_withdraw_all";
        this.description = `This tool can be used to withdraw all funds from a Manifest market.

  Input ( input is a JSON string ):
  marketId: string, eg "ENhU8LsaR7vDD2G1CsWcsuSGNrih9Cv5WZEk7q9kPapQ" for SOL/USDC (required)`;
    }
    async _call(input) {
        try {
            const marketId = new web3_js_1.PublicKey(input.trim());
            const tx = await this.solanaKit.withdrawAll(marketId);
            return JSON.stringify({
                status: "success",
                message: "Withdrew successfully",
                transaction: tx,
                marketId,
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
exports.SolanaWithdrawAllTool = SolanaWithdrawAllTool;
//# sourceMappingURL=withdraw.js.map