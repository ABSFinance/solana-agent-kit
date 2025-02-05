import { SolanaAgentKit } from "../../agent";
import { PublicKey } from "@solana/web3.js";
/**
 * Resolve all domains for a given agent and domain
 * @param agent SolanaAgentKit instance
 * @param domain Domain name to resolve
 * @returns Promise resolving to the domain or undefined if not found
 */
export declare function resolveAllDomains(agent: SolanaAgentKit, domain: string): Promise<PublicKey | undefined>;
//# sourceMappingURL=resolve_domain.d.ts.map