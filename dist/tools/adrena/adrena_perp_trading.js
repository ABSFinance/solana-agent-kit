"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePerpTradeShort = closePerpTradeShort;
exports.closePerpTradeLong = closePerpTradeLong;
exports.openPerpTradeLong = openPerpTradeLong;
exports.openPerpTradeShort = openPerpTradeShort;
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("../../constants");
const spl_token_1 = require("@solana/spl-token");
const anchor_1 = require("@coral-xyz/anchor");
const AdrenaClient_1 = __importDefault(require("../../utils/AdrenaClient"));
const send_tx_1 = require("../../utils/send_tx");
const PRICE_DECIMALS = 10;
const ADRENA_PROGRAM_ID = new web3_js_1.PublicKey("13gDzEXCdocbj8iAiqrScGo47NiSuYENGsRqi3SEAwet");
// i.e percentage = -2 (for -2%)
// i.e percentage = 5 (for 5%)
function applySlippage(nb, percentage) {
    const negative = percentage < 0 ? true : false;
    // Do x10_000 so percentage can be up to 4 decimals
    const percentageBN = new anchor_1.BN((negative ? percentage * -1 : percentage) * 10000);
    const delta = nb.mul(percentageBN).divRound(new anchor_1.BN(10000 * 100));
    return negative ? nb.sub(delta) : nb.add(delta);
}
/**
 * Close short trade on Adrena
 * @returns Transaction signature
 */
async function closePerpTradeShort({ agent, price, tradeMint, }) {
    const client = await AdrenaClient_1.default.load(agent);
    const owner = agent.wallet.publicKey;
    const custody = client.getCustodyByMint(tradeMint);
    const collateralCustody = client.getCustodyByMint(constants_1.TOKENS.USDC);
    const stakingRewardTokenCustodyAccount = client.getCustodyByMint(AdrenaClient_1.default.stakingRewardTokenMint);
    const stakingRewardTokenCustodyTokenAccount = AdrenaClient_1.default.findCustodyTokenAccountAddress(AdrenaClient_1.default.stakingRewardTokenMint);
    const position = AdrenaClient_1.default.findPositionAddress(owner, custody.pubkey, "long");
    const userProfilePda = AdrenaClient_1.default.getUserProfilePda(owner);
    const userProfile = await client.program.account.userProfile.fetchNullable(userProfilePda);
    const receivingAccount = AdrenaClient_1.default.findATAAddressSync(owner, collateralCustody.mint);
    const preInstructions = [];
    const collateralCustodyOracle = collateralCustody.oracle;
    const collateralCustodyTokenAccount = AdrenaClient_1.default.findCustodyTokenAccountAddress(collateralCustody.mint);
    if (!(await AdrenaClient_1.default.isAccountInitialized(agent.connection, receivingAccount))) {
        preInstructions.push(AdrenaClient_1.default.createATAInstruction({
            ataAddress: receivingAccount,
            mint: collateralCustody.mint,
            owner,
        }));
    }
    const instruction = await client.program.methods
        .closePositionShort({
        price: new anchor_1.BN(price * 10 ** PRICE_DECIMALS),
    })
        .accountsStrict({
        owner,
        receivingAccount,
        transferAuthority: AdrenaClient_1.default.transferAuthority,
        pool: AdrenaClient_1.default.mainPool,
        position: position,
        custody: custody.pubkey,
        custodyTradeOracle: custody.tradeOracle,
        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        lmStaking: AdrenaClient_1.default.lmStaking,
        lpStaking: AdrenaClient_1.default.lpStaking,
        cortex: AdrenaClient_1.default.cortex,
        stakingRewardTokenCustody: stakingRewardTokenCustodyAccount.pubkey,
        stakingRewardTokenCustodyOracle: stakingRewardTokenCustodyAccount.oracle,
        stakingRewardTokenCustodyTokenAccount,
        lmStakingRewardTokenVault: AdrenaClient_1.default.lmStakingRewardTokenVault,
        lpStakingRewardTokenVault: AdrenaClient_1.default.lpStakingRewardTokenVault,
        lpTokenMint: AdrenaClient_1.default.lpTokenMint,
        protocolFeeRecipient: client.cortex.protocolFeeRecipient,
        adrenaProgram: AdrenaClient_1.default.programId,
        userProfile: userProfile ? userProfilePda : null,
        caller: owner,
        collateralCustody: collateralCustody.pubkey,
        collateralCustodyOracle,
        collateralCustodyTokenAccount,
    })
        .instruction();
    return (0, send_tx_1.sendTx)(agent, [...preInstructions, instruction]);
}
/**
 * Close long trade on Adrena
 * @returns Transaction signature
 */
