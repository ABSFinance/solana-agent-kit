import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import Decimal from "decimal.js";
import { CreateCollectionOptions, CreateSingleOptions } from "@3land/listings-sdk/dist/types/implementation/implementationTypes";
import { mintCollectionNFT, closePerpTradeShort, closePerpTradeLong, openPerpTradeShort, openPerpTradeLong, FEE_TIERS } from "../tools";
import { Config, TokenCheck, CollectionDeployment, CollectionOptions, GibworkCreateTaskReponse, JupiterTokenData, MintCollectionNFTResponse, PumpfunLaunchResponse, PumpFunTokenOptions, OrderParams, FlashTradeParams, FlashCloseTradeParams, HeliusWebhookIdResponse, HeliusWebhookResponse } from "../types";
import { DasApiAsset, DasApiAssetList, GetAssetsByAuthorityRpcInput, GetAssetsByCreatorRpcInput } from "@metaplex-foundation/digital-asset-standard-api";
import { AlloraInference, AlloraTopic } from "@alloralabs/allora-sdk";
/**
 * Main class for interacting with Solana blockchain
 * Provides a unified interface for token operations, NFT management, trading and more
 *
 * @class SolanaAgentKit
 * @property {Connection} connection - Solana RPC connection
 * @property {Keypair} wallet - Wallet keypair for signing transactions
 * @property {PublicKey} wallet_address - Public key of the wallet
 * @property {Config} config - Configuration object
 */
