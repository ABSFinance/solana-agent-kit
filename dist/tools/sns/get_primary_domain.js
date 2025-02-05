"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrimaryDomain = getPrimaryDomain;
const spl_name_service_1 = require("@bonfida/spl-name-service");
/**
 * Retrieves the primary .sol domain associated with a given Solana public key.
 *
 * This function queries the Bonfida SPL Name Service to get the primary .sol domain for
 * a specified Solana public key. If the primary domain is stale or an error occurs during
 * the resolution, it throws an error.
 *
 * @param agent SolanaAgentKit instance
 * @param account The Solana public key for which to retrieve the primary domain
 * @returns A promise that resolves to the primary .sol domain as a string
 * @throws Error if the domain is stale or if the domain resolution fails
 */
async function getPrimaryDomain(agent, account) {
    try {
        const { reverse, stale } = await (0, spl_name_service_1.getPrimaryDomain)(agent.connection, account);
        if (stale) {
            throw new Error(`Primary domain is stale for account: ${account.toBase58()}`);
        }
        return reverse;
    }
    catch (error) {
        console.error(error);
        throw new Error(`Failed to get primary domain for account: ${account.toBase58()}`);
    }
}
//# sourceMappingURL=get_primary_domain.js.map