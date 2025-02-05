"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initClients = initClients;
exports.createDriftUserAccount = createDriftUserAccount;
exports.depositToDriftUserAccount = depositToDriftUserAccount;
exports.withdrawFromDriftUserAccount = withdrawFromDriftUserAccount;
exports.driftPerpTrade = driftPerpTrade;
exports.doesUserHaveDriftAccount = doesUserHaveDriftAccount;
exports.driftUserAccountInfo = driftUserAccountInfo;
exports.getAvailableDriftSpotMarkets = getAvailableDriftSpotMarkets;
exports.getAvailableDriftPerpMarkets = getAvailableDriftPerpMarkets;
exports.stakeToDriftInsuranceFund = stakeToDriftInsuranceFund;
exports.requestUnstakeFromDriftInsuranceFund = requestUnstakeFromDriftInsuranceFund;
exports.unstakeFromDriftInsuranceFund = unstakeFromDriftInsuranceFund;
exports.swapSpotToken = swapSpotToken;
exports.getFundingRateAsPercentage = getFundingRateAsPercentage;
exports.calculatePerpMarketFundingRate = calculatePerpMarketFundingRate;
exports.getL2OrderBook = getL2OrderBook;
exports.getEntryQuoteOfPerpTrade = getEntryQuoteOfPerpTrade;
exports.getLendingAndBorrowAPY = getLendingAndBorrowAPY;
const sdk_1 = require("@drift-labs/sdk");
const anchor = __importStar(require("@coral-xyz/anchor"));
const vaults_sdk_1 = require("@drift-labs/vaults-sdk");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const web3_js_2 = require("@solana/web3.js");
const web3_js_3 = require("@solana/web3.js");
const constants_1 = require("../../constants");
async function initClients(agent, params) {
    const wallet = {
        publicKey: agent.wallet.publicKey,
        payer: agent.wallet,
        signAllTransactions: async (txs) => {
            for (const tx of txs) {
                tx.sign(agent.wallet);
            }
            return txs;
        },
        signTransaction: async (tx) => {
            tx.sign(agent.wallet);
            return tx;
        },
    };
    // @ts-expect-error - false undefined type conflict
    const driftClient = new sdk_1.DriftClient({
        connection: agent.connection,
        wallet,
        env: "mainnet-beta",
        authority: params?.authority,
        activeSubAccountId: params?.activeSubAccountId,
        subAccountIds: params?.subAccountIds,
        txParams: {
            computeUnitsPrice: constants_1.MINIMUM_COMPUTE_PRICE_FOR_COMPLEX_ACTIONS,
        },
        txSender: new sdk_1.FastSingleTxSender({
            connection: agent.connection,
            wallet,
            timeout: 30000,
            blockhashRefreshInterval: 1000,
            opts: {
                commitment: agent.connection.commitment ?? "confirmed",
                skipPreflight: false,
                preflightCommitment: agent.connection.commitment ?? "confirmed",
            },
        }),
    });
    const vaultProgram = new anchor.Program(vaults_sdk_1.IDL, vaults_sdk_1.VAULT_PROGRAM_ID, driftClient.provider);
    const vaultClient = new vaults_sdk_1.VaultClient({
        driftClient,
        // @ts-expect-error - type mismatch due to different dep versions
        program: vaultProgram,
        cliMode: false,
    });
    await driftClient.subscribe();
    async function cleanUp() {
        await driftClient.unsubscribe();
    }
    return { driftClient, vaultClient, cleanUp };
}
/**
 * Create a drift user account provided an amount
 * @param amount amount of the token to deposit
 * @param symbol symbol of the token to deposit
 */
