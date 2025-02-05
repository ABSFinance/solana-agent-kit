import { PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "../../index";
/**
 * Get the balance of SOL or an SPL token for the specified wallet address (other than the agent's wallet)
 * @param agent - SolanaAgentKit instance
 * @param wallet_address - Public key of the wallet to check balance for
 * @param token_address - Optional SPL token mint address. If not provided, returns SOL balance
 * @returns Promise resolving to the balance as a number (in UI units) or 0 if account doesn't exist
 */
export declare function get_balance_other(agent: SolanaAgentKit, wallet_address: PublicKey, token_address?: PublicKey): Promise<number>;
//# sourceMappingURL=get_balance_other.d.ts.map