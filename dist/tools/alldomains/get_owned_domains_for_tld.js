"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnedDomainsForTLD = getOwnedDomainsForTLD;
const tldparser_1 = require("@onsol/tldparser");
/**
 * Get all domains owned by an address for a specific TLD
 * @param agent SolanaAgentKit instance
 * @param tld Top-level domain (e.g., "sol")
 * @returns Promise resolving to an array of owned domain names for the specified TLD or an empty array if none are found
 */
async function getOwnedDomainsForTLD(agent, tld) {
    try {
        const domains = await new tldparser_1.TldParser(agent.connection).getParsedAllUserDomainsFromTld(agent.wallet_address, tld);
        return domains.map((domain) => domain.domain);
    }
    catch (error) {
        throw new Error(`Failed to fetch domains for TLD: ${error.message}`);
    }
}
//# sourceMappingURL=get_owned_domains_for_tld.js.map