async function createDriftUserAccount(agent, amount, symbol) {
    try {
        const { driftClient, cleanUp } = await initClients(agent);
        const user = new sdk_1.User({
            driftClient,
            userAccountPublicKey: (0, sdk_1.getUserAccountPublicKeySync)(new web3_js_1.PublicKey(sdk_1.DRIFT_PROGRAM_ID), agent.wallet.publicKey),
        });
        const userAccountExists = await user.exists();
        const token = sdk_1.MainnetSpotMarkets.find((v) => v.symbol === symbol.toUpperCase());
        if (!token) {
            throw new Error(`Token with symbol ${symbol} not found. Here's a list of available spot markets: ${sdk_1.MainnetSpotMarkets.map((v) => v.symbol).join(", ")}
      `);
        }
        if (!userAccountExists) {
            const depositAmount = (0, sdk_1.numberToSafeBN)(amount, token.precision);
            const [txSignature, account] = await driftClient.initializeUserAccountAndDepositCollateral(depositAmount, (0, spl_token_1.getAssociatedTokenAddressSync)(token.mint, agent.wallet.publicKey));
            await cleanUp();
            return { txSignature, account };
        }
        await cleanUp();
        return {
            message: "User account already exists",
            account: user.userAccountPublicKey,
        };
    }
    catch (e) {
        // @ts-expect-error - error message is a string
        throw new Error(`Failed to create user account: ${e.message}`);
    }
}
/**
 * Deposit to your drift user account
 * @param agent
 * @param amount
 * @param symbol
 * @param isRepay
 * @returns
 */
async function depositToDriftUserAccount(agent, amount, symbol, isRepay = false) {
    try {
        const { driftClient, cleanUp } = await initClients(agent);
        const publicKey = agent.wallet.publicKey;
        const user = new sdk_1.User({
            driftClient,
            userAccountPublicKey: (0, sdk_1.getUserAccountPublicKeySync)(new web3_js_1.PublicKey(sdk_1.DRIFT_PROGRAM_ID), publicKey),
        });
        const userAccountExists = await user.exists();
        const token = sdk_1.MainnetSpotMarkets.find((v) => v.symbol === symbol.toUpperCase());
        if (!token) {
            throw new Error(`Token with symbol ${symbol} not found. Here's a list of available spot markets: ${sdk_1.MainnetSpotMarkets.map((v) => v.symbol).join(", ")}`);
        }
        if (!userAccountExists) {
            throw new Error("You need to create a Drift user account first.");
        }
        const depositAmount = (0, sdk_1.numberToSafeBN)(amount, token.precision);
        const [depInstruction, latestBlockhash] = await Promise.all([
            driftClient.getDepositTxnIx(depositAmount, token.marketIndex, (0, spl_token_1.getAssociatedTokenAddressSync)(token.mint, publicKey), undefined, isRepay),
            driftClient.connection.getLatestBlockhash(),
        ]);
        const tx = new web3_js_2.Transaction().add(...depInstruction).add(web3_js_3.ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: constants_1.MINIMUM_COMPUTE_PRICE_FOR_COMPLEX_ACTIONS,
        }));
        tx.recentBlockhash = latestBlockhash.blockhash;
        tx.sign(agent.wallet);
        const txSignature = await driftClient.txSender.sendRawTransaction(tx.serialize(), { ...driftClient.opts });
        await cleanUp();
        return txSignature;
    }
    catch (e) {
        // @ts-expect-error - error message is a string
        throw new Error(`Failed to deposit to user account: ${e.message}`);
    }
}
async function withdrawFromDriftUserAccount(agent, amount, symbol, isBorrow = false) {
    try {
        const { driftClient, cleanUp } = await initClients(agent);
        const user = new sdk_1.User({
            driftClient,
            userAccountPublicKey: (0, sdk_1.getUserAccountPublicKeySync)(new web3_js_1.PublicKey(sdk_1.DRIFT_PROGRAM_ID), agent.wallet.publicKey),
        });
        const userAccountExists = await user.exists();
        if (!userAccountExists) {
            throw new Error("You need to create a Drift user account first.");
        }
        const token = sdk_1.MainnetSpotMarkets.find((v) => v.symbol === symbol.toUpperCase());
        if (!token) {
            throw new Error(`Token with symbol ${symbol} not found. Here's a list of available spot markets: ${sdk_1.MainnetSpotMarkets.map((v) => v.symbol).join(", ")}`);
        }
        const withdrawAmount = (0, sdk_1.numberToSafeBN)(amount, token.precision);
        const [withdrawInstruction, latestBlockhash] = await Promise.all([
            driftClient.getWithdrawalIxs(withdrawAmount, token.marketIndex, (0, spl_token_1.getAssociatedTokenAddressSync)(token.mint, agent.wallet.publicKey), !isBorrow),
            driftClient.connection.getLatestBlockhash(),
        ]);
        const tx = new web3_js_2.Transaction().add(...withdrawInstruction).add(web3_js_3.ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: constants_1.MINIMUM_COMPUTE_PRICE_FOR_COMPLEX_ACTIONS,
        }));
        tx.recentBlockhash = latestBlockhash.blockhash;
        tx.sign(agent.wallet);
        const txSignature = await driftClient.txSender.sendRawTransaction(tx.serialize(), { ...driftClient.opts });
        await cleanUp();
        return txSignature;
    }
    catch (e) {
        // @ts-expect-error - error message is a string
        throw new Error(`Failed to withdraw from user account: ${e.message}`);
    }
}
/**
 * Open a perpetual trade on drift
 * @param agent
 * @param params.amount
 * @param params.symbol
 * @param params.action
 * @param params.type
 * @param params.price this should only be supplied if type is limit
 * @param params.reduceOnly
 */
