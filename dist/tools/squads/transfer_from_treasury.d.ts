import { SolanaAgentKit } from "../../index";
import { PublicKey } from "@solana/web3.js";
/**
 * Transfer SOL or SPL tokens to a recipient from a multisig vault.
 * @param agent - SolanaAgentKit instance.
 * @param amount - Amount to transfer.
 * @param to - Recipient's public key.
 * @param vaultIndex - Optional vault index, default is 0.
 * @param mint - Optional mint address for SPL tokens.
 * @returns Transaction signature.
 */
export declare function multisig_transfer_from_treasury(agent: SolanaAgentKit, amount: number, to: PublicKey, vaultIndex?: number, mint?: PublicKey): Promise<string>;
//# sourceMappingURL=transfer_from_treasury.d.ts.map