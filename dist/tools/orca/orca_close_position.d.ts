import { PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "../../agent";
/**
 * # Closes a Liquidity Position in an Orca Whirlpool
 *
 * This function closes an existing liquidity position in a specified Orca Whirlpool. The user provides
 * the position's mint address.
 *
 * ## Parameters
 * - `agent`: The `SolanaAgentKit` instance representing the wallet and connection details.
 * - `positionMintAddress`: The mint address of the liquidity position to close.
 *
 * ## Returns
 * A `Promise` that resolves to a `string` containing the transaction ID of the transaction
 *
 * ## Notes
 * - The function uses Orca’s SDK to interact with the specified Whirlpool and close the liquidity position.
 * - A maximum slippage of 1% is assumed for liquidity provision during the position closing.
 * - The function automatically fetches the associated Whirlpool address and position details using the provided mint address.
 *
 * ## Throws
 * An error will be thrown if:
 * - The specified position mint address is invalid or inaccessible.
 * - The transaction fails to send.
 * - Any required position or Whirlpool data cannot be fetched.
 *
 * @param agent - The `SolanaAgentKit` instance representing the wallet and connection.
 * @param positionMintAddress - The mint address of the liquidity position to close.
 * @returns A promise resolving to the transaction ID (`string`).
 */
export declare function orcaClosePosition(agent: SolanaAgentKit, positionMintAddress: PublicKey): Promise<string>;
//# sourceMappingURL=orca_close_position.d.ts.map