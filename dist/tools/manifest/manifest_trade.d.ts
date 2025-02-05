import { PublicKey } from "@solana/web3.js";
import { BatchOrderPattern, OrderParams, SolanaAgentKit } from "../../index";
export declare function manifestCreateMarket(agent: SolanaAgentKit, baseMint: PublicKey, quoteMint: PublicKey): Promise<string[]>;
/**
 * Place limit orders using Manifest
 * @param agent SolanaAgentKit instance
 * @param marketId Public key for the manifest market
 * @param quantity Amount to trade in tokens
 * @param side Buy or Sell
 * @param price Price in tokens ie. SOL/USDC
 * @returns Transaction signature
 */
export declare function limitOrder(agent: SolanaAgentKit, marketId: PublicKey, quantity: number, side: string, price: number): Promise<string>;
/**
 * Cancels all orders from Manifest
 * @param agent SolanaAgentKit instance
 * @param marketId Public key for the manifest market
 * @returns Transaction signature
 */
export declare function cancelAllOrders(agent: SolanaAgentKit, marketId: PublicKey): Promise<string>;
/**
 * Withdraws all funds from Manifest
 * @param agent SolanaAgentKit instance
 * @param marketId Public key for the manifest market
 * @returns Transaction signature
 */
export declare function withdrawAll(agent: SolanaAgentKit, marketId: PublicKey): Promise<string>;
/**
 * Generates an array of orders based on the specified pattern
 */
export declare function generateOrdersfromPattern(pattern: BatchOrderPattern): OrderParams[];
/**
 * Place batch orders using Manifest
 * @param agent SolanaAgentKit instance
 * @param marketId Public key for the manifest market
 * @param quantity Amount to trade in tokens
 * @param side Buy or Sell
 * @param price Price in tokens ie. SOL/USDC
 * @returns Transaction signature
 */
export declare function batchOrder(agent: SolanaAgentKit, marketId: PublicKey, orders: OrderParams[]): Promise<string>;
//# sourceMappingURL=manifest_trade.d.ts.map