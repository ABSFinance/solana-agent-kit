import { SolanaAgentKit } from "../../agent";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
/**
 * Withdraws assets from a Voltr strategy
 * @param agent SolanaAgentKit instance
 * @param withdrawAmount Amount to withdraw in base units (BN)
 * @param vault Public key of the target vault
 * @param strategy Public key of the target strategy
 * @returns Transaction signature for the deposit
 */
export declare function voltrWithdrawStrategy(agent: SolanaAgentKit, withdrawAmount: BN, vault: PublicKey, strategy: PublicKey): Promise<string>;
//# sourceMappingURL=voltr_withdraw_strategy.d.ts.map