async function driftPerpTrade(agent, params) {
    try {
        const { driftClient, cleanUp } = await initClients(agent);
        const user = new sdk_1.User({
            driftClient,
            userAccountPublicKey: (0, sdk_1.getUserAccountPublicKeySync)(new web3_js_1.PublicKey(sdk_1.DRIFT_PROGRAM_ID), agent.wallet.publicKey),
        });
        const userAccountExists = await user.exists();
        if (!userAccountExists) {
            throw new Error("You need to create a Drift user account first.");
        }
        const market = driftClient.getMarketIndexAndType(`${params.symbol.toUpperCase()}-PERP`);
        if (!market) {
            throw new Error(`Token with symbol ${params.symbol} not found. Here's a list of available perp markets: ${sdk_1.MainnetPerpMarkets.map((v) => v.symbol).join(", ")}`);
        }
        const baseAssetPrice = driftClient.getOracleDataForPerpMarket(market.marketIndex);
        const convertedAmount = params.amount / (0, sdk_1.convertToNumber)(baseAssetPrice.price, sdk_1.PRICE_PRECISION);
        let signature;
        if (params.type === "limit") {
            if (!params.price) {
                throw new Error("Price is required for limit orders");
            }
            signature = await driftClient.placePerpOrder((0, sdk_1.getLimitOrderParams)({
                baseAssetAmount: (0, sdk_1.numberToSafeBN)(convertedAmount, sdk_1.BASE_PRECISION),
                reduceOnly: false,
                direction: params.action === "long"
                    ? sdk_1.PositionDirection.LONG
                    : sdk_1.PositionDirection.SHORT,
                marketIndex: market.marketIndex,
                price: (0, sdk_1.numberToSafeBN)(params.price, sdk_1.PRICE_PRECISION),
                postOnly: sdk_1.PostOnlyParams.SLIDE,
            }), {
                computeUnitsPrice: 0.000001 * 1000000 * 1000000,
            });
        }
        else {
            signature = await driftClient.placePerpOrder((0, sdk_1.getMarketOrderParams)({
                baseAssetAmount: (0, sdk_1.numberToSafeBN)(convertedAmount, sdk_1.BASE_PRECISION),
                reduceOnly: false,
                direction: params.action === "long"
                    ? sdk_1.PositionDirection.LONG
                    : sdk_1.PositionDirection.SHORT,
                marketIndex: market.marketIndex,
            }), {
                computeUnitsPrice: constants_1.MINIMUM_COMPUTE_PRICE_FOR_COMPLEX_ACTIONS,
            });
        }
        if (!signature) {
            throw new Error("Failed to place order. Please make sure ");
        }
        await cleanUp();
        return signature;
    }
    catch (e) {
        // @ts-expect-error - error message is a string
        throw new Error(`Failed to place order: ${e.message}`);
    }
}
/**
 * Check if a user has a drift account
 * @param agent
 */
