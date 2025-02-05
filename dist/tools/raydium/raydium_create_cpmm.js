"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.raydiumCreateCpmm = raydiumCreateCpmm;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const spl_token_1 = require("@solana/spl-token");
async function raydiumCreateCpmm(agent, mintA, mintB, configId, mintAAmount, mintBAmount, startTime) {
    const raydium = await raydium_sdk_v2_1.Raydium.load({
        owner: agent.wallet,
        connection: agent.connection,
    });
    const [mintInfoA, mintInfoB] = await agent.connection.getMultipleAccountsInfo([mintA, mintB]);
    if (mintInfoA === null || mintInfoB === null) {
        throw Error("fetch mint info error");
    }
    const mintDecodeInfoA = spl_token_1.MintLayout.decode(mintInfoA.data);
    const mintDecodeInfoB = spl_token_1.MintLayout.decode(mintInfoB.data);
    const mintFormatInfoA = {
        chainId: 101,
        address: mintA.toString(),
        programId: mintInfoA.owner.toString(),
        logoURI: "",
        symbol: "",
        name: "",
        decimals: mintDecodeInfoA.decimals,
        tags: [],
        extensions: {},
    };
    const mintFormatInfoB = {
        chainId: 101,
        address: mintB.toString(),
        programId: mintInfoB.owner.toString(),
        logoURI: "",
        symbol: "",
        name: "",
        decimals: mintDecodeInfoB.decimals,
        tags: [],
        extensions: {},
    };
    const { execute } = await raydium.cpmm.createPool({
        programId: raydium_sdk_v2_1.CREATE_CPMM_POOL_PROGRAM,
        poolFeeAccount: raydium_sdk_v2_1.CREATE_CPMM_POOL_FEE_ACC,
        mintA: mintFormatInfoA,
        mintB: mintFormatInfoB,
        mintAAmount,
        mintBAmount,
        startTime,
        //@ts-expect-error sdk bug
        feeConfig: { id: configId.toString() },
        associatedOnly: false,
        ownerInfo: {
            useSOLBalance: true,
        },
        txVersion: raydium_sdk_v2_1.TxVersion.V0,
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 46591500,
        // },
    });
    const { txId } = await execute({ sendAndConfirm: true });
    return txId;
}
//# sourceMappingURL=raydium_create_cpmm.js.map