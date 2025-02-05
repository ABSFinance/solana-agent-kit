import { SolanaAgentKit } from "../../agent";
/**
 * # Fetches Liquidity Position Data in Orca Whirlpools
 *
 * Fetches data for all liquidity positions owned by the provided wallet, including:
 * - Whirlpool address.
 * - Whether the position is in range.
 * - Distance from the center price to the current price in basis points.
 *
 * ## Parameters
 * - `agent`: The `SolanaAgentKit` instance representing the wallet and connection.
 *
 * ## Returns
 * A JSON string with an object mapping position mint addresses to position details:
 * ```json
 * {
 *   "positionMintAddress1": {
 *     "whirlpoolAddress": "whirlpoolAddress1",
 *     "positionInRange": true,
 *     "distanceFromCenterBps": 250
 *   }
 * }
 * ```
 *
 * ## Throws
 * - If positions cannot be fetched or processed.
 * - If the position mint address is invalid.
 *
 * @param agent - The `SolanaAgentKit` instance.
 * @returns A JSON string with position data.
 */
export declare function orcaFetchPositions(agent: SolanaAgentKit): Promise<string>;
//# sourceMappingURL=orca_fetch_positions.d.ts.map