async function doesUserHaveDriftAccount(agent) {
    try {
        const { driftClient, cleanUp } = await initClients(agent);
        const user = new sdk_1.User({
            driftClient,
            userAccountPublicKey: (0, sdk_1.getUserAccountPublicKeySync)(new web3_js_1.PublicKey(sdk_1.DRIFT_PROGRAM_ID), agent.wallet.publicKey),
        });
        await user.subscribe();
        user.getActivePerpPositions();
        const userAccountExists = await user.exists();
        await cleanUp();
        await user.unsubscribe();
        return {
            hasAccount: userAccountExists,
            account: user.userAccountPublicKey,
        };
    }
    catch (e) {
        // @ts-expect-error - error message is a string
        throw new Error(`Failed to check user account: ${e.message}`);
    }
}
/**
 * Get account info for a drift User
 * @param agent
 * @returns
 */
async function driftUserAccountInfo(agent) {
    try {
        const { driftClient, cleanUp } = await initClients(agent);
        const user = new sdk_1.User({
            driftClient,
            userAccountPublicKey: (0, sdk_1.getUserAccountPublicKeySync)(new web3_js_1.PublicKey(sdk_1.DRIFT_PROGRAM_ID), agent.wallet.publicKey),
        });
        const userAccountExists = await user.exists();
        if (!userAccountExists) {
            throw new Error("User account does not exist");
        }
        await user.subscribe();
        const account = user.getUserAccount();
        await user.unsubscribe();
        await cleanUp();
        const perpPositions = account.perpPositions.map((pos) => ({
            ...pos,
            baseAssetAmount: (0, sdk_1.convertToNumber)(pos.baseAssetAmount, sdk_1.BASE_PRECISION),
            settledPnl: (0, sdk_1.convertToNumber)(pos.settledPnl, sdk_1.QUOTE_PRECISION),
        }));
        const spotPositions = account.spotPositions.map((pos) => ({
            ...pos,
            availableBalance: (0, sdk_1.convertToNumber)(pos.scaledBalance, sdk_1.MainnetSpotMarkets[pos.marketIndex].precision),
            symbol: sdk_1.MainnetSpotMarkets.find((v) => v.marketIndex === pos.marketIndex)
                ?.symbol,
        }));
        return {
            ...account,
            name: account.name,
            authority: account.authority,
            settledPerpPnl: `$${(0, sdk_1.convertToNumber)(account.settledPerpPnl, sdk_1.QUOTE_PRECISION)}`,
            lastActiveSlot: account.lastActiveSlot.toNumber(),
            perpPositions,
            spotPositions,
        };
    }
    catch (e) {
        // @ts-expect-error - error message is a string
        throw new Error(`Failed to check user account: ${e.message}`);
    }
}
/**
 * Get available spot markets on drift protocol
 */
function getAvailableDriftSpotMarkets() {
    return sdk_1.MainnetSpotMarkets;
}
/**
 * Get available perp markets on drift protocol
 */
function getAvailableDriftPerpMarkets() {
    return sdk_1.MainnetPerpMarkets;
}
/**
 * Stake a token to the drift insurance fund
 * @param agent
 * @param amount
 * @param symbol
 */