export default class SolanaAgentKit {
    connection: Connection;
    wallet: Keypair;
    wallet_address: PublicKey;
    config: Config;
    /**
     * @deprecated Using openai_api_key directly in constructor is deprecated.
     * Please use the new constructor with Config object instead:
     * @example
     * const agent = new SolanaAgentKit(privateKey, rpcUrl, {
     *   OPENAI_API_KEY: 'your-key'
     * });
     */
    constructor(private_key: string, rpc_url: string, openai_api_key: string | null);
    constructor(private_key: string, rpc_url: string, config: Config);
    requestFaucetFunds(): Promise<string>;
    deployToken(name: string, uri: string, symbol: string, decimals?: number, initialSupply?: number): Promise<{
        mint: PublicKey;
    }>;
    deployCollection(options: CollectionOptions): Promise<CollectionDeployment>;
    getBalance(token_address?: PublicKey): Promise<number>;
    getTokenBalances(wallet_address?: PublicKey): Promise<{
        sol: number;
        tokens: Array<{
            tokenAddress: string;
            name: string;
            symbol: string;
            balance: number;
            decimals: number;
        }>;
    }>;
    getBalanceOther(walletAddress: PublicKey, tokenAddress?: PublicKey): Promise<number>;
    mintNFT(collectionMint: PublicKey, metadata: Parameters<typeof mintCollectionNFT>[2], recipient?: PublicKey): Promise<MintCollectionNFTResponse>;
    transfer(to: PublicKey, amount: number, mint?: PublicKey): Promise<string>;
    registerDomain(name: string, spaceKB?: number): Promise<string>;
    resolveSolDomain(domain: string): Promise<PublicKey>;
    getPrimaryDomain(account: PublicKey): Promise<string>;
    trade(outputMint: PublicKey, inputAmount: number, inputMint?: PublicKey, slippageBps?: number): Promise<string>;
    limitOrder(marketId: PublicKey, quantity: number, side: string, price: number): Promise<string>;
    batchOrder(marketId: PublicKey, orders: OrderParams[]): Promise<string>;
    cancelAllOrders(marketId: PublicKey): Promise<string>;
    withdrawAll(marketId: PublicKey): Promise<string>;
    openPerpTradeLong(args: Omit<Parameters<typeof openPerpTradeLong>[0], "agent">): Promise<string>;
    openPerpTradeShort(args: Omit<Parameters<typeof openPerpTradeShort>[0], "agent">): Promise<string>;
    closePerpTradeShort(args: Omit<Parameters<typeof closePerpTradeShort>[0], "agent">): Promise<string>;
    closePerpTradeLong(args: Omit<Parameters<typeof closePerpTradeLong>[0], "agent">): Promise<string>;
    lendAssets(amount: number): Promise<string>;
    luloLend(mintAddress: string, amount: number): Promise<string>;
    luloWithdraw(mintAddress: string, amount: number): Promise<string>;
    getTPS(): Promise<number>;
    getTokenDataByAddress(mint: string): Promise<JupiterTokenData | undefined>;
    getTokenDataByTicker(ticker: string): Promise<JupiterTokenData | undefined>;
    fetchTokenPrice(mint: string): Promise<string>;
    launchPumpFunToken(tokenName: string, tokenTicker: string, description: string, imageUrl: string, options?: PumpFunTokenOptions): Promise<PumpfunLaunchResponse>;
    stake(amount: number): Promise<string>;
    restake(amount: number): Promise<string>;
    sendCompressedAirdrop(mintAddress: string, amount: number, decimals: number, recipients: string[], priorityFeeInLamports: number, shouldLog: boolean): Promise<string[]>;
    meteoraCreateDynamicPool(tokenAMint: PublicKey, tokenBMint: PublicKey, tokenAAmount: BN, tokenBAmount: BN, tradeFeeNumerator: number, activationPoint: BN | null, hasAlphaVault: boolean, activationType: number): Promise<string>;
    meteoraCreateDlmmPool(tokenAMint: PublicKey, tokenBMint: PublicKey, binStep: number, initialPrice: number, priceRoundingUp: boolean, feeBps: number, activationType: number, hasAlphaVault: boolean, activationPoint: BN | undefined): Promise<string>;
    orcaClosePosition(positionMintAddress: PublicKey): Promise<string>;
    orcaCreateCLMM(mintDeploy: PublicKey, mintPair: PublicKey, initialPrice: Decimal, feeTier: keyof typeof FEE_TIERS): Promise<string>;
    orcaCreateSingleSidedLiquidityPool(depositTokenAmount: number, depositTokenMint: PublicKey, otherTokenMint: PublicKey, initialPrice: Decimal, maxPrice: Decimal, feeTier: keyof typeof FEE_TIERS): Promise<string>;
    orcaFetchPositions(): Promise<string>;
    orcaOpenCenteredPositionWithLiquidity(whirlpoolAddress: PublicKey, priceOffsetBps: number, inputTokenMint: PublicKey, inputAmount: Decimal): Promise<string>;
    orcaOpenSingleSidedPosition(whirlpoolAddress: PublicKey, distanceFromCurrentPriceBps: number, widthBps: number, inputTokenMint: PublicKey, inputAmount: Decimal): Promise<string>;
    resolveAllDomains(domain: string): Promise<PublicKey | undefined>;
    getOwnedAllDomains(owner: PublicKey): Promise<string[]>;
    getOwnedDomainsForTLD(tld: string): Promise<string[]>;
    getAllDomainsTLDs(): Promise<string[]>;
    getAllRegisteredAllDomains(): Promise<string[]>;
    getMainAllDomainsDomain(owner: PublicKey): Promise<string | null>;
    raydiumCreateAmmV4(marketId: PublicKey, baseAmount: BN, quoteAmount: BN, startTime: BN): Promise<string>;
    raydiumCreateClmm(mint1: PublicKey, mint2: PublicKey, configId: PublicKey, initialPrice: Decimal, startTime: BN): Promise<string>;
    raydiumCreateCpmm(mint1: PublicKey, mint2: PublicKey, configId: PublicKey, mintAAmount: BN, mintBAmount: BN, startTime: BN): Promise<string>;
    openbookCreateMarket(baseMint: PublicKey, quoteMint: PublicKey, lotSize?: number, tickSize?: number): Promise<string[]>;
    manifestCreateMarket(baseMint: PublicKey, quoteMint: PublicKey): Promise<string[]>;
    getPythPriceFeedID(tokenSymbol: string): Promise<string>;
    getPythPrice(priceFeedID: string): Promise<string>;
    createGibworkTask(title: string, content: string, requirements: string, tags: string[], tokenMintAddress: string, tokenAmount: number, payer?: string): Promise<GibworkCreateTaskReponse>;
    rockPaperScissors(amount: number, choice: "rock" | "paper" | "scissors"): Promise<string>;
    createTiplink(amount: number, splmintAddress?: PublicKey): Promise<{
        url: string;
        signature: string;
    }>;
    tensorListNFT(nftMint: PublicKey, price: number): Promise<string>;
    tensorCancelListing(nftMint: PublicKey): Promise<string>;
    closeEmptyTokenAccounts(): Promise<{
        signature: string;
        size: number;
    }>;
    fetchTokenReportSummary(mint: string): Promise<TokenCheck>;
    fetchTokenDetailedReport(mint: string): Promise<TokenCheck>;
    /**
     * Opens a new trading position on Flash.Trade
     * @param params Flash trade parameters including market, side, collateral, leverage, and pool name
     * @returns Transaction signature
     */
    flashOpenTrade(params: FlashTradeParams): Promise<string>;
    /**
     * Closes an existing trading position on Flash.Trade
     * @param params Flash trade close parameters
     * @returns Transaction signature
     */
    flashCloseTrade(params: FlashCloseTradeParams): Promise<string>;
    heliusParseTransactions(transactionId: string): Promise<any>;
    getAllAssetsbyOwner(owner: PublicKey, limit: number): Promise<any>;
    create3LandCollection(collectionOpts: CreateCollectionOptions, isDevnet?: boolean, priorityFeeParam?: number): Promise<string>;
    create3LandNft(collectionAccount: string, createItemOptions: CreateSingleOptions, isDevnet?: boolean, withPool?: boolean, priorityFeeParam?: number): Promise<string>;
    sendTranctionWithPriority(priorityLevel: string, amount: number, to: PublicKey, splmintAddress?: PublicKey): Promise<{
        transactionId: string;
        fee: number;
    }>;
    createSquadsMultisig(creator: PublicKey): Promise<string>;
    depositToMultisig(amount: number, vaultIndex?: number, mint?: PublicKey): Promise<string>;
    transferFromMultisig(amount: number, to: PublicKey, vaultIndex?: number, mint?: PublicKey): Promise<string>;
    createMultisigProposal(transactionIndex?: number | bigint): Promise<string>;
    approveMultisigProposal(transactionIndex?: number | bigint): Promise<string>;
    rejectMultisigProposal(transactionIndex?: number | bigint): Promise<string>;
    executeMultisigTransaction(transactionIndex?: number | bigint): Promise<string>;
    CreateWebhook(accountAddresses: string[], webhookURL: string): Promise<HeliusWebhookResponse>;
    getWebhook(id: string): Promise<HeliusWebhookIdResponse>;
    deleteWebhook(webhookID: string): Promise<any>;
    createDriftUserAccount(depositAmount: number, depositSymbol: string): Promise<{
        txSignature: string;
        account: PublicKey;
        message?: never;
    } | {
        message: string;
        account: PublicKey;
        txSignature?: never;
    }>;
    createDriftVault(params: {
        name: string;
        marketName: `${string}-${string}`;
        redeemPeriod: number;
        maxTokens: number;
        minDepositAmount: number;
        managementFee: number;
        profitShare: number;
        hurdleRate?: number;
        permissioned?: boolean;
    }): Promise<string>;
    depositIntoDriftVault(amount: number, vault: string): Promise<string>;
    depositToDriftUserAccount(amount: number, symbol: string, isRepayment?: boolean): Promise<import("@drift-labs/sdk").TxSigAndSlot>;
    deriveDriftVaultAddress(name: string): Promise<PublicKey>;
    doesUserHaveDriftAccount(): Promise<{
        hasAccount: boolean;
        account: PublicKey;
    }>;
    driftUserAccountInfo(): Promise<{
        name: number[];
        authority: PublicKey;
        settledPerpPnl: string;
        lastActiveSlot: number;
        perpPositions: {
            baseAssetAmount: number;
            settledPnl: number;
            lastCumulativeFundingRate: BN;
            marketIndex: number;
            quoteAssetAmount: BN;
            quoteEntryAmount: BN;
            quoteBreakEvenAmount: BN;
            openOrders: number;
            openBids: BN;
            openAsks: BN;
            lpShares: BN;
            remainderBaseAssetAmount: number;
            lastBaseAssetAmountPerLp: BN;
            lastQuoteAssetAmountPerLp: BN;
            perLpBase: number;
        }[];
        spotPositions: {
            availableBalance: number;
            symbol: string | undefined;
            marketIndex: number;
            balanceType: import("@drift-labs/sdk").SpotBalanceType;
            scaledBalance: BN;
            openOrders: number;
            openBids: BN;
            openAsks: BN;
            cumulativeDeposits: BN;
        }[];
        delegate: PublicKey;
        subAccountId: number;
        orders: import("@drift-labs/sdk").Order[];
        status: number;
        nextLiquidationId: number;
        nextOrderId: number;
        maxMarginRatio: number;
        lastAddPerpLpSharesTs: BN;
        totalDeposits: BN;
        totalWithdraws: BN;
        totalSocialLoss: BN;
        cumulativePerpFunding: BN;
        cumulativeSpotFees: BN;
        liquidationMarginFreed: BN;
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
    requestWithdrawalFromDriftVault(amount: number, vault: string): Promise<string>;
    tradeUsingDelegatedDriftVault(vault: string, amount: number, symbol: string, action: "long" | "short", type: "market" | "limit", price?: number): Promise<import("@drift-labs/sdk").TxSigAndSlot>;
    addLiquidityToDelegatedDriftVault(vault: string, symbol: string, amount: number): Promise<string>;
    removeLiquidityFromDelegatedDriftVault(vault: string, symbol: string): Promise<string>;
    tradeUsingDriftPerpAccount(amount: number, symbol: string, action: "long" | "short", type: "market" | "limit", price?: number): Promise<string>;
    updateDriftVault(vaultAddress: string, params: {
        name: string;
        marketName: `${string}-${string}`;
        redeemPeriod: number;
        maxTokens: number;
        minDepositAmount: number;
        managementFee: number;
        profitShare: number;
        hurdleRate?: number;
        permissioned?: boolean;
    }): Promise<string>;
    getDriftVaultInfo(vaultName: string): Promise<{
        name: string;
        delegate: string;
        address: string;
        marketName: string;
        balance: string;
        redeemPeriod: number;
        maxTokens: number;
        minDepositAmount: number;
        managementFee: number;
        profitShare: number;
        hurdleRate: number;
        permissioned: boolean;
    }>;
    withdrawFromDriftAccount(amount: number, symbol: string, isBorrow?: boolean): Promise<import("@drift-labs/sdk").TxSigAndSlot>;
    withdrawFromDriftVault(vault: string): Promise<string>;
    updateDriftVaultDelegate(vaultAddress: string, delegate: string): Promise<string>;
    getAvailableDriftMarkets(type?: "spot" | "perp"): import("@drift-labs/sdk").SpotMarketConfig[] | import("@drift-labs/sdk").PerpMarketConfig[] | {
        spot: import("@drift-labs/sdk").SpotMarketConfig[];
        perp: import("@drift-labs/sdk").PerpMarketConfig[];
    };
    stakeToDriftInsuranceFund(amount: number, symbol: string): Promise<string>;
    requestUnstakeFromDriftInsuranceFund(amount: number, symbol: string): Promise<string>;
    unstakeFromDriftInsuranceFund(symbol: string): Promise<string>;
    driftSpotTokenSwap(params: {
        fromSymbol: string;
        toSymbol: string;
        slippage?: number;
    } & ({
        toAmount: number;
    } | {
        fromAmount: number;
    })): Promise<string>;
    getPerpMarketFundingRate(symbol: `${string}-PERP`, period?: "year" | "hour"): Promise<{
        longRate: number;
        shortRate: number;
        friendlyString: string;
    }>;
    getEntryQuoteOfPerpTrade(amount: number, symbol: `${string}-PERP`, action: "short" | "long"): Promise<{
        entryPrice: number;
        priceImpact: number;
        bestPrice: number;
        worstPrice: number;
    }>;
    getLendAndBorrowAPY(symbol: string): Promise<{
        lendingAPY: number;
        borrowAPY: number;
    }>;
    voltrDepositStrategy(depositAmount: BN, vault: PublicKey, strategy: PublicKey): Promise<string>;
    voltrWithdrawStrategy(withdrawAmount: BN, vault: PublicKey, strategy: PublicKey): Promise<string>;
    voltrGetPositionValues(vault: PublicKey): Promise<string>;
    getAsset(assetId: string): Promise<DasApiAsset>;
    getAssetsByAuthority(params: GetAssetsByAuthorityRpcInput): Promise<DasApiAssetList>;
    getAssetsByCreator(params: GetAssetsByCreatorRpcInput): Promise<DasApiAssetList>;
    getPriceInference(tokenSymbol: string, timeframe: string): Promise<string>;
    getAllTopics(): Promise<AlloraTopic[]>;
    getInferenceByTopicId(topicId: number): Promise<AlloraInference>;
}
//# sourceMappingURL=index.d.ts.map