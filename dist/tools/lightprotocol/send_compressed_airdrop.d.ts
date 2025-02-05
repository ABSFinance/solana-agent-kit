import { PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "../../index";
/**
 * Estimate the cost of an airdrop in lamports.
 * @param numberOfRecipients      Number of recipients
 * @param priorityFeeInLamports   Priority fee in lamports
 * @returns                       Estimated cost in lamports
 */
export declare const getAirdropCostEstimate: (numberOfRecipients: number, priorityFeeInLamports: number) => number;
/**
 * Send airdrop with ZK Compressed Tokens.
 * @param agent             Agent
 * @param mintAddress       SPL Mint address
 * @param amount            Amount to send per recipient
 * @param decimals          Decimals of the token
 * @param recipients        Recipient wallet addresses (no ATAs)
 * @param priorityFeeInLamports   Priority fee in lamports
 * @param shouldLog         Whether to log progress to stdout. Defaults to false.
 */
export declare function sendCompressedAirdrop(agent: SolanaAgentKit, mintAddress: PublicKey, amount: number, decimals: number, recipients: PublicKey[], priorityFeeInLamports: number, shouldLog?: boolean): Promise<string[]>;
//# sourceMappingURL=send_compressed_airdrop.d.ts.map