async function stakeToDriftInsuranceFund(agent, amount, symbol) {
    try {
        const { cleanUp, driftClient } = await initClients(agent);
        const token = sdk_1.MainnetSpotMarkets.find((v) => v.symbol === symbol.toUpperCase());
        if (!token) {
            throw new Error(`Token with symbol ${symbol} not found. Here's a list of available spot markets: ${sdk_1.MainnetSpotMarkets.map((v) => v.symbol).join(", ")}`);
        }
        const deriveInsuranceFundStakeAccount = (0, sdk_1.getInsuranceFundStakeAccountPublicKey)(driftClient.program.programId, agent.wallet.publicKey, token.marketIndex);
        let shouldCreateAccount = false;
        try {
            await driftClient.connection.getAccountInfo(deriveInsuranceFundStakeAccount);
        }
        catch (e) {
            // @ts-expect-error - error message is a string
            if (e.message.includes("Account not found")) {
                shouldCreateAccount = true;
            }
        }
        const signature = await driftClient.addInsuranceFundStake({
            amount: (0, sdk_1.numberToSafeBN)(amount, token.precision),
            marketIndex: token.marketIndex,
            collateralAccountPublicKey: (0, spl_token_1.getAssociatedTokenAddressSync)(token.mint, agent.wallet.publicKey),
            initializeStakeAccount: shouldCreateAccount,
            txParams: {
                computeUnitsPrice: constants_1.MINIMUM_COMPUTE_PRICE_FOR_COMPLEX_ACTIONS,
            },
        });
        await cleanUp();
        return signature;
    }
    catch (e) {
        // @ts-expect-error - error message is a string
        throw new Error(`Failed to get APYs: ${e.message}`);
    }
}
/**
 * Request an unstake from the drift insurance fund
 * @param agent
 * @param amount
 * @param symbol
 */
async function requestUnstakeFromDriftInsuranceFund(agent, amount, symbol) {
    try {
        const { driftClient, cleanUp } = await initClients(agent);
        const token = sdk_1.MainnetSpotMarkets.find((v) => v.symbol === symbol.toUpperCase());
        if (!token) {
            throw new Error(`Token with symbol ${symbol} not found. Here's a list of available spot markets: ${sdk_1.MainnetSpotMarkets.map((v) => v.symbol).join(", ")}`);
        }
        const signature = await driftClient.requestRemoveInsuranceFundStake(token.marketIndex, (0, sdk_1.numberToSafeBN)(amount, token.precision), { computeUnitsPrice: constants_1.MINIMUM_COMPUTE_PRICE_FOR_COMPLEX_ACTIONS });
        await cleanUp();
        return signature;
    }
    catch (e) {
        // @ts-expect-error error message is a string
        throw new Error(`Failed to unstake from insurance fund: ${e.message}`);
    }
}
/**
 * Unstake requested funds from the drift insurance fund once cool down period is elapsed
 * @param agent
 * @param symbol
 */
async function unstakeFromDriftInsuranceFund(agent, symbol) {
    try {
        const { driftClient, cleanUp } = await initClients(agent);
        const token = sdk_1.MainnetSpotMarkets.find((v) => v.symbol === symbol.toUpperCase());
        if (!token) {
            throw new Error(`Token with symbol ${symbol} not found. Here's a list of available spot markets: ${sdk_1.MainnetSpotMarkets.map((v) => v.symbol).join(", ")}`);
        }
        const signature = await driftClient.removeInsuranceFundStake(token.marketIndex, (0, spl_token_1.getAssociatedTokenAddressSync)(token.mint, agent.wallet.publicKey), {
            computeUnitsPrice: constants_1.MINIMUM_COMPUTE_PRICE_FOR_COMPLEX_ACTIONS,
        });
        await cleanUp();
        return signature;
    }
    catch (e) {
        // @ts-expect-error error message is a string
        throw new Error(`Failed to unstake from insurance fund: ${e.message}`);
    }
}
/**
 * Swap a spot token for another on drift
 * @param agent
 * @param params
 * @param params.fromSymbol symbol of the token to deposit
 * @param params.toSymbol symbol of the token to receive
 * @param params.fromAmount amount of the token to deposit
 * @param params.toAmount amount of the token to receive
 * @param params.slippage slippage tolerance in percentage
 */
