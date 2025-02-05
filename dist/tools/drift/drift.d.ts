import { DriftClient } from "@drift-labs/sdk";
import type { SolanaAgentKit } from "../../agent";
import * as anchor from "@coral-xyz/anchor";
import { VaultClient } from "@drift-labs/vaults-sdk";
import { PublicKey } from "@solana/web3.js";
export declare function initClients(agent: SolanaAgentKit, params?: {
    authority: PublicKey;
    activeSubAccountId: number;
    subAccountIds: number[];
}): Promise<{
    driftClient: DriftClient;
    vaultClient: VaultClient;
    cleanUp: () => Promise<void>;
}>;
/**
 * Create a drift user account provided an amount
 * @param amount amount of the token to deposit
 * @param symbol symbol of the token to deposit
 */
export declare function createDriftUserAccount(agent: SolanaAgentKit, amount: number, symbol: string): Promise<{
    txSignature: string;
    account: anchor.web3.PublicKey;
    message?: never;
} | {
    message: string;
    account: anchor.web3.PublicKey;
    txSignature?: never;
}>;
/**
 * Deposit to your drift user account
 * @param agent
 * @param amount
 * @param symbol
 * @param isRepay
 * @returns
 */
export declare function depositToDriftUserAccount(agent: SolanaAgentKit, amount: number, symbol: string, isRepay?: boolean): Promise<import("@drift-labs/sdk").TxSigAndSlot>;
export declare function withdrawFromDriftUserAccount(agent: SolanaAgentKit, amount: number, symbol: string, isBorrow?: boolean): Promise<import("@drift-labs/sdk").TxSigAndSlot>;
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
export declare function driftPerpTrade(agent: SolanaAgentKit, params: {
    amount: number;
    symbol: string;
    action: "long" | "short";
    type: "market" | "limit";
    price?: number | undefined;
}): Promise<string>;
/**
 * Check if a user has a drift account
 * @param agent
 */
export declare function doesUserHaveDriftAccount(agent: SolanaAgentKit): Promise<{
    hasAccount: boolean;
    account: anchor.web3.PublicKey;
}>;
/**
 * Get account info for a drift User
 * @param agent
 * @returns
 */
export declare function driftUserAccountInfo(agent: SolanaAgentKit): Promise<{
    name: number[];
    authority: anchor.web3.PublicKey;
    settledPerpPnl: string;
    lastActiveSlot: number;
    perpPositions: {
        baseAssetAmount: number;
        settledPnl: number;
        lastCumulativeFundingRate: anchor.BN;
        marketIndex: number;
        quoteAssetAmount: anchor.BN;
        quoteEntryAmount: anchor.BN;
        quoteBreakEvenAmount: anchor.BN;
        openOrders: number;
        openBids: anchor.BN;
        openAsks: anchor.BN;
        lpShares: anchor.BN;
        remainderBaseAssetAmount: number;
        lastBaseAssetAmountPerLp: anchor.BN;
        lastQuoteAssetAmountPerLp: anchor.BN;
        perLpBase: number;
    }[];
    spotPositions: {
        availableBalance: number;
        symbol: string | undefined;
        marketIndex: number;
        balanceType: import("@drift-labs/sdk").SpotBalanceType;
        scaledBalance: anchor.BN;
        openOrders: number;
        openBids: anchor.BN;
        openAsks: anchor.BN;
        cumulativeDeposits: anchor.BN;
    }[];
    delegate: PublicKey;
    subAccountId: number;
    orders: import("@drift-labs/sdk").Order[];
    status: number;
    nextLiquidationId: number;
    nextOrderId: number;
    maxMarginRatio: number;
    lastAddPerpLpSharesTs: anchor.BN;
    totalDeposits: anchor.BN;
    totalWithdraws: anchor.BN;
    totalSocialLoss: anchor.BN;
    cumulativePerpFunding: anchor.BN;
    cumulativeSpotFees: anchor.BN;
    liquidationMarginFreed: anchor.BN;
    isMarginTradingEnabled: boolean;
    idle: boolean;
    openOrders: number;
    hasOpenOrder: boolean;
    openAuctions: number;
    hasOpenAuction: boolean;
    lastFuelBonusUpdateTs: number;
    marginMode: import("@drift-labs/sdk").MarginMode;
    poolId: number;
}>;
/**
 * Get available spot markets on drift protocol
 */
export declare function getAvailableDriftSpotMarkets(): import("@drift-labs/sdk").SpotMarketConfig[];
/**
 * Get available perp markets on drift protocol
 */
export declare function getAvailableDriftPerpMarkets(): import("@drift-labs/sdk").PerpMarketConfig[];
/**
 * Stake a token to the drift insurance fund
 * @param agent
 * @param amount
 * @param symbol
 */
export declare function stakeToDriftInsuranceFund(agent: SolanaAgentKit, amount: number, symbol: string): Promise<string>;
/**
 * Request an unstake from the drift insurance fund
 * @param agent
 * @param amount
 * @param symbol
 */
export declare function requestUnstakeFromDriftInsuranceFund(agent: SolanaAgentKit, amount: number, symbol: string): Promise<string>;
/**
 * Unstake requested funds from the drift insurance fund once cool down period is elapsed
 * @param agent
 * @param symbol
 */
export declare function unstakeFromDriftInsuranceFund(agent: SolanaAgentKit, symbol: string): Promise<string>;
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
export declare function swapSpotToken(agent: SolanaAgentKit, params: {
    fromSymbol: string;
    toSymbol: string;
    slippage?: number | undefined;
} & ({
    fromAmount: number;
} | {
    toAmount: number;
})): Promise<string>;
/**
 * To get funding rate as a percentage, you need to multiply by the funding rate buffer precision
 * @param rawFundingRate
 */
export declare function getFundingRateAsPercentage(rawFundingRate: anchor.BN): number;
/**
 * Calculate the funding rate for a perpetual market
 * @param agent
 * @param marketSymbol
 */
export declare function calculatePerpMarketFundingRate(agent: SolanaAgentKit, marketSymbol: `${string}-PERP`, period: "year" | "hour"): Promise<{
    longRate: number;
    shortRate: number;
    friendlyString: string;
}>;
export declare function getL2OrderBook(marketSymbol: `${string}-PERP`): Promise<{
    asks: {
        price: anchor.BN;
        size: anchor.BN;
        sources: {};
    }[];
    bids: {
        price: anchor.BN;
        size: anchor.BN;
        sources: {};
    }[];
    oracleData: {
        price: anchor.BN | undefined;
        slot: anchor.BN | undefined;
        confidence: anchor.BN | undefined;
        hasSufficientNumberOfDataPoints: boolean;
        twap: anchor.BN | undefined;
        twapConfidence: anchor.BN | undefined;
        maxPrice: anchor.BN | undefined;
    };
    slot: number | undefined;
}>;
/**
 * Get the estimated entry quote of a perp trade
 * @param agent
 * @param marketSymbol
 * @param amount
 * @param type
 */
export declare function getEntryQuoteOfPerpTrade(marketSymbol: `${string}-PERP`, amount: number, type: "long" | "short"): Promise<{
    entryPrice: number;
    priceImpact: number;
    bestPrice: number;
    worstPrice: number;
}>;
/**
 * Get the APY for lending and borrowing a specific token on drift protocol
 * @param agent
 * @param symbol
 */
export declare function getLendingAndBorrowAPY(agent: SolanaAgentKit, symbol: string): Promise<{
    lendingAPY: number;
    borrowAPY: number;
}>;
//# sourceMappingURL=drift.d.ts.map