"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const constants_1 = require("../constants");
const tools_1 = require("../tools");
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
class SolanaAgentKit {
    constructor(private_key, rpc_url, configOrKey) {
        this.connection = new web3_js_1.Connection(rpc_url || "https://api.mainnet-beta.solana.com");
        this.wallet = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(private_key));
        this.wallet_address = this.wallet.publicKey;
        // Handle both old and new patterns
        if (typeof configOrKey === "string" || configOrKey === null) {
            this.config = { OPENAI_API_KEY: configOrKey || "" };
        }
        else {
            this.config = configOrKey;
        }
    }
    // Tool methods
    async requestFaucetFunds() {
        return (0, tools_1.request_faucet_funds)(this);
    }
    async deployToken(name, uri, symbol, decimals = constants_1.DEFAULT_OPTIONS.TOKEN_DECIMALS, initialSupply) {
        return (0, tools_1.deploy_token)(this, name, uri, symbol, decimals, initialSupply);
    }
    async deployCollection(options) {
        return (0, tools_1.deploy_collection)(this, options);
    }
    async getBalance(token_address) {
        return (0, tools_1.get_balance)(this, token_address);
    }
    async getTokenBalances(wallet_address) {
        return (0, tools_1.get_token_balance)(this, wallet_address);
    }
    async getBalanceOther(walletAddress, tokenAddress) {
        return (0, tools_1.get_balance_other)(this, walletAddress, tokenAddress);
    }
    async mintNFT(collectionMint, metadata, recipient) {
        return (0, tools_1.mintCollectionNFT)(this, collectionMint, metadata, recipient);
    }
    async transfer(to, amount, mint) {
        return (0, tools_1.transfer)(this, to, amount, mint);
    }
    async registerDomain(name, spaceKB) {
        return (0, tools_1.registerDomain)(this, name, spaceKB);
    }
    async resolveSolDomain(domain) {
        return (0, tools_1.resolveSolDomain)(this, domain);
    }
    async getPrimaryDomain(account) {
        return (0, tools_1.getPrimaryDomain)(this, account);
    }
    async trade(outputMint, inputAmount, inputMint, slippageBps = constants_1.DEFAULT_OPTIONS.SLIPPAGE_BPS) {
        return (0, tools_1.trade)(this, outputMint, inputAmount, inputMint, slippageBps);
    }
    async limitOrder(marketId, quantity, side, price) {
        return (0, tools_1.limitOrder)(this, marketId, quantity, side, price);
    }
    async batchOrder(marketId, orders) {
        return (0, tools_1.batchOrder)(this, marketId, orders);
    }
    async cancelAllOrders(marketId) {
        return (0, tools_1.cancelAllOrders)(this, marketId);
    }
    async withdrawAll(marketId) {
        return (0, tools_1.withdrawAll)(this, marketId);
    }
    async openPerpTradeLong(args) {
        return (0, tools_1.openPerpTradeLong)({
            agent: this,
            ...args,
        });
    }
    async openPerpTradeShort(args) {
        return (0, tools_1.openPerpTradeShort)({
            agent: this,
            ...args,
        });
    }
    async closePerpTradeShort(args) {
        return (0, tools_1.closePerpTradeShort)({
            agent: this,
            ...args,
        });
    }
    async closePerpTradeLong(args) {
        return (0, tools_1.closePerpTradeLong)({
            agent: this,
            ...args,
        });
    }
    async lendAssets(amount) {
        return (0, tools_1.lendAsset)(this, amount);
    }
    async luloLend(mintAddress, amount) {
        return (0, tools_1.luloLend)(this, mintAddress, amount);
    }
    async luloWithdraw(mintAddress, amount) {
        return (0, tools_1.luloWithdraw)(this, mintAddress, amount);
    }
    async getTPS() {
        return (0, tools_1.getTPS)(this);
    }
    async getTokenDataByAddress(mint) {
        return (0, tools_1.getTokenDataByAddress)(new web3_js_1.PublicKey(mint));
    }
    async getTokenDataByTicker(ticker) {
        return (0, tools_1.getTokenDataByTicker)(ticker);
    }
    async fetchTokenPrice(mint) {
        return (0, tools_1.fetchPrice)(new web3_js_1.PublicKey(mint));
    }
    async launchPumpFunToken(tokenName, tokenTicker, description, imageUrl, options) {
        return (0, tools_1.launchPumpFunToken)(this, tokenName, tokenTicker, description, imageUrl, options);
    }
    async stake(amount) {
        return (0, tools_1.stakeWithJup)(this, amount);
    }
    async restake(amount) {
        return (0, tools_1.stakeWithSolayer)(this, amount);
    }
    async sendCompressedAirdrop(mintAddress, amount, decimals, recipients, priorityFeeInLamports, shouldLog) {
        return await (0, tools_1.sendCompressedAirdrop)(this, new web3_js_1.PublicKey(mintAddress), amount, decimals, recipients.map((recipient) => new web3_js_1.PublicKey(recipient)), priorityFeeInLamports, shouldLog);
    }
    async meteoraCreateDynamicPool(tokenAMint, tokenBMint, tokenAAmount, tokenBAmount, tradeFeeNumerator, activationPoint, hasAlphaVault, activationType) {
        return (0, tools_1.createMeteoraDynamicAMMPool)(this, tokenAMint, tokenBMint, tokenAAmount, tokenBAmount, {
            tradeFeeNumerator,
            activationPoint,
            hasAlphaVault,
            activationType,
            padding: new Array(90).fill(0),
        });
    }
    async meteoraCreateDlmmPool(tokenAMint, tokenBMint, binStep, initialPrice, priceRoundingUp, feeBps, activationType, hasAlphaVault, activationPoint) {
        return (0, tools_1.createMeteoraDlmmPool)(this, binStep, tokenAMint, tokenBMint, initialPrice, priceRoundingUp, feeBps, activationType, hasAlphaVault, activationPoint);
    }
    async orcaClosePosition(positionMintAddress) {
        return (0, tools_1.orcaClosePosition)(this, positionMintAddress);
    }
    async orcaCreateCLMM(mintDeploy, mintPair, initialPrice, feeTier) {
        return (0, tools_1.orcaCreateCLMM)(this, mintDeploy, mintPair, initialPrice, feeTier);
    }
    async orcaCreateSingleSidedLiquidityPool(depositTokenAmount, depositTokenMint, otherTokenMint, initialPrice, maxPrice, feeTier) {
        return (0, tools_1.orcaCreateSingleSidedLiquidityPool)(this, depositTokenAmount, depositTokenMint, otherTokenMint, initialPrice, maxPrice, feeTier);
    }
    async orcaFetchPositions() {
        return (0, tools_1.orcaFetchPositions)(this);
    }
    async orcaOpenCenteredPositionWithLiquidity(whirlpoolAddress, priceOffsetBps, inputTokenMint, inputAmount) {
        return (0, tools_1.orcaOpenCenteredPositionWithLiquidity)(this, whirlpoolAddress, priceOffsetBps, inputTokenMint, inputAmount);
    }
    async orcaOpenSingleSidedPosition(whirlpoolAddress, distanceFromCurrentPriceBps, widthBps, inputTokenMint, inputAmount) {
        return (0, tools_1.orcaOpenSingleSidedPosition)(this, whirlpoolAddress, distanceFromCurrentPriceBps, widthBps, inputTokenMint, inputAmount);
    }
    async resolveAllDomains(domain) {
        return (0, tools_1.resolveAllDomains)(this, domain);
    }
    async getOwnedAllDomains(owner) {
        return (0, tools_1.getOwnedAllDomains)(this, owner);
    }
    async getOwnedDomainsForTLD(tld) {
        return (0, tools_1.getOwnedDomainsForTLD)(this, tld);
    }
    async getAllDomainsTLDs() {
        return (0, tools_1.getAllDomainsTLDs)(this);
    }
    async getAllRegisteredAllDomains() {
        return (0, tools_1.getAllRegisteredAllDomains)(this);
    }
    async getMainAllDomainsDomain(owner) {
        return (0, tools_1.getMainAllDomainsDomain)(this, owner);
    }
    async raydiumCreateAmmV4(marketId, baseAmount, quoteAmount, startTime) {
        return (0, tools_1.raydiumCreateAmmV4)(this, marketId, baseAmount, quoteAmount, startTime);
    }
    async raydiumCreateClmm(mint1, mint2, configId, initialPrice, startTime) {
        return (0, tools_1.raydiumCreateClmm)(this, mint1, mint2, configId, initialPrice, startTime);
    }
    async raydiumCreateCpmm(mint1, mint2, configId, mintAAmount, mintBAmount, startTime) {
        return (0, tools_1.raydiumCreateCpmm)(this, mint1, mint2, configId, mintAAmount, mintBAmount, startTime);
    }
    async openbookCreateMarket(baseMint, quoteMint, lotSize = 1, tickSize = 0.01) {
        return (0, tools_1.openbookCreateMarket)(this, baseMint, quoteMint, lotSize, tickSize);
    }
    async manifestCreateMarket(baseMint, quoteMint) {
        return (0, tools_1.manifestCreateMarket)(this, baseMint, quoteMint);
    }
    async getPythPriceFeedID(tokenSymbol) {
        return (0, tools_1.fetchPythPriceFeedID)(tokenSymbol);
    }
    async getPythPrice(priceFeedID) {
        return (0, tools_1.fetchPythPrice)(priceFeedID);
    }
    async createGibworkTask(title, content, requirements, tags, tokenMintAddress, tokenAmount, payer) {
        return (0, tools_1.create_gibwork_task)(this, title, content, requirements, tags, new web3_js_1.PublicKey(tokenMintAddress), tokenAmount, payer ? new web3_js_1.PublicKey(payer) : undefined);
    }
    async rockPaperScissors(amount, choice) {
        return (0, tools_1.rock_paper_scissor)(this, amount, choice);
    }
    async createTiplink(amount, splmintAddress) {
        return (0, tools_1.create_TipLink)(this, amount, splmintAddress);
    }
    async tensorListNFT(nftMint, price) {
        return (0, tools_1.listNFTForSale)(this, nftMint, price);
    }
    async tensorCancelListing(nftMint) {
        return (0, tools_1.cancelListing)(this, nftMint);
    }
    async closeEmptyTokenAccounts() {
        return (0, tools_1.closeEmptyTokenAccounts)(this);
    }
    async fetchTokenReportSummary(mint) {
        return (0, tools_1.fetchTokenReportSummary)(mint);
    }
    async fetchTokenDetailedReport(mint) {
        return (0, tools_1.fetchTokenDetailedReport)(mint);
    }
    /**
     * Opens a new trading position on Flash.Trade
     * @param params Flash trade parameters including market, side, collateral, leverage, and pool name
     * @returns Transaction signature
     */
    async flashOpenTrade(params) {
        return (0, tools_1.flashOpenTrade)(this, params);
    }
    /**
     * Closes an existing trading position on Flash.Trade
     * @param params Flash trade close parameters
     * @returns Transaction signature
     */
    async flashCloseTrade(params) {
        return (0, tools_1.flashCloseTrade)(this, params);
    }
    async heliusParseTransactions(transactionId) {
        return (0, tools_1.parseTransaction)(this, transactionId);
    }
    async getAllAssetsbyOwner(owner, limit) {
        return (0, tools_1.getAssetsByOwner)(this, owner, limit);
    }
    async create3LandCollection(collectionOpts, isDevnet = false, priorityFeeParam) {
        const optionsWithBase58 = {
            privateKey: this.wallet.secretKey,
        };
        if (isDevnet) {
            optionsWithBase58.isMainnet = false;
        }
        else {
            optionsWithBase58.isMainnet = true;
        }
        const tx = await (0, tools_1.createCollection)(optionsWithBase58, collectionOpts, priorityFeeParam);
        return `Transaction: ${tx}`;
    }
    async create3LandNft(collectionAccount, createItemOptions, isDevnet = false, withPool = false, priorityFeeParam) {
        const optionsWithBase58 = {
            privateKey: this.wallet.secretKey,
        };
        if (isDevnet) {
            optionsWithBase58.isMainnet = false;
        }
        else {
            optionsWithBase58.isMainnet = true;
        }
        const tx = await (0, tools_1.createSingle)(optionsWithBase58, collectionAccount, createItemOptions, !isDevnet, withPool, priorityFeeParam);
        return `Transaction: ${tx}`;
    }
    async sendTranctionWithPriority(priorityLevel, amount, to, splmintAddress) {
        return (0, tools_1.sendTransactionWithPriorityFee)(this, priorityLevel, amount, to, splmintAddress);
    }
    async createSquadsMultisig(creator) {
        return (0, tools_1.create_squads_multisig)(this, creator);
    }
    async depositToMultisig(amount, vaultIndex = 0, mint) {
        return (0, tools_1.multisig_deposit_to_treasury)(this, amount, vaultIndex, mint);
    }
    async transferFromMultisig(amount, to, vaultIndex = 0, mint) {
        return (0, tools_1.multisig_transfer_from_treasury)(this, amount, to, vaultIndex, mint);
    }
    async createMultisigProposal(transactionIndex) {
        return (0, tools_1.multisig_create_proposal)(this, transactionIndex);
    }
    async approveMultisigProposal(transactionIndex) {
        return (0, tools_1.multisig_approve_proposal)(this, transactionIndex);
    }
    async rejectMultisigProposal(transactionIndex) {
        return (0, tools_1.multisig_reject_proposal)(this, transactionIndex);
    }
    async executeMultisigTransaction(transactionIndex) {
        return (0, tools_1.multisig_execute_proposal)(this, transactionIndex);
    }
    async CreateWebhook(accountAddresses, webhookURL) {
        return (0, tools_1.create_HeliusWebhook)(this, accountAddresses, webhookURL);
    }
    async getWebhook(id) {
        return (0, tools_1.getHeliusWebhook)(this, id);
    }
    async deleteWebhook(webhookID) {
        return (0, tools_1.deleteHeliusWebhook)(this, webhookID);
    }
    async createDriftUserAccount(depositAmount, depositSymbol) {
        return await (0, tools_1.createDriftUserAccount)(this, depositAmount, depositSymbol);
    }
    async createDriftVault(params) {
        return await (0, tools_1.createVault)(this, params);
    }
    async depositIntoDriftVault(amount, vault) {
        return await (0, tools_1.depositIntoVault)(this, amount, vault);
    }
    async depositToDriftUserAccount(amount, symbol, isRepayment) {
        return await (0, tools_1.depositToDriftUserAccount)(this, amount, symbol, isRepayment);
    }
    async deriveDriftVaultAddress(name) {
        return await (0, tools_1.getVaultAddress)(this, name);
    }
    async doesUserHaveDriftAccount() {
        return await (0, tools_1.doesUserHaveDriftAccount)(this);
    }
    async driftUserAccountInfo() {
        return await (0, tools_1.driftUserAccountInfo)(this);
    }
    async requestWithdrawalFromDriftVault(amount, vault) {
        return await (0, tools_1.requestWithdrawalFromVault)(this, amount, vault);
    }
    async tradeUsingDelegatedDriftVault(vault, amount, symbol, action, type, price) {
        return await (0, tools_1.tradeDriftVault)(this, vault, amount, symbol, action, type, price);
    }
    async addLiquidityToDelegatedDriftVault(vault, symbol, amount) {
        return await (0, tools_1.addLiquidityBalToDriftVault)(this, vault, symbol, // PERP market symbol
        amount);
    }
    async removeLiquidityFromDelegatedDriftVault(vault, symbol) {
        return await (0, tools_1.removeLiquidityBalFromDriftVault)(this, vault, symbol);
    }
    async tradeUsingDriftPerpAccount(amount, symbol, action, type, price) {
        return await (0, tools_1.driftPerpTrade)(this, { action, amount, symbol, type, price });
    }
    async updateDriftVault(vaultAddress, params) {
        return await (0, tools_1.updateVault)(this, vaultAddress, params);
    }
    async getDriftVaultInfo(vaultName) {
        return await (0, tools_1.getVaultInfo)(this, vaultName);
    }
    async withdrawFromDriftAccount(amount, symbol, isBorrow) {
        return await (0, tools_1.withdrawFromDriftUserAccount)(this, amount, symbol, isBorrow);
    }
    async withdrawFromDriftVault(vault) {
        return await (0, tools_1.withdrawFromDriftVault)(this, vault);
    }
    async updateDriftVaultDelegate(vaultAddress, delegate) {
        return await (0, tools_1.updateVaultDelegate)(this, vaultAddress, delegate);
    }
    getAvailableDriftMarkets(type) {
        switch (type) {
            case "spot":
                return (0, tools_1.getAvailableDriftSpotMarkets)();
            case "perp":
                return (0, tools_1.getAvailableDriftPerpMarkets)();
            default:
                return {
                    spot: (0, tools_1.getAvailableDriftSpotMarkets)(),
                    perp: (0, tools_1.getAvailableDriftPerpMarkets)(),
                };
        }
    }
    async stakeToDriftInsuranceFund(amount, symbol) {
        return await (0, tools_1.stakeToDriftInsuranceFund)(this, amount, symbol);
    }
    async requestUnstakeFromDriftInsuranceFund(amount, symbol) {
        return await (0, tools_1.requestUnstakeFromDriftInsuranceFund)(this, amount, symbol);
    }
    async unstakeFromDriftInsuranceFund(symbol) {
        return await (0, tools_1.unstakeFromDriftInsuranceFund)(this, symbol);
    }
    async driftSpotTokenSwap(params) {
        return await (0, tools_1.swapSpotToken)(this, {
            fromSymbol: params.fromSymbol,
            toSymbol: params.toSymbol,
            // @ts-expect-error - fromAmount and toAmount are mutually exclusive
            fromAmount: params.fromAmount,
            // @ts-expect-error - fromAmount and toAmount are mutually exclusive
            toAmount: params.toAmount,
            slippage: params.slippage,
        });
    }
    async getPerpMarketFundingRate(symbol, period = "year") {
        return (0, tools_1.calculatePerpMarketFundingRate)(this, symbol, period);
    }
    async getEntryQuoteOfPerpTrade(amount, symbol, action) {
        return (0, tools_1.getEntryQuoteOfPerpTrade)(symbol, amount, action);
    }
    async getLendAndBorrowAPY(symbol) {
        return (0, tools_1.getLendingAndBorrowAPY)(this, symbol);
    }
    async voltrDepositStrategy(depositAmount, vault, strategy) {
        return (0, tools_1.voltrDepositStrategy)(this, depositAmount, vault, strategy);
    }
    async voltrWithdrawStrategy(withdrawAmount, vault, strategy) {
        return (0, tools_1.voltrWithdrawStrategy)(this, withdrawAmount, vault, strategy);
    }
    async voltrGetPositionValues(vault) {
        return (0, tools_1.voltrGetPositionValues)(this, vault);
    }
    async getAsset(assetId) {
        return (0, tools_1.get_asset)(this, assetId);
    }
    async getAssetsByAuthority(params) {
        return (0, tools_1.get_assets_by_authority)(this, params);
    }
    async getAssetsByCreator(params) {
        return (0, tools_1.get_assets_by_creator)(this, params);
    }
    async getPriceInference(tokenSymbol, timeframe) {
        return (0, tools_1.getPriceInference)(this, tokenSymbol, timeframe);
    }
    async getAllTopics() {
        return (0, tools_1.getAllTopics)(this);
    }
    async getInferenceByTopicId(topicId) {
        return (0, tools_1.getInferenceByTopicId)(this, topicId);
    }
}
exports.default = SolanaAgentKit;
//# sourceMappingURL=index.js.map