import { SolanaAgentKit } from "../../agent";
import { PublicKey } from "@solana/web3.js";
/**
 * Get all domains owned domains for a specific TLD for the agent's wallet
 * @param agent SolanaAgentKit instance
 * @param owner - PublicKey of the owner
 * @returns Promise resolving to an array of owned domains or an empty array if none are found
 */
export declare function getOwnedAllDomains(agent: SolanaAgentKit, owner: PublicKey): Promise<string[]>;
//# sourceMappingURL=get_owned_all_domains.d.ts.map