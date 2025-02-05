import { SolanaAgentKit } from "../../agent";
/**
 * Get all domains owned by an address for a specific TLD
 * @param agent SolanaAgentKit instance
 * @param tld Top-level domain (e.g., "sol")
 * @returns Promise resolving to an array of owned domain names for the specified TLD or an empty array if none are found
 */
export declare function getOwnedDomainsForTLD(agent: SolanaAgentKit, tld: string): Promise<string[]>;
//# sourceMappingURL=get_owned_domains_for_tld.d.ts.map