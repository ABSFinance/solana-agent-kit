"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSolDomain = resolveSolDomain;
const spl_name_service_1 = require("@bonfida/spl-name-service");
/**
 * Resolves a .sol domain to a Solana PublicKey.
 *
 * This function uses the Bonfida SPL Name Service to resolve a given .sol domain
 * to the corresponding Solana PublicKey. The domain can be provided with or without
 * the .sol suffix.
 *
 * @param agent SolanaAgentKit instance
 * @param domain The .sol domain to resolve. This can be provided with or without the .sol TLD suffix
 * @returns A promise that resolves to the corresponding Solana PublicKey
 * @throws Error if the domain resolution fails
 */
async function resolveSolDomain(agent, domain) {
    if (!domain || typeof domain !== "string") {
        throw new Error("Invalid domain. Expected a non-empty string.");
    }
    try {
        return await (0, spl_name_service_1.resolve)(agent.connection, domain);
    }
    catch (error) {
        console.error(error);
        throw new Error(`Failed to resolve domain: ${domain}`);
    }
}
//# sourceMappingURL=resolve_sol_domain.js.map