import { SolanaAgentKit } from "../../agent";
import { GetAssetsByCreatorRpcInput } from "@metaplex-foundation/digital-asset-standard-api";
/**
 * Fetch assets by creator using the Metaplex DAS API
 * @param agent SolanaAgentKit instance
 * @param params Parameters for fetching assets by creator
 * @returns List of assets created by the specified creator
 */
export declare function get_assets_by_creator(agent: SolanaAgentKit, params: GetAssetsByCreatorRpcInput): Promise<import("@metaplex-foundation/digital-asset-standard-api").DasApiAssetList>;
//# sourceMappingURL=get_assets_by_creator.d.ts.map