async function closePerpTradeLong({ agent, price, tradeMint, }) {
    const client = await AdrenaClient_1.default.load(agent);
    const owner = agent.wallet.publicKey;
    const custody = client.getCustodyByMint(tradeMint);
    const custodyTokenAccount = AdrenaClient_1.default.findCustodyTokenAccountAddress(tradeMint);
    const stakingRewardTokenCustodyAccount = client.getCustodyByMint(AdrenaClient_1.default.stakingRewardTokenMint);
    const stakingRewardTokenCustodyTokenAccount = AdrenaClient_1.default.findCustodyTokenAccountAddress(AdrenaClient_1.default.stakingRewardTokenMint);
    const position = AdrenaClient_1.default.findPositionAddress(owner, custody.pubkey, "long");
    const userProfilePda = AdrenaClient_1.default.getUserProfilePda(owner);
    const userProfile = await client.program.account.userProfile.fetchNullable(userProfilePda);
    const receivingAccount = AdrenaClient_1.default.findATAAddressSync(owner, custody.mint);
    const preInstructions = [];
    if (!(await AdrenaClient_1.default.isAccountInitialized(agent.connection, receivingAccount))) {
        preInstructions.push(AdrenaClient_1.default.createATAInstruction({
            ataAddress: receivingAccount,
            mint: custody.mint,
            owner,
        }));
    }
    const instruction = await client.program.methods
        .closePositionLong({
        price: new anchor_1.BN(price * 10 ** PRICE_DECIMALS),
    })
        .accountsStrict({
        owner,
        receivingAccount,
        transferAuthority: AdrenaClient_1.default.transferAuthority,
        pool: AdrenaClient_1.default.mainPool,
        position: position,
        custody: custody.pubkey,
        custodyTokenAccount,
        custodyOracle: custody.oracle,
        custodyTradeOracle: custody.tradeOracle,
        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        lmStaking: AdrenaClient_1.default.lmStaking,
        lpStaking: AdrenaClient_1.default.lpStaking,
        cortex: AdrenaClient_1.default.cortex,
        stakingRewardTokenCustody: stakingRewardTokenCustodyAccount.pubkey,
        stakingRewardTokenCustodyOracle: stakingRewardTokenCustodyAccount.oracle,
        stakingRewardTokenCustodyTokenAccount,
        lmStakingRewardTokenVault: AdrenaClient_1.default.lmStakingRewardTokenVault,
        lpStakingRewardTokenVault: AdrenaClient_1.default.lpStakingRewardTokenVault,
        lpTokenMint: AdrenaClient_1.default.lpTokenMint,
        protocolFeeRecipient: client.cortex.protocolFeeRecipient,
        adrenaProgram: AdrenaClient_1.default.programId,
        userProfile: userProfile ? userProfilePda : null,
        caller: owner,
    })
        .instruction();
    return (0, send_tx_1.sendTx)(agent, [...preInstructions, instruction]);
}
/**
 * Open long trade on Adrena
 *
 * Note: provide the same token as collateralMint and as tradeMint to avoid swap
 * @returns Transaction signature
 */
