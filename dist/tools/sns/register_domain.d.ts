import { SolanaAgentKit } from "../../agent";
/**
 * Register a .sol domain name using Bonfida Name Service
 * @param agent SolanaAgentKit instance
 * @param name Domain name to register (without .sol)
 * @param spaceKB Space allocation in KB (max 10KB)
 * @returns Transaction signature
 */
export declare function registerDomain(agent: SolanaAgentKit, name: string, spaceKB?: number): Promise<string>;
//# sourceMappingURL=register_domain.d.ts.map