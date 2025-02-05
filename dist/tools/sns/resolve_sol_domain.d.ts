import { PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "../../index";
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
export declare function resolveSolDomain(agent: SolanaAgentKit, domain: string): Promise<PublicKey>;
//# sourceMappingURL=resolve_sol_domain.d.ts.map