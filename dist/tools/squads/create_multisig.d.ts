import { PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "../../index";
/**
 * Creates a new Squads multisig account.
 *
 * @param agent - The SolanaAgentKit instance containing the connection and wallet information.
 * @param creator - The public key of the creator who will be a member of the multisig.
 * @returns A promise that resolves to the transaction ID of the multisig creation transaction.
 *
 * @throws Will throw an error if the transaction fails.
 */
export declare function create_squads_multisig(agent: SolanaAgentKit, creator: PublicKey): Promise<string>;
//# sourceMappingURL=create_multisig.d.ts.map