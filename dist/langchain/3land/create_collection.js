"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solana3LandCreateCollection = void 0;
const tools_1 = require("langchain/tools");
class Solana3LandCreateCollection extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "3land_minting_tool";
        this.description = `Creates an NFT Collection that you can visit on 3.land's website (3.land/collection/{collectionAccount})
  
  Inputs:
  isMainnet (required): defines is the tx takes places in mainnet
  collectionSymbol (required): the symbol of the collection
  collectionName (required): the name of the collection
  collectionDescription (required): the description of the collection
  mainImageUrl (required): the image of the collection
  coverImageUrl (optional): the cover image of the collection
  priorityFeeParam (optional): default value is 50000, if tx doesnt land this param can help it land
  `;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const isMainnet = inputFormat.isMainnet;
            const collectionSymbol = inputFormat?.collectionSymbol;
            const collectionName = inputFormat?.collectionName;
            const collectionDescription = inputFormat?.collectionDescription;
            const mainImageUrl = inputFormat?.mainImageUrl;
            const coverImageUrl = inputFormat?.coverImageUrl;
            const priorityFeeParam = inputFormat?.priorityFeeParam;
            const collectionOpts = {
                ...(collectionSymbol && { collectionSymbol }),
                ...(collectionName && { collectionName }),
                ...(collectionDescription && { collectionDescription }),
                ...(mainImageUrl && { mainImageUrl }),
                ...(coverImageUrl && { coverImageUrl }),
            };
            const tx = await this.solanaKit.create3LandCollection(collectionOpts, !isMainnet, priorityFeeParam);
            return JSON.stringify({
                status: "success",
                message: `Created Collection successfully ${tx}`,
                transaction: tx,
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
exports.Solana3LandCreateCollection = Solana3LandCreateCollection;
//# sourceMappingURL=create_collection.js.map