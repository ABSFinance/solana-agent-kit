"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orcaFetchPositions = orcaFetchPositions;
const anchor_1 = require("@coral-xyz/anchor");
const whirlpools_sdk_1 = require("@orca-so/whirlpools-sdk");
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
async function orcaFetchPositions(agent) {
    try {
        const wallet = new anchor_1.Wallet(agent.wallet);
        const ctx = whirlpools_sdk_1.WhirlpoolContext.from(agent.connection, wallet, whirlpools_sdk_1.ORCA_WHIRLPOOL_PROGRAM_ID);
        const client = (0, whirlpools_sdk_1.buildWhirlpoolClient)(ctx);
        const positions = await (0, whirlpools_sdk_1.getAllPositionAccountsByOwner)({
            ctx,
            owner: agent.wallet.publicKey,
        });
        const positionDatas = [
            ...positions.positions.entries(),
            ...positions.positionsWithTokenExtensions.entries(),
        ];
        const result = {};
        for (const [, positionData] of positionDatas) {
            const positionMintAddress = positionData.positionMint;
            const whirlpoolAddress = positionData.whirlpool;
            const whirlpool = await client.getPool(whirlpoolAddress);
            const whirlpoolData = whirlpool.getData();
            const sqrtPrice = whirlpoolData.sqrtPrice;
            const currentTick = whirlpoolData.tickCurrentIndex;
            const mintA = whirlpool.getTokenAInfo();
            const mintB = whirlpool.getTokenBInfo();
            const currentPrice = whirlpools_sdk_1.PriceMath.sqrtPriceX64ToPrice(sqrtPrice, mintA.decimals, mintB.decimals);
            const lowerTick = positionData.tickLowerIndex;
            const upperTick = positionData.tickUpperIndex;
            const lowerPrice = whirlpools_sdk_1.PriceMath.tickIndexToPrice(lowerTick, mintA.decimals, mintB.decimals);
            const upperPrice = whirlpools_sdk_1.PriceMath.tickIndexToPrice(upperTick, mintA.decimals, mintB.decimals);
            const centerPosition = lowerPrice.add(upperPrice).div(2);
            const positionInRange = currentTick > lowerTick && currentTick < upperTick ? true : false;
            const distanceFromCenterBps = Math.ceil(currentPrice
                .sub(centerPosition)
                .abs()
                .div(centerPosition)
                .mul(10000)
                .toNumber());
            result[positionMintAddress.toString()] = {
                whirlpoolAddress: whirlpoolAddress.toString(),
                positionInRange,
                distanceFromCenterBps,
            };
        }
        return JSON.stringify(result);
    }
    catch (error) {
        throw new Error(`${error}`);
    }
}
//# sourceMappingURL=orca_fetch_positions.js.map