async function openPerpTradeLong({ agent, price, collateralAmount, collateralMint = constants_1.TOKENS.jitoSOL, leverage = constants_1.DEFAULT_OPTIONS.LEVERAGE_BPS, tradeMint = constants_1.TOKENS.jitoSOL, slippage = 0.3, }) {
    const client = await AdrenaClient_1.default.load(agent);
    const owner = agent.wallet.publicKey;
    const collateralAccount = AdrenaClient_1.default.findATAAddressSync(owner, tradeMint);
    const fundingAccount = AdrenaClient_1.default.findATAAddressSync(owner, collateralMint);
    const receivingCustody = AdrenaClient_1.default.findCustodyAddress(collateralMint);
    const receivingCustodyOracle = client.getCustodyByMint(collateralMint).oracle;
    const receivingCustodyTokenAccount = AdrenaClient_1.default.findCustodyTokenAccountAddress(collateralMint);
    // Principal custody is the custody of the targeted token
    // i.e open a 1 ETH long position, principal custody is ETH
    const principalCustody = AdrenaClient_1.default.findCustodyAddress(tradeMint);
    const principalCustodyAccount = client.getCustodyByMint(tradeMint);
    const principalCustodyOracle = principalCustodyAccount.oracle;
    const principalCustodyTradeOracle = principalCustodyAccount.tradeOracle;
    const principalCustodyTokenAccount = AdrenaClient_1.default.findCustodyTokenAccountAddress(tradeMint);
    const stakingRewardTokenCustodyAccount = client.getCustodyByMint(AdrenaClient_1.default.stakingRewardTokenMint);
    const stakingRewardTokenCustodyTokenAccount = AdrenaClient_1.default.findCustodyTokenAccountAddress(AdrenaClient_1.default.stakingRewardTokenMint);
    const position = AdrenaClient_1.default.findPositionAddress(owner, principalCustody, "long");
    const userProfilePda = AdrenaClient_1.default.getUserProfilePda(owner);
    const userProfile = await client.program.account.userProfile.fetchNullable(userProfilePda);
    const priceWithSlippage = applySlippage(new anchor_1.BN(price * 10 ** PRICE_DECIMALS), slippage);
    const scaledCollateralAmount = new anchor_1.BN(collateralAmount *
        Math.pow(10, client.getCustodyByMint(collateralMint).decimals));
    const preInstructions = [];
    if (!(await AdrenaClient_1.default.isAccountInitialized(agent.connection, collateralAccount))) {
        preInstructions.push(AdrenaClient_1.default.createATAInstruction({
            ataAddress: collateralAccount,
            mint: tradeMint,
            owner,
        }));
    }
    const instruction = await client.program.methods
        .openOrIncreasePositionWithSwapLong({
        price: priceWithSlippage,
        collateral: scaledCollateralAmount,
        leverage,
        referrer: null,
    })
        .accountsStrict({
        owner,
        payer: owner,
        fundingAccount,
        collateralAccount,
        receivingCustody,
        receivingCustodyOracle,
        receivingCustodyTokenAccount,
        principalCustody,
        principalCustodyOracle,
        principalCustodyTradeOracle,
        principalCustodyTokenAccount,
        transferAuthority: AdrenaClient_1.default.transferAuthority,
        cortex: AdrenaClient_1.default.cortex,
        lmStaking: AdrenaClient_1.default.lmStaking,
        lpStaking: AdrenaClient_1.default.lpStaking,
        pool: AdrenaClient_1.default.mainPool,
        position,
        stakingRewardTokenCustody: stakingRewardTokenCustodyAccount.pubkey,
        stakingRewardTokenCustodyOracle: stakingRewardTokenCustodyAccount.oracle,
        stakingRewardTokenCustodyTokenAccount,
        lmStakingRewardTokenVault: AdrenaClient_1.default.lmStakingRewardTokenVault,
        lpStakingRewardTokenVault: AdrenaClient_1.default.lpStakingRewardTokenVault,
        lpTokenMint: AdrenaClient_1.default.lpTokenMint,
        userProfile: userProfile ? userProfilePda : null,
        protocolFeeRecipient: client.cortex.protocolFeeRecipient,
        systemProgram: web3_js_1.SystemProgram.programId,
        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        adrenaProgram: ADRENA_PROGRAM_ID,
    })
        .instruction();
    return (0, send_tx_1.sendTx)(agent, [...preInstructions, instruction]);
}
/**
 * Open short trade on Adrena
 *
 * Note: provide USDC as collateralMint to avoid swap
 * @returns Transaction signature
 */
