"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMainAllDomainsDomain = getMainAllDomainsDomain;
const spl_name_service_1 = require("@bonfida/spl-name-service");
/**
 * Get the user's main/favorite domain for a SolanaAgentKit instance
 * @param agent SolanaAgentKit instance
 * @param owner Owner's public key
 * @returns Promise resolving to the main domain name or null if not found
 */
async function getMainAllDomainsDomain(agent, owner) {
    let mainDomain = null;
    try {
        mainDomain = await (0, spl_name_service_1.getFavoriteDomain)(agent.connection, owner);
        return mainDomain.stale ? null : mainDomain.reverse;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
//# sourceMappingURL=get_main_all_domains_domain.js.map