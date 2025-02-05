import { SolanaAgentKit } from "../../agent";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
/**
 * Deposits assets into a Voltr strategy
 * @param agent SolanaAgentKit instance
 * @param depositAmount Amount to deposit in base units (BN)
 * @param vault Public key of the target vault
 * @param strategy Public key of the target strategy
 * @returns Transaction signature for the deposit
 */
export declare function voltrDepositStrategy(agent: SolanaAgentKit, depositAmount: BN, vault: PublicKey, strategy: PublicKey): Promise<string>;
//# sourceMappingURL=voltr_deposit_strategy.d.ts.map