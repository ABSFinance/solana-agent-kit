import { PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "../../agent";
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
export declare function getPrimaryDomain(agent: SolanaAgentKit, account: PublicKey): Promise<string>;
//# sourceMappingURL=get_primary_domain.d.ts.map