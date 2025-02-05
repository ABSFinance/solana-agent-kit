"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDomainsTLDs = getAllDomainsTLDs;
const tldparser_1 = require("@onsol/tldparser");
/**
 * Get all active top-level domains (TLDs) in the AllDomains Name Service
 * @param agent SolanaAgentKit instance
 * @returns Array of active TLD strings
 */
async function getAllDomainsTLDs(agent) {
    try {
        const tlds = await (0, tldparser_1.getAllTld)(agent.connection);
        return tlds.map((tld) => String(tld.tld));
    }
    catch (error) {
        throw new Error(`Failed to fetch TLDs: ${error.message}`);
    }
}
//# sourceMappingURL=get_all_domains_tlds.js.map