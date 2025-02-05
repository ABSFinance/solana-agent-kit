"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaGetAssetTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaGetAssetTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_get_asset";
        this.description = `Fetch asset details for a given asset ID using the Metaplex DAS API.

  Inputs (input is a string):
  eg "8TrvJBRa6Pzb9BDadqroHhWTHxaxK8Ws8r91oZ2jxaVV" (required)`;
    }
    async _call(input) {
        try {
            const result = await this.solanaKit.getAsset(input);
            return JSON.stringify({
                status: "success",
                message: "Asset retrieved successfully",
                result,
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
exports.SolanaGetAssetTool = SolanaGetAssetTool;
//# sourceMappingURL=get_asset.js.map