async function swapSpotToken(agent, params) {
    try {
        const { driftClient, cleanUp } = await initClients(agent);
        const fromToken = sdk_1.MainnetSpotMarkets.find((v) => v.symbol === params.fromSymbol.toUpperCase());
        const toToken = sdk_1.MainnetSpotMarkets.find((v) => v.symbol === params.toSymbol.toUpperCase());
        if (!fromToken) {
            throw new Error(`Token with symbol ${params.fromSymbol} not found. Here's a list of available spot markets: ${sdk_1.MainnetSpotMarkets.map((v) => v.symbol).join(", ")}`);
        }
        if (!toToken) {
            throw new Error(`Token with symbol ${params.toSymbol} not found. Here's a list of available spot markets: ${sdk_1.MainnetSpotMarkets.map((v) => v.symbol).join(", ")}`);
        }
        let txSig;
        // @ts-expect-error - false undefined type conflict
        if (params.fromAmount) {
            const jupiterClient = new sdk_1.JupiterClient({ connection: agent.connection });
            // @ts-expect-error - false undefined type conflict
            const fromAmount = (0, sdk_1.numberToSafeBN)(params.fromAmount, fromToken.precision);
            const res = await (await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${fromToken.mint}&outputMint=${toToken.mint}&amount=${fromAmount.toNumber()}&slippageBps=${(params.slippage ?? 0.5) * 100}&swapMode=ExactIn`)).json();
            const signature = await driftClient.swap({
                amount: fromAmount,
                inMarketIndex: fromToken.marketIndex,
                outMarketIndex: toToken.marketIndex,
                jupiterClient: jupiterClient,
                v6: {
                    quote: res,
                },
                slippageBps: (params.slippage ?? 0.5) * 100,
                swapMode: "ExactIn",
            });
            txSig = signature;
        }
        // @ts-expect-error - false undefined type conflict
        if (params.toAmount) {
            const jupiterClient = new sdk_1.JupiterClient({ connection: agent.connection });
            // @ts-expect-error - false undefined type conflict
            const toAmount = (0, sdk_1.numberToSafeBN)(params.toAmount, toToken.precision);
            const res = await (await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${fromToken.mint}&outputMint=${toToken.mint}&amount=${toAmount.toNumber()}&slippageBps=${(params.slippage ?? 0.5) * 100}&swapMode=ExactOut`)).json();
            const signature = await driftClient.swap({
                amount: toAmount,
                inMarketIndex: toToken.marketIndex,
                outMarketIndex: fromToken.marketIndex,
                jupiterClient: jupiterClient,
                v6: {
                    quote: res,
                },
                slippageBps: (params.slippage ?? 0.5) * 100,
                swapMode: "ExactOut",
            });
            txSig = signature;
        }
        await cleanUp();
        // @ts-expect-error - false use before assignment
        if (txSig) {
            return txSig;
        }
        throw new Error("Either fromAmount or toAmount must be provided");
    }
    catch (e) {
        // @ts-expect-error error message is a string
        throw new Error(`Failed to swap token: ${e.message}`);
    }
}
/**
 * To get funding rate as a percentage, you need to multiply by the funding rate buffer precision
 * @param rawFundingRate
 */
function getFundingRateAsPercentage(rawFundingRate) {
    return sdk_1.BigNum.from(rawFundingRate.mul(sdk_1.FUNDING_RATE_BUFFER_PRECISION), sdk_1.FUNDING_RATE_PRECISION_EXP).toNum();
}
/**
 * Calculate the funding rate for a perpetual market
 * @param agent
 * @param marketSymbol
 */
