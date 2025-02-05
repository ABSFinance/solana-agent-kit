"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaCancelNFTListingTool = void 0;
const web3_js_1 = require("@solana/web3.js");
const tools_1 = require("langchain/tools");
class SolanaCancelNFTListingTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_cancel_nft_listing";
        this.description = `Cancel an NFT listing on Tensor Trade.

  Inputs (input is a JSON string):
  nftMint: string, the mint address of the NFT (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const tx = await this.solanaKit.tensorCancelListing(new web3_js_1.PublicKey(parsedInput.nftMint));
            return JSON.stringify({
                status: "success",
                message: "NFT listing cancelled successfully",
                transaction: tx,
                nftMint: parsedInput.nftMint,
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
exports.SolanaCancelNFTListingTool = SolanaCancelNFTListingTool;
//# sourceMappingURL=cancel_listing.js.map