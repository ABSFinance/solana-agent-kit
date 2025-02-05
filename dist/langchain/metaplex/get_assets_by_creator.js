"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaGetAssetsByCreatorTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaGetAssetsByCreatorTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_get_assets_by_creator";
        this.description = `Fetch a list of assets created by a specific address using the Metaplex DAS API.

  Inputs (input is a JSON string):
  creator: string, eg "D3XrkNZz6wx6cofot7Zohsf2KSsu2ArngNk8VqU9cTY3" (required)
  onlyVerified: boolean (optional)
  sortBy: { sortBy: "created" | "updated" | "recentAction" | "none", sortDirection: "asc" | "desc" } (optional)
  limit: number (optional)
  page: number (optional)
  before: string (optional)
  after: string (optional)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const result = await this.solanaKit.getAssetsByCreator(parsedInput);
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
exports.SolanaGetAssetsByCreatorTool = SolanaGetAssetsByCreatorTool;
//# sourceMappingURL=get_assets_by_creator.js.map