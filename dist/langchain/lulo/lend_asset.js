"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaLendAssetTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaLendAssetTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_lend_asset";
        this.description = `Lend idle USDC for yield using Lulo. ( only USDC is supported )

  Inputs (input is a json string):
  amount: number, eg 1, 0.01 (required)`;
    }
    async _call(input) {
        try {
            const amount = JSON.parse(input).amount || input;
            const tx = await this.solanaKit.lendAssets(amount);
            return JSON.stringify({
                status: "success",
                message: "Asset lent successfully",
                transaction: tx,
                amount,
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
exports.SolanaLendAssetTool = SolanaLendAssetTool;
//# sourceMappingURL=lend_asset.js.map