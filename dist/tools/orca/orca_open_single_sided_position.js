"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orcaOpenSingleSidedPosition = orcaOpenSingleSidedPosition;
const web3_js_1 = require("@solana/web3.js");
const keypair_1 = require("../../utils/keypair");
const whirlpools_sdk_1 = require("@orca-so/whirlpools-sdk");
const send_tx_1 = require("../../utils/send_tx");
const common_sdk_1 = require("@orca-so/common-sdk");
const spl_token_1 = require("@solana/spl-token");
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
async function orcaOpenSingleSidedPosition(agent, whirlpoolAddress, distanceFromCurrentPriceBps, widthBps, inputTokenMint, inputAmount) {
    try {
        const wallet = new keypair_1.Wallet(agent.wallet);
        const ctx = whirlpools_sdk_1.WhirlpoolContext.from(agent.connection, wallet, whirlpools_sdk_1.ORCA_WHIRLPOOL_PROGRAM_ID);
        const client = (0, whirlpools_sdk_1.buildWhirlpoolClient)(ctx);
        const whirlpool = await client.getPool(whirlpoolAddress);
        const whirlpoolData = whirlpool.getData();
        const mintInfoA = whirlpool.getTokenAInfo();
        const mintInfoB = whirlpool.getTokenBInfo();
        const price = whirlpools_sdk_1.PriceMath.sqrtPriceX64ToPrice(whirlpoolData.sqrtPrice, mintInfoA.decimals, mintInfoB.decimals);
        const isTokenA = inputTokenMint.equals(mintInfoA.mint);
        let lowerBoundPrice;
        let upperBoundPrice;
        let lowerTick;
        let upperTick;
        if (isTokenA) {
            lowerBoundPrice = price.mul(1 + distanceFromCurrentPriceBps / 10000);
            upperBoundPrice = lowerBoundPrice.mul(1 + widthBps / 10000);
            upperTick = whirlpools_sdk_1.PriceMath.priceToInitializableTickIndex(upperBoundPrice, mintInfoA.decimals, mintInfoB.decimals, whirlpoolData.tickSpacing);
            lowerTick = whirlpools_sdk_1.PriceMath.priceToInitializableTickIndex(lowerBoundPrice, mintInfoA.decimals, mintInfoB.decimals, whirlpoolData.tickSpacing);
        }
        else {
            lowerBoundPrice = price.mul(1 - distanceFromCurrentPriceBps / 10000);
            upperBoundPrice = lowerBoundPrice.mul(1 - widthBps / 10000);
            lowerTick = whirlpools_sdk_1.PriceMath.priceToInitializableTickIndex(upperBoundPrice, mintInfoA.decimals, mintInfoB.decimals, whirlpoolData.tickSpacing);
            upperTick = whirlpools_sdk_1.PriceMath.priceToInitializableTickIndex(lowerBoundPrice, mintInfoA.decimals, mintInfoB.decimals, whirlpoolData.tickSpacing);
        }
        const txBuilderTickArrays = await whirlpool.initTickArrayForTicks([
            lowerTick,
            upperTick,
        ]);
        let instructions = [];
        let signers = [];
        if (txBuilderTickArrays !== null) {
            const txPayloadTickArrays = await txBuilderTickArrays.build();
            const txPayloadTickArraysDecompiled = web3_js_1.TransactionMessage.decompile(txPayloadTickArrays.transaction.message);
            instructions = instructions.concat(txPayloadTickArraysDecompiled.instructions);
            signers = signers.concat(txPayloadTickArrays.signers);
        }
        const tokenExtensionCtx = {
            ...whirlpools_sdk_1.NO_TOKEN_EXTENSION_CONTEXT,
            tokenMintWithProgramA: mintInfoA,
            tokenMintWithProgramB: mintInfoB,
        };
        const increaseLiquiditQuote = (0, whirlpools_sdk_1.increaseLiquidityQuoteByInputToken)(inputTokenMint, inputAmount, lowerTick, upperTick, common_sdk_1.Percentage.fromFraction(1, 100), whirlpool, tokenExtensionCtx);
        const { positionMint, tx: txBuilder } = await whirlpool.openPositionWithMetadata(lowerTick, upperTick, increaseLiquiditQuote, undefined, undefined, undefined, spl_token_1.TOKEN_2022_PROGRAM_ID);
        const txPayload = await txBuilder.build();
        const txPayloadDecompiled = web3_js_1.TransactionMessage.decompile(txPayload.transaction.message);
        instructions = instructions.concat(txPayloadDecompiled.instructions);
        signers = signers.concat(txPayload.signers);
        const txId = await (0, send_tx_1.sendTx)(agent, instructions, signers);
        return JSON.stringify({
            transactionIds: txId,
            positionMint: positionMint.toString(),
        });
    }
    catch (error) {
        throw new Error(`${error}`);
    }
}
//# sourceMappingURL=orca_open_single_sided_position.js.map