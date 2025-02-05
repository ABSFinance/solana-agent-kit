"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.raydiumCreateAmmV4 = raydiumCreateAmmV4;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
async function raydiumCreateAmmV4(agent, marketId, baseAmount, quoteAmount, startTime) {
    const raydium = await raydium_sdk_v2_1.Raydium.load({
        owner: agent.wallet,
        connection: agent.connection,
    });
    const marketBufferInfo = await agent.connection.getAccountInfo(new web3_js_1.PublicKey(marketId));
    const { baseMint, quoteMint } = raydium_sdk_v2_1.MARKET_STATE_LAYOUT_V3.decode(marketBufferInfo.data);
    const baseMintInfo = await agent.connection.getAccountInfo(baseMint);
    const quoteMintInfo = await agent.connection.getAccountInfo(quoteMint);
    if (baseMintInfo?.owner.toString() !== spl_token_1.TOKEN_PROGRAM_ID.toBase58() ||
        quoteMintInfo?.owner.toString() !== spl_token_1.TOKEN_PROGRAM_ID.toBase58()) {
        throw new Error("amm pools with openbook market only support TOKEN_PROGRAM_ID mints, if you want to create pool with token-2022, please create cpmm pool instead");
    }
    if (baseAmount
        .mul(quoteAmount)
        .lte(new bn_js_1.default(1)
        .mul(new bn_js_1.default(10 ** spl_token_1.MintLayout.decode(baseMintInfo.data).decimals))
        .pow(new bn_js_1.default(2)))) {
        throw new Error("initial liquidity too low, try adding more baseAmount/quoteAmount");
    }
    const { execute } = await raydium.liquidity.createPoolV4({
        programId: raydium_sdk_v2_1.AMM_V4,
        marketInfo: {
            marketId,
            programId: raydium_sdk_v2_1.OPEN_BOOK_PROGRAM,
        },
        baseMintInfo: {
            mint: baseMint,
            decimals: spl_token_1.MintLayout.decode(baseMintInfo.data).decimals,
        },
        quoteMintInfo: {
            mint: quoteMint,
            decimals: spl_token_1.MintLayout.decode(quoteMintInfo.data).decimals,
        },
        baseAmount,
        quoteAmount,
        startTime,
        ownerInfo: {
            useSOLBalance: true,
        },
        associatedOnly: false,
        txVersion: raydium_sdk_v2_1.TxVersion.V0,
        feeDestinationId: raydium_sdk_v2_1.FEE_DESTINATION_ID,
    });
    const { txId } = await execute({ sendAndConfirm: true });
    return txId;
}
//# sourceMappingURL=raydium_create_ammV4.js.map