async function calculatePerpMarketFundingRate(agent, marketSymbol, period) {
    try {
        const { driftClient, cleanUp } = await initClients(agent);
        const market = driftClient.getMarketIndexAndType(`${marketSymbol.toUpperCase()}`);
        if (!market) {
            throw new Error(`This market isn't available on the Drift Protocol. Here's a list of markets that are: ${sdk_1.MainnetPerpMarkets.map((v) => v.symbol).join(", ")}`);
        }
        const marketAccount = driftClient.getPerpMarketAccount(market.marketIndex);
        if (!marketAccount) {
            throw new Error("Market account not found");
        }
        const [, , longFundingRate, shortFundingRate] = await (0, sdk_1.calculateLongShortFundingRateAndLiveTwaps)(marketAccount, driftClient.getOracleDataForPerpMarket(market.marketIndex), undefined, new anchor.BN(Date.now()));
        await cleanUp();
        let longFundingRateNum = getFundingRateAsPercentage(longFundingRate);
        let shortFundingRateNum = getFundingRateAsPercentage(shortFundingRate);
        if (period === "year") {
            const paymentsPerYear = 24 * 365.25;
            longFundingRateNum *= paymentsPerYear;
            shortFundingRateNum *= paymentsPerYear;
        }
        const longsArePaying = longFundingRateNum > 0;
        const shortsArePaying = !(shortFundingRateNum > 0);
        const longsAreString = longsArePaying ? "pay" : "receive";
        const shortsAreString = !shortsArePaying ? "receive" : "pay";
        const absoluteLongFundingRateNum = Math.abs(longFundingRateNum);
        const absoluteShortFundingRateNum = Math.abs(shortFundingRateNum);
        const formattedLongRatePct = absoluteLongFundingRateNum.toFixed(period === "hour" ? 5 : 2);
        const formattedShortRatePct = absoluteShortFundingRateNum.toFixed(period === "hour" ? 5 : 2);
        const paymentUnit = period === "year" ? "% APR" : "%";
        const friendlyString = `At this rate, longs would ${longsAreString} ${formattedLongRatePct} ${paymentUnit} and shorts would ${shortsAreString} ${formattedShortRatePct} ${paymentUnit} at the end of the hour.`;
        return {
            longRate: longsArePaying
                ? -absoluteLongFundingRateNum
                : absoluteLongFundingRateNum,
            shortRate: shortsArePaying
                ? -absoluteShortFundingRateNum
                : absoluteShortFundingRateNum,
            friendlyString,
        };
    }
    catch (e) {
        throw new Error(
        // @ts-expect-error e.message is a string
        `Something went wrong while trying to get the market's funding rate. Here's some more context: ${e.message}`);
    }
}
async function getL2OrderBook(marketSymbol) {
    try {
        const serializedOrderbook = await (await fetch(`https://dlob.drift.trade/l2?marketName=${marketSymbol.toUpperCase()}&includeOracle=true`)).json();
        return {
            asks: serializedOrderbook.asks.map((ask) => ({
                price: new anchor.BN(ask.price),
                size: new anchor.BN(ask.size),
                sources: Object.entries(ask.sources).reduce((previous, [key, val]) => {
                    return {
                        ...(previous ?? {}),
                        [key]: new anchor.BN(val),
                    };
                }, {}),
            })),
            bids: serializedOrderbook.bids.map((bid) => ({
                price: new anchor.BN(bid.price),
                size: new anchor.BN(bid.size),
                sources: Object.entries(bid.sources).reduce((previous, [key, val]) => {
                    return {
                        ...(previous ?? {}),
                        [key]: new anchor.BN(val),
                    };
                }, {}),
            })),
            oracleData: {
                price: serializedOrderbook.oracleData.price
                    ? new anchor.BN(serializedOrderbook.oracleData.price)
                    : undefined,
                slot: serializedOrderbook.oracleData.slot
                    ? new anchor.BN(serializedOrderbook.oracleData.slot)
                    : undefined,
                confidence: serializedOrderbook.oracleData.confidence
                    ? new anchor.BN(serializedOrderbook.oracleData.confidence)
                    : undefined,
                hasSufficientNumberOfDataPoints: serializedOrderbook.oracleData.hasSufficientNumberOfDataPoints,
                twap: serializedOrderbook.oracleData.twap
                    ? new anchor.BN(serializedOrderbook.oracleData.twap)
                    : undefined,
                twapConfidence: serializedOrderbook.oracleData.twapConfidence
                    ? new anchor.BN(serializedOrderbook.oracleData.twapConfidence)
                    : undefined,
                maxPrice: serializedOrderbook.oracleData.maxPrice
                    ? new anchor.BN(serializedOrderbook.oracleData.maxPrice)
                    : undefined,
            },
            slot: serializedOrderbook.slot,
        };
    }
    catch (e) {
        throw new Error(`Failed to get ${marketSymbol} order book: ${e}`);
    }
}
/**
 * Get the estimated entry quote of a perp trade
 * @param agent
 * @param marketSymbol
 * @param amount
 * @param type
 */
