"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaMintNFTTool = void 0;
const web3_js_1 = require("@solana/web3.js");
const tools_1 = require("langchain/tools");
class SolanaMintNFTTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_mint_nft";
        this.description = `Mint a new NFT in a collection on Solana blockchain.

    Inputs (input is a JSON string):
    collectionMint: string, eg "J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w" (required) - The address of the collection to mint into
    name: string, eg "My NFT" (required)
    uri: string, eg "https://example.com/nft.json" (required)
    recipient?: string, eg "9aUn5swQzUTRanaaTwmszxiv89cvFwUCjEBv1vZCoT1u" (optional) - The wallet to receive the NFT, defaults to agent's wallet which is ${this.solanaKit.wallet_address.toString()}`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const result = await this.solanaKit.mintNFT(new web3_js_1.PublicKey(parsedInput.collectionMint), {
                name: parsedInput.name,
                uri: parsedInput.uri,
            }, parsedInput.recipient
                ? new web3_js_1.PublicKey(parsedInput.recipient)
                : this.solanaKit.wallet_address);
            return JSON.stringify({
                status: "success",
                message: "NFT minted successfully",
                mintAddress: result.mint.toString(),
                metadata: {
                    name: parsedInput.name,
                    symbol: parsedInput.symbol,
                    uri: parsedInput.uri,
                },
                recipient: parsedInput.recipient || result.mint.toString(),
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
exports.SolanaMintNFTTool = SolanaMintNFTTool;
//# sourceMappingURL=mint_nft.js.map