async function openPerpTradeShort({ agent, price, collateralAmount, collateralMint = constants_1.TOKENS.USDC, leverage = constants_1.DEFAULT_OPTIONS.LEVERAGE_BPS, tradeMint = constants_1.TOKENS.jitoSOL, slippage = 0.3, }) {
    const client = await AdrenaClient_1.default.load(agent);
    const owner = agent.wallet.publicKey;
    const collateralAccount = AdrenaClient_1.default.findATAAddressSync(owner, tradeMint);
    const fundingAccount = AdrenaClient_1.default.findATAAddressSync(owner, collateralMint);
    const receivingCustody = AdrenaClient_1.default.findCustodyAddress(collateralMint);
    const receivingCustodyOracle = client.getCustodyByMint(collateralMint).oracle;
    const receivingCustodyTokenAccount = AdrenaClient_1.default.findCustodyTokenAccountAddress(collateralMint);
    // Principal custody is the custody of the targeted token
    // i.e open a 1 BTC short position, principal custody is BTC
    const principalCustody = AdrenaClient_1.default.findCustodyAddress(tradeMint);
    const principalCustodyAccount = client.getCustodyByMint(tradeMint);
    const principalCustodyTradeOracle = principalCustodyAccount.tradeOracle;
    const principalCustodyTokenAccount = AdrenaClient_1.default.findCustodyTokenAccountAddress(tradeMint);
    const usdcAta = AdrenaClient_1.default.findATAAddressSync(owner, constants_1.TOKENS.USDC);
    const preInstructions = [];
    if (!(await AdrenaClient_1.default.isAccountInitialized(agent.connection, usdcAta))) {
        preInstructions.push(AdrenaClient_1.default.createATAInstruction({
            ataAddress: usdcAta,
            mint: constants_1.TOKENS.USDC,
            owner,
        }));
    }
    // Custody used to provide collateral when opening the position
    // Should be a stable token, by default, use USDC
    const instructionCollateralMint = constants_1.TOKENS.USDC;
    const collateralCustody = AdrenaClient_1.default.findCustodyAddress(instructionCollateralMint);
    const collateralCustodyOracle = client.getCustodyByMint(instructionCollateralMint).oracle;
    const collateralCustodyTokenAccount = AdrenaClient_1.default.findCustodyTokenAccountAddress(instructionCollateralMint);
    const stakingRewardTokenCustodyAccount = client.getCustodyByMint(AdrenaClient_1.default.stakingRewardTokenMint);
    const stakingRewardTokenCustodyTokenAccount = AdrenaClient_1.default.findCustodyTokenAccountAddress(AdrenaClient_1.default.stakingRewardTokenMint);
    const position = AdrenaClient_1.default.findPositionAddress(owner, principalCustody, "long");
    const userProfilePda = AdrenaClient_1.default.getUserProfilePda(owner);
    const userProfile = await client.program.account.userProfile.fetchNullable(userProfilePda);
    const priceWithSlippage = applySlippage(new anchor_1.BN(price * 10 ** PRICE_DECIMALS), slippage);
    const scaledCollateralAmount = new anchor_1.BN(collateralAmount *
        Math.pow(10, client.getCustodyByMint(collateralMint).decimals));
    const instruction = await client.program.methods
        .openOrIncreasePositionWithSwapShort({
        price: priceWithSlippage,
        collateral: scaledCollateralAmount,
        leverage,
        referrer: null,
    })
        .accountsStrict({
        owner,
        payer: owner,
        fundingAccount,
        collateralAccount,
        receivingCustody,
        receivingCustodyOracle,
        receivingCustodyTokenAccount,
        principalCustody,
        principalCustodyTradeOracle,
        principalCustodyTokenAccount,
        collateralCustody,
        collateralCustodyOracle,
        collateralCustodyTokenAccount,
        transferAuthority: AdrenaClient_1.default.transferAuthority,
        cortex: AdrenaClient_1.default.cortex,
        lmStaking: AdrenaClient_1.default.lmStaking,
        lpStaking: AdrenaClient_1.default.lpStaking,
        pool: AdrenaClient_1.default.mainPool,
        position,
        stakingRewardTokenCustody: stakingRewardTokenCustodyAccount.pubkey,
        stakingRewardTokenCustodyOracle: stakingRewardTokenCustodyAccount.oracle,
        stakingRewardTokenCustodyTokenAccount,
        lmStakingRewardTokenVault: AdrenaClient_1.default.lmStakingRewardTokenVault,
        lpStakingRewardTokenVault: AdrenaClient_1.default.lpStakingRewardTokenVault,
        lpTokenMint: AdrenaClient_1.default.lpTokenMint,
        userProfile: userProfile ? userProfilePda : null,
        protocolFeeRecipient: client.cortex.protocolFeeRecipient,
        systemProgram: web3_js_1.SystemProgram.programId,
        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        adrenaProgram: ADRENA_PROGRAM_ID,
    })
        .instruction();
    return (0, send_tx_1.sendTx)(agent, [...preInstructions, instruction]);
}
//# sourceMappingURL=adrena_perp_trading.js.map