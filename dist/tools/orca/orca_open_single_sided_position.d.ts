import { PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "../../agent";
import { Decimal } from "decimal.js";
/**
 * # Opens a Single-Sided Liquidity Position in an Orca Whirlpool
 *
 * This function opens a single-sided liquidity position in a specified Orca Whirlpool. The user specifies
 * a basis point (bps) offset from the current price for the lower bound and a width (bps) for the range width.
 * The required amount of the other token is calculated automatically.
 *
 * ## Parameters
 * - `agent`: The `SolanaAgentKit` instance representing the wallet and connection details.
 * - `whirlpoolAddress`: The address of the Orca Whirlpool where the position will be opened.
 * - `distanceFromCurrentPriceBps`: The basis point offset from the current price for the lower bound.
 * - `widthBps`: The width of the range as a percentage increment from the lower bound.
 * - `inputTokenMint`: The mint address of the token being deposited (e.g., USDC or another token).
 * - `inputAmount`: The amount of the input token to deposit, specified as a `Decimal` value.
 *
 * ## Returns
 * A `Promise` that resolves to the transaction ID (`string`) of the transaction that opens the position.
 *
 * ## Notes
 * - The `distanceFromCurrentPriceBps` specifies the starting point of the range.
 * - The `widthBps` determines the range size from the lower bound.
 * - The specified `inputTokenMint` determines which token is deposited directly.
 *
 * @param agent - The `SolanaAgentKit` instance representing the wallet and connection.
 * @param whirlpoolAddress - The address of the Orca Whirlpool.
 * @param distanceFromCurrentPriceBps - The basis point offset from the current price for the lower bound.
 * @param widthBps - The width of the range as a percentage increment from the lower bound.
 * @param inputTokenMint - The mint address of the token to deposit.
 * @param inputAmount - The amount of the input token to deposit.
 * @returns A promise resolving to the transaction ID (`string`).
 */
export declare function orcaOpenSingleSidedPosition(agent: SolanaAgentKit, whirlpoolAddress: PublicKey, distanceFromCurrentPriceBps: number, widthBps: number, inputTokenMint: PublicKey, inputAmount: Decimal): Promise<string>;
//# sourceMappingURL=orca_open_single_sided_position.d.ts.map