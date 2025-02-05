import { SolanaAgentKit } from "../../index";
import { PublicKey } from "@solana/web3.js";
/**
 * Deploy a new SPL token
 * @param agent SolanaAgentKit instance
 * @param name Name of the token
 * @param uri URI for the token metadata
 * @param symbol Symbol of the token
 * @param decimals Number of decimals for the token (default: 9)
 * @param initialSupply Initial supply to mint (optional)
 * @returns Object containing token mint address and initial account (if supply was minted)
 */
export declare function deploy_token(agent: SolanaAgentKit, name: string, uri: string, symbol: string, decimals?: number, initialSupply?: number): Promise<{
    mint: PublicKey;
}>;
//# sourceMappingURL=deploy_token.d.ts.map