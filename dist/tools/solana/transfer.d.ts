import { SolanaAgentKit } from "../../index";
import { PublicKey } from "@solana/web3.js";
/**
 * Transfer SOL or SPL tokens to a recipient
 * @param agent SolanaAgentKit instance
 * @param to Recipient's public key
 * @param amount Amount to transfer
 * @param mint Optional mint address for SPL tokens
 * @returns Transaction signature
 */
export declare function transfer(agent: SolanaAgentKit, to: PublicKey, amount: number, mint?: PublicKey): Promise<string>;
//# sourceMappingURL=transfer.d.ts.map