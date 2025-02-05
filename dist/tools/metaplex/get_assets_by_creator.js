"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_assets_by_creator = get_assets_by_creator;
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const digital_asset_standard_api_1 = require("@metaplex-foundation/digital-asset-standard-api");
/**
 * Fetch assets by creator using the Metaplex DAS API
 * @param agent SolanaAgentKit instance
 * @param params Parameters for fetching assets by creator
 * @returns List of assets created by the specified creator
 */
async function get_assets_by_creator(agent, params) {
    const umi = (0, umi_bundle_defaults_1.createUmi)(agent.connection.rpcEndpoint).use((0, digital_asset_standard_api_1.dasApi)());
    return await umi.rpc.getAssetsByCreator(params);
}
//# sourceMappingURL=get_assets_by_creator.js.map