"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orcaClosePosition = orcaClosePosition;
const web3_js_1 = require("@solana/web3.js");
const keypair_1 = require("../../utils/keypair");
const whirlpools_sdk_1 = require("@orca-so/whirlpools-sdk");
const send_tx_1 = require("../../utils/send_tx");
const common_sdk_1 = require("@orca-so/common-sdk");
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
async function orcaClosePosition(agent, positionMintAddress) {
    try {
        const wallet = new keypair_1.Wallet(agent.wallet);
        const ctx = whirlpools_sdk_1.WhirlpoolContext.from(agent.connection, wallet, whirlpools_sdk_1.ORCA_WHIRLPOOL_PROGRAM_ID);
        const client = (0, whirlpools_sdk_1.buildWhirlpoolClient)(ctx);
        const positionAddress = whirlpools_sdk_1.PDAUtil.getPosition(whirlpools_sdk_1.ORCA_WHIRLPOOL_PROGRAM_ID, positionMintAddress);
        const position = await client.getPosition(positionAddress.publicKey);
        const whirlpoolAddress = position.getData().whirlpool;
        const whirlpool = await client.getPool(whirlpoolAddress);
        const txBuilder = await whirlpool.closePosition(positionAddress.publicKey, common_sdk_1.Percentage.fromFraction(1, 100));
        const txPayload = await txBuilder[0].build();
        const txPayloadDecompiled = web3_js_1.TransactionMessage.decompile(txPayload.transaction.message);
        const instructions = txPayloadDecompiled.instructions;
        const signers = txPayload.signers;
        const txId = await (0, send_tx_1.sendTx)(agent, instructions, signers);
        return txId;
    }
    catch (error) {
        throw new Error(`${error}`);
    }
}
//# sourceMappingURL=orca_close_position.js.map