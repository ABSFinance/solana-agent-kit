"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaGetAssetsByAuthorityTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaGetAssetsByAuthorityTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_get_assets_by_authority";
        this.description = `Fetch a list of assets by a specific authority address using the Metaplex DAS API.

  Inputs (input is a JSON string):
  authority: string, eg "mRdta4rc2RtsxEUDYuvKLamMZAdW6qHcwuq866Skxxv" (required)
  sortBy: { sortBy: "created" | "updated" | "recentAction" | "none", sortDirection: "asc" | "desc" } (optional)
  limit: number (optional)
  page: number (optional)
  before: string (optional)
  after: string (optional)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const result = await this.solanaKit.getAssetsByAuthority(parsedInput);
            return JSON.stringify({
                status: "success",
                message: "Assets retrieved successfully",
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
exports.SolanaGetAssetsByAuthorityTool = SolanaGetAssetsByAuthorityTool;
//# sourceMappingURL=get_assets_by_authority.js.map