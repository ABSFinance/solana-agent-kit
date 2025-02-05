"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaListNFTForSaleTool = void 0;
const web3_js_1 = require("@solana/web3.js");
const tools_1 = require("langchain/tools");
class SolanaListNFTForSaleTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_list_nft_for_sale";
        this.description = `List an NFT for sale on Tensor Trade.

  Inputs (input is a JSON string):
  nftMint: string, the mint address of the NFT (required)
  price: number, price in SOL (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            // Validate NFT ownership first
            const nftAccount = await this.solanaKit.connection.getTokenAccountsByOwner(this.solanaKit.wallet_address, { mint: new web3_js_1.PublicKey(parsedInput.nftMint) });
            if (nftAccount.value.length === 0) {
                return JSON.stringify({
                    status: "error",
                    message: "NFT not found in wallet. Please make sure you own this NFT.",
                    code: "NFT_NOT_FOUND",
                });
            }
            const tx = await this.solanaKit.tensorListNFT(new web3_js_1.PublicKey(parsedInput.nftMint), parsedInput.price);
            return JSON.stringify({
                status: "success",
                message: "NFT listed for sale successfully",
                transaction: tx,
                price: parsedInput.price,
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
exports.SolanaListNFTForSaleTool = SolanaListNFTForSaleTool;
//# sourceMappingURL=list_nft.js.map