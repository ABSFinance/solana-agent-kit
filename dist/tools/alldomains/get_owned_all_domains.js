"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnedAllDomains = getOwnedAllDomains;
const tldparser_1 = require("@onsol/tldparser");
/**
 * Get all domains owned domains for a specific TLD for the agent's wallet
 * @param agent SolanaAgentKit instance
 * @param owner - PublicKey of the owner
 * @returns Promise resolving to an array of owned domains or an empty array if none are found
 */
async function getOwnedAllDomains(agent, owner) {
    try {
        const domains = await new tldparser_1.TldParser(agent.connection).getParsedAllUserDomains(owner);
        return domains.map((domain) => domain.domain);
    }
    catch (error) {
        throw new Error(`Failed to fetch owned domains: ${error.message}`);
    }
}
//# sourceMappingURL=get_owned_all_domains.js.map