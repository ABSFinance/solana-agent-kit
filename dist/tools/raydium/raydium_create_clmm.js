"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.raydiumCreateClmm = raydiumCreateClmm;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const spl_token_1 = require("@solana/spl-token");
async function raydiumCreateClmm(agent, mint1, mint2, configId, initialPrice, startTime) {
    const raydium = await raydium_sdk_v2_1.Raydium.load({
        owner: agent.wallet,
        connection: agent.connection,
    });
    const [mintInfo1, mintInfo2] = await agent.connection.getMultipleAccountsInfo([mint1, mint2]);
    if (mintInfo1 === null || mintInfo2 === null) {
        throw Error("fetch mint info error");
    }
    const mintDecodeInfo1 = spl_token_1.MintLayout.decode(mintInfo1.data);
    const mintDecodeInfo2 = spl_token_1.MintLayout.decode(mintInfo2.data);
    const mintFormatInfo1 = {
        chainId: 101,
        address: mint1.toString(),
        programId: mintInfo1.owner.toString(),
        logoURI: "",
        symbol: "",
        name: "",
        decimals: mintDecodeInfo1.decimals,
        tags: [],
        extensions: {},
    };
    const mintFormatInfo2 = {
        chainId: 101,
        address: mint2.toString(),
        programId: mintInfo2.owner.toString(),
        logoURI: "",
        symbol: "",
        name: "",
        decimals: mintDecodeInfo2.decimals,
        tags: [],
        extensions: {},
    };
    const { execute } = await raydium.clmm.createPool({
        programId: raydium_sdk_v2_1.CLMM_PROGRAM_ID,
        // programId: DEVNET_PROGRAM_ID.CLMM,
        mint1: mintFormatInfo1,
        mint2: mintFormatInfo2,
        // @ts-expect-error sdk bug
        ammConfig: { id: configId },
        initialPrice,
        startTime,
        txVersion: raydium_sdk_v2_1.TxVersion.V0,
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 46591500,
        // },
    });
    const { txId } = await execute({ sendAndConfirm: true });
    return txId;
}
//# sourceMappingURL=raydium_create_clmm.js.map