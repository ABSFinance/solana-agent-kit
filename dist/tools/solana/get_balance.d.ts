import { PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "../../index";
/**
 * Get the balance of SOL or an SPL token for the agent's wallet
 * @param agent - SolanaAgentKit instance
 * @param token_address - Optional SPL token mint address. If not provided, returns SOL balance
 * @returns Promise resolving to the balance as a number (in UI units) or null if account doesn't exist
 */
export declare function get_balance(agent: SolanaAgentKit, token_address?: PublicKey): Promise<number>;
//# sourceMappingURL=get_balance.d.ts.map