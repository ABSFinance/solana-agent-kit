"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openbookCreateMarket = openbookCreateMarket;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const spl_token_1 = require("@solana/spl-token");
async function openbookCreateMarket(agent, baseMint, quoteMint, lotSize = 1, tickSize = 0.01) {
    const raydium = await raydium_sdk_v2_1.Raydium.load({
        owner: agent.wallet,
        connection: agent.connection,
    });
    const baseMintInfo = await agent.connection.getAccountInfo(baseMint);
    const quoteMintInfo = await agent.connection.getAccountInfo(quoteMint);
    if (baseMintInfo?.owner.toString() !== spl_token_1.TOKEN_PROGRAM_ID.toBase58() ||
        quoteMintInfo?.owner.toString() !== spl_token_1.TOKEN_PROGRAM_ID.toBase58()) {
        throw new Error("openbook market only support TOKEN_PROGRAM_ID mints, if you want to create pool with token-2022, please create raydium cpmm pool instead");
    }
    const { execute } = await raydium.marketV2.create({
        baseInfo: {
            mint: baseMint,
            decimals: spl_token_1.MintLayout.decode(baseMintInfo.data).decimals,
        },
        quoteInfo: {
            mint: quoteMint,
            decimals: spl_token_1.MintLayout.decode(quoteMintInfo.data).decimals,
        },
        lotSize,
        tickSize,
        dexProgramId: raydium_sdk_v2_1.OPEN_BOOK_PROGRAM,
        txVersion: raydium_sdk_v2_1.TxVersion.V0,
    });
    const { txIds } = await execute({ sequentially: true });
    return txIds;
}
//# sourceMappingURL=openbook_create_market.js.map