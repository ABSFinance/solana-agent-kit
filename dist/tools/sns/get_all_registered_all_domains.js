"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRegisteredAllDomains = getAllRegisteredAllDomains;
const spl_name_service_1 = require("@bonfida/spl-name-service");
const web3_js_1 = require("@solana/web3.js");
const get_all_domains_tlds_1 = require("../alldomains/get_all_domains_tlds");
/**
 * Get all registered domains across all TLDs
 * @param agent SolanaAgentKit instance
 * @returns Array of all registered domain names with their TLDs
 */
async function getAllRegisteredAllDomains(agent) {
    try {
        // First get all TLDs
        const tlds = await (0, get_all_domains_tlds_1.getAllDomainsTLDs)(agent);
        const allDomains = [];
        // For each TLD, fetch all registered domains
        for (const tld of tlds) {
            const domains = await (0, spl_name_service_1.getAllDomains)(agent.connection, new web3_js_1.PublicKey("namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX"));
            // Add domains with TLD suffix
            domains.forEach((domain) => {
                allDomains.push(`${domain}.${tld}`);
            });
        }
        return allDomains;
    }
    catch (error) {
        throw new Error(`Failed to fetch all registered domains: ${error.message}`);
    }
}
//# sourceMappingURL=get_all_registered_all_domains.js.map