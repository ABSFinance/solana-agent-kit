import { SolanaAgentKit } from "../../index";
import { PublicKey } from "@solana/web3.js";
/**
 * Transfer SOL or SPL tokens to a multisig vault.
 * @param agent SolanaAgentKit instance
 * @param amount Amount to transfer
 * @param vaultIndex Optional vault index, default is 0
 * @param mint Optional mint address for SPL tokens
 * @returns Transaction signature
 */
export declare function multisig_deposit_to_treasury(agent: SolanaAgentKit, amount: number, vaultIndex?: number, mint?: PublicKey): Promise<string>;
//# sourceMappingURL=deposit_to_treasury.d.ts.map