async function getEntryQuoteOfPerpTrade(marketSymbol, amount, type) {
    try {
        const l2OrderBookData = await getL2OrderBook(marketSymbol);
        const estimatedEntryPriceData = (0, sdk_1.calculateEstimatedEntryPriceWithL2)("quote", (0, sdk_1.numberToSafeBN)(amount, sdk_1.BASE_PRECISION), type === "long" ? sdk_1.PositionDirection.LONG : sdk_1.PositionDirection.SHORT, sdk_1.BASE_PRECISION, 
        // @ts-expect-error - false type conflict
        l2OrderBookData);
        return {
            entryPrice: (0, sdk_1.convertToNumber)(estimatedEntryPriceData.entryPrice, sdk_1.QUOTE_PRECISION),
            priceImpact: (0, sdk_1.convertToNumber)(estimatedEntryPriceData.priceImpact, sdk_1.QUOTE_PRECISION),
            bestPrice: (0, sdk_1.convertToNumber)(estimatedEntryPriceData.bestPrice, sdk_1.QUOTE_PRECISION),
            worstPrice: (0, sdk_1.convertToNumber)(estimatedEntryPriceData.worstPrice, sdk_1.QUOTE_PRECISION),
        };
    }
    catch (e) {
        // @ts-expect-error - error message is a string
        throw new Error(`Failed to get entry quote: ${e.message}`);
    }
}
/**
 * Get the APY for lending and borrowing a specific token on drift protocol
 * @param agent
 * @param symbol
 */
async function getLendingAndBorrowAPY(agent, symbol) {
    try {
        const { driftClient, cleanUp } = await initClients(agent);
        const token = sdk_1.MainnetSpotMarkets.find((v) => v.symbol === symbol.toUpperCase());
        if (!token) {
            throw new Error(`Token with symbol ${symbol} not found. Here's a list of available spot markets: ${sdk_1.MainnetSpotMarkets.map((v) => v.symbol).join(", ")}`);
        }
        const marketAccount = driftClient.getSpotMarketAccount(token.marketIndex);
        if (!marketAccount) {
            throw new Error("Market account not found");
        }
        const lendAPY = (0, sdk_1.calculateDepositRate)(marketAccount);
        const borrowAPY = (0, sdk_1.calculateInterestRate)(marketAccount);
        await cleanUp();
        return {
            lendingAPY: (0, sdk_1.convertToNumber)(lendAPY, sdk_1.PERCENTAGE_PRECISION) * 100, // convert to percentage
            borrowAPY: (0, sdk_1.convertToNumber)(borrowAPY, sdk_1.PERCENTAGE_PRECISION) * 100, // convert to percentage
        };
    }
    catch (e) {
        // @ts-expect-error - error message is a string
        throw new Error(`Failed to get APYs: ${e.message}`);
    }
}
//# sourceMappingURL=drift.js.map