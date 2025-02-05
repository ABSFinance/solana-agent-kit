"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaGetAllAssetsByOwner = void 0;
const tools_1 = require("langchain/tools");
const web3_js_1 = require("@solana/web3.js");
class SolanaGetAllAssetsByOwner extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_get_all_assets_by_owner";
        this.description = `Get all assets owned by a specific wallet address.
    Inputs:
    - owner: string, the wallet address of the owner, e.g., "4Be9CvxqHW6BYiRAxW9Q3xu1ycTMWaL5z8NX4HR3ha7t" (required)
    - limit: number, the maximum number of assets to retrieve (optional)`;
    }
    async _call(input) {
        try {
            const { owner, limit } = JSON.parse(input);
            const ownerPubkey = new web3_js_1.PublicKey(owner);
            const assets = await this.solanaKit.getAllAssetsbyOwner(ownerPubkey, limit);
            return JSON.stringify({
                status: "success",
                message: "Assets retrieved successfully",
                assets: assets,
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
exports.SolanaGetAllAssetsByOwner = SolanaGetAllAssetsByOwner;
//# sourceMappingURL=get_all_assets.js.map