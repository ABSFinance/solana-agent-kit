"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_asset = get_asset;
const umi_1 = require("@metaplex-foundation/umi");
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const digital_asset_standard_api_1 = require("@metaplex-foundation/digital-asset-standard-api");
/**
 * Fetch asset details using the Metaplex DAS API
 * @param agent SolanaAgentKit instance
 * @param assetId ID of the asset to fetch
 * @returns Asset details
 */
async function get_asset(agent, assetId) {
    try {
        const endpoint = agent.connection.rpcEndpoint;
        const umi = (0, umi_bundle_defaults_1.createUmi)(endpoint).use((0, digital_asset_standard_api_1.dasApi)());
        return await umi.rpc.getAsset((0, umi_1.publicKey)(assetId));
    }
    catch (error) {
        console.error("Error retrieving asset: ", error.message);
        throw new Error(`Asset retrieval failed: ${error.message}`);
    }
}
//# sourceMappingURL=get_asset.js.map