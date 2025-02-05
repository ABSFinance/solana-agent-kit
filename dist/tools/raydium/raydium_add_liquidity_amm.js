"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.raydiumAddLiquidityAmm = raydiumAddLiquidityAmm;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const decimal_js_1 = __importDefault(require("decimal.js"));
const VALID_PROGRAM_ID = new Set([raydium_sdk_v2_1.AMM_V4.toBase58(), raydium_sdk_v2_1.AMM_STABLE.toBase58()]);
async function raydiumAddLiquidityAmm(agent, poolId, inputAmount) {
    const raydium = await raydium_sdk_v2_1.Raydium.load({
        owner: agent.wallet,
        connection: agent.connection,
    });
    const data = await raydium.api.fetchPoolById({ ids: poolId });
    const poolInfo = data[0];
    if (!VALID_PROGRAM_ID.has(poolInfo.programId))
        throw new Error("target pool is not AMM pool");
    const r = raydium.liquidity.computePairAmount({
        poolInfo,
        amount: inputAmount,
        baseIn: true,
        slippage: new raydium_sdk_v2_1.Percent(1, 100), // 1%
    });
    const { execute } = await raydium.liquidity.addLiquidity({
        poolInfo,
        amountInA: new raydium_sdk_v2_1.TokenAmount((0, raydium_sdk_v2_1.toToken)(poolInfo.mintA), new decimal_js_1.default(inputAmount).mul(10 ** poolInfo.mintA.decimals).toFixed(0)),
        amountInB: new raydium_sdk_v2_1.TokenAmount((0, raydium_sdk_v2_1.toToken)(poolInfo.mintB), new decimal_js_1.default(r.maxAnotherAmount.toExact())
            .mul(10 ** poolInfo.mintB.decimals)
            .toFixed(0)),
        otherAmountMin: r.minAnotherAmount,
        fixedSide: "a",
        txVersion: raydium_sdk_v2_1.TxVersion.V0,
        // optional: set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 46591500,
        // },
    });
    const { txId } = await execute({ sendAndConfirm: true });
    return txId;
}
//# sourceMappingURL=raydium_add_liquidity_amm.js.map