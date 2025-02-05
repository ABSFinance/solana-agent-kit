import { SolanaAgentKit } from "../../agent";
import { GetAssetsByAuthorityRpcInput } from "@metaplex-foundation/digital-asset-standard-api";
/**
 * Fetch assets by authority using the Metaplex DAS API
 * @param agent SolanaAgentKit instance
 * @param params Parameters for fetching assets by authority
 * @returns List of assets associated with the given authority
 */
export declare function get_assets_by_authority(agent: SolanaAgentKit, params: GetAssetsByAuthorityRpcInput): Promise<import("@metaplex-foundation/digital-asset-standard-api").DasApiAssetList>;
//# sourceMappingURL=get_assets_by_authority.d.ts.map