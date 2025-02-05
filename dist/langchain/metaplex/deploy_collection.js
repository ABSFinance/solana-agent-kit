"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaDeployCollectionTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaDeployCollectionTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_deploy_collection";
        this.description = `Deploy a new NFT collection on Solana blockchain.

  Inputs (input is a JSON string):
  name: string, eg "My Collection" (required)
  uri: string, eg "https://example.com/collection.json" (required)
  royaltyBasisPoints?: number, eg 500 for 5% (optional)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const result = await this.solanaKit.deployCollection(parsedInput);
            return JSON.stringify({
                status: "success",
                message: "Collection deployed successfully",
                collectionAddress: result.collectionAddress.toString(),
                name: parsedInput.name,
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
exports.SolanaDeployCollectionTool = SolanaDeployCollectionTool;
//# sourceMappingURL=deploy_collection.js.map