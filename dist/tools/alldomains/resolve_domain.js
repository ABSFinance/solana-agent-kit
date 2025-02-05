"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAllDomains = resolveAllDomains;
const tldparser_1 = require("@onsol/tldparser");
/**
 * Resolve all domains for a given agent and domain
 * @param agent SolanaAgentKit instance
 * @param domain Domain name to resolve
 * @returns Promise resolving to the domain or undefined if not found
 */
async function resolveAllDomains(agent, domain) {
    try {
        const tld = await new tldparser_1.TldParser(agent.connection).getOwnerFromDomainTld(domain);
        return tld;
    }
    catch (error) {
        if (error.message.includes("Cannot read properties of undefined (reading 'owner')")) {
            return undefined;
        }
        throw new Error(`Domain resolution failed: ${error.message}`);
    }
}
//# sourceMappingURL=resolve_domain.js.map