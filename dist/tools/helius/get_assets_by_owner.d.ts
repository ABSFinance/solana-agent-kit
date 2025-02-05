import { SolanaAgentKit } from "../../index";
import { PublicKey } from "@solana/web3.js";
/**
 * Fetch assets by owner using the Helius Digital Asset Standard (DAS) API
 * @param agent SolanaAgentKit instance
 * @param ownerPublicKey Owner's Solana wallet PublicKey
 * @param limit Number of assets to retrieve per request
 * @returns Assets owned by the specified address
 */
export declare function getAssetsByOwner(agent: SolanaAgentKit, ownerPublicKey: PublicKey, limit: number): Promise<any>;
//# sourceMappingURL=get_assets_by_owner.d.ts.map