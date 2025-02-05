import { SolanaAgentKit } from "../../agent";
import { PublicKey } from "@solana/web3.js";
/**
 * Gets the value of assets in a Voltr vault
 * @param agent SolanaAgentKit instance
 * @param vault Public key of the target vault
 * @returns Position and total values for the vault
 */
export declare function voltrGetPositionValues(agent: SolanaAgentKit, vault: PublicKey): Promise<string>;
//# sourceMappingURL=voltr_get_position_values.d.ts.map