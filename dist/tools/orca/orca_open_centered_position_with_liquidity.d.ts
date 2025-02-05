import { PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "../../agent";
import { Decimal } from "decimal.js";
/**
 * # Opens a Centered Liquidity Position in an Orca Whirlpool
 *
 * This function opens a centered liquidity position in a specified Orca Whirlpool. The user defines
 * a basis point (bps) offset from the current price of the pool to set the lower and upper bounds of the position.
 * The user also specifies the token mint and the amount to deposit. The required amount of the other token
 * is calculated automatically.
 *
 * ## Parameters
 * - `agent`: The `SolanaAgentKit` instance representing the wallet and connection details.
 * - `whirlpoolAddress`: The address of the Orca Whirlpool where the position will be opened.
 * - `priceOffsetBps`: The basis point (bps) offset (on one side) from the current price fo the pool. For example,
 *   500 bps (5%) creates a range from 95% to 105% of the current pool price.
 * - `inputTokenMint`: The mint address of the token being deposited (e.g., USDC or another token).
 * - `inputAmount`: The amount of the input token to deposit, specified as a `Decimal` value.
 *
 * ## Returns
 * A `Promise` that resolves to the transaction ID (`string`) of the transaction that opens the position.
 *
 * ## Notes
 * - The `priceOffsetBps` specifies the range symmetrically around the current price.
 * - The specified `inputTokenMint` determines which token is deposited directly. The function calculates
 *   the required amount of the other token based on the specified price range.
 * - This function supports Orca's token extensions for managing tokens with special behaviors.
 * - The function assumes a maximum slippage of 1% for liquidity provision.
 *
 * ## Throws
 * An error will be thrown if:
 * - The specified Whirlpool address is invalid or inaccessible.
 * - The transaction fails to send.
 * - Any required mint information cannot be fetched.
 *
 * @param agent - The `SolanaAgentKit` instance representing the wallet and connection.
 * @param whirlpoolAddress - The address of the Orca Whirlpool.
 * @param priceOffsetBps - The basis point offset (one side) from the current pool price.
 * @param inputTokenMint - The mint address of the token to deposit.
 * @param inputAmount - The amount of the input token to deposit.
 * @returns A promise resolving to the transaction ID (`string`).
 */
export declare function orcaOpenCenteredPositionWithLiquidity(agent: SolanaAgentKit, whirlpoolAddress: PublicKey, priceOffsetBps: number, inputTokenMint: PublicKey, inputAmount: Decimal): Promise<string>;
//# sourceMappingURL=orca_open_centered_position_with_liquidity.d.ts.map