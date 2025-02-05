"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketTokenMap = exports.marketSdkInfo = exports.fetchOraclePrice = exports.PriceStatus = exports.CLOSE_POSITION_CU = exports.OPEN_POSITION_CU = exports.ALL_CUSTODIES = exports.ALL_TOKENS = exports.POOL_CONFIGS = void 0;
exports.getNftTradingAccountInfo = getNftTradingAccountInfo;
exports.createPerpClient = createPerpClient;
exports.get_flash_privilege = get_flash_privilege;
const hermes_client_1 = require("@pythnetwork/hermes-client");
const flash_sdk_1 = require("flash-sdk");
const anchor_1 = require("@coral-xyz/anchor");
const flash_sdk_2 = require("flash-sdk");
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const POOL_NAMES = [
    "Crypto.1",
    "Virtual.1",
    "Governance.1",
    "Community.1",
    "Community.2",
    "Community.3",
];
const DEFAULT_CLUSTER = "mainnet-beta";
exports.POOL_CONFIGS = POOL_NAMES.map((f) => flash_sdk_2.PoolConfig.fromIdsByName(f, DEFAULT_CLUSTER));
const DUPLICATE_TOKENS = exports.POOL_CONFIGS.map((f) => f.tokens).flat();
const tokenMap = new Map();
for (const token of DUPLICATE_TOKENS) {
    tokenMap.set(token.symbol, token);
}
exports.ALL_TOKENS = Array.from(tokenMap.values());
exports.ALL_CUSTODIES = exports.POOL_CONFIGS.map((f) => f.custodies).flat();
const PROGRAM_ID = exports.POOL_CONFIGS[0].programId;
// CU for trade instructions
exports.OPEN_POSITION_CU = 150000;
exports.CLOSE_POSITION_CU = 180000;
const HERMES_URL = "https://hermes.pyth.network"; // Replace with the actual Hermes URL if different
// Create a map of symbol to Pyth price ID
const PRICE_FEED_IDS = exports.ALL_TOKENS.reduce((acc, token) => {
    acc[token.symbol] = token.pythPriceId;
    return acc;
}, {});
const hermesClient = new hermes_client_1.HermesClient(HERMES_URL, {});
var PriceStatus;
(function (PriceStatus) {
    PriceStatus[PriceStatus["Trading"] = 0] = "Trading";
    PriceStatus[PriceStatus["Unknown"] = 1] = "Unknown";
    PriceStatus[PriceStatus["Halted"] = 2] = "Halted";
    PriceStatus[PriceStatus["Auction"] = 3] = "Auction";
})(PriceStatus || (exports.PriceStatus = PriceStatus = {}));
const fetchOraclePrice = async (symbol) => {
    const priceFeedId = PRICE_FEED_IDS[symbol];
    if (!priceFeedId) {
        throw new Error(`Price feed ID not found for symbol: ${symbol}`);
    }
    try {
        const hermesPriceFeed = await hermesClient.getPriceFeeds({
            query: symbol,
            filter: "crypto",
        });
        if (!hermesPriceFeed || hermesPriceFeed.length === 0) {
            throw new Error(`No price feed received for ${symbol}`);
        }
        const hemrmesPriceUdpate = await hermesClient.getLatestPriceUpdates([priceFeedId], {
            encoding: "hex",
            parsed: true,
        });
        if (!hemrmesPriceUdpate.parsed) {
            throw new Error(`No price feed received for ${symbol}`);
        }
        const hermesEma = hemrmesPriceUdpate.parsed[0].ema_price;
        const hermesPrice = hemrmesPriceUdpate.parsed[0].price;
        const hermesPriceOracle = new flash_sdk_1.OraclePrice({
            price: new anchor_1.BN(hermesPrice.price),
            exponent: new anchor_1.BN(hermesPrice.expo),
            confidence: new anchor_1.BN(hermesPrice.conf),
            timestamp: new anchor_1.BN(hermesPrice.publish_time),
        });
        const hermesEmaOracle = new flash_sdk_1.OraclePrice({
            price: new anchor_1.BN(hermesEma.price),
            exponent: new anchor_1.BN(hermesEma.expo),
            confidence: new anchor_1.BN(hermesEma.conf),
            timestamp: new anchor_1.BN(hermesEma.publish_time),
        });
        const token = exports.ALL_TOKENS.find((t) => t.pythPriceId === priceFeedId);
        if (!token) {
            throw new Error(`Token not found for price feed ID: ${priceFeedId}`);
        }
        const status = !token.isVirtual ? PriceStatus.Trading : PriceStatus.Unknown;
        const pythPriceEntry = {
            price: hermesPriceOracle,
            emaPrice: hermesEmaOracle,
            isStale: false,
            status: status,
        };
        return pythPriceEntry;
    }
    catch (error) {
        console.error(`Error in fetchOraclePrice for ${symbol}:`, error);
        throw error;
    }
};
exports.fetchOraclePrice = fetchOraclePrice;
const marketSdkInfo = {};
exports.marketSdkInfo = marketSdkInfo;
// Loop through POOL_CONFIGS to process each market
exports.POOL_CONFIGS.forEach((poolConfig) => {
    poolConfig.markets.forEach((market) => {
        const targetToken = exports.ALL_TOKENS.find((token) => token.mintKey.toString() === market.targetMint.toString());
        // Find collateral token by matching mintKey
        const collateralToken = exports.ALL_TOKENS.find((token) => token.mintKey.toString() === market.collateralMint.toString());
        if (targetToken?.symbol && collateralToken?.symbol) {
            marketSdkInfo[market.marketAccount.toString()] = {
                tokenPair: `${targetToken.symbol}/${collateralToken.symbol}`,
                token: targetToken.symbol,
                side: Object.keys(market.side)[0],
                pool: poolConfig.poolName,
            };
        }
    });
});
const marketTokenMap = {};
exports.marketTokenMap = marketTokenMap;
// Convert marketSdkInfo into marketTokenMap
Object.entries(marketSdkInfo).forEach(([marketID, info]) => {
    if (!marketTokenMap[info.token]) {
        marketTokenMap[info.token] = {};
    }
    marketTokenMap[info.token][info.side.toLowerCase()] = {
        marketID,
    };
});
async function getNftTradingAccountInfo(userPublicKey, perpClient, poolConfig, collateralCustodySymbol) {
    const getNFTReferralAccountPK = (publicKey) => {
        return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("referral"), publicKey.toBuffer()], PROGRAM_ID)[0];
    };
    const nftReferralAccountPK = getNFTReferralAccountPK(userPublicKey);
    const nftReferralAccountInfo = await perpClient.provider.connection.getAccountInfo(nftReferralAccountPK);
    let nftTradingAccountPk = null;
    let nftOwnerRebateTokenAccountPk = null;
    if (nftReferralAccountInfo) {
        const nftReferralAccountData = perpClient.program.coder.accounts.decode("referral", nftReferralAccountInfo.data);
        nftTradingAccountPk = nftReferralAccountData.refererTradingAccount;
        if (nftTradingAccountPk) {
            const nftTradingAccountInfo = await perpClient.provider.connection.getAccountInfo(nftTradingAccountPk);
            if (nftTradingAccountInfo) {
                const nftTradingAccount = perpClient.program.coder.accounts.decode("trading", nftTradingAccountInfo.data);
                nftOwnerRebateTokenAccountPk = (0, spl_token_1.getAssociatedTokenAddressSync)(poolConfig.getTokenFromSymbol(collateralCustodySymbol).mintKey, nftTradingAccount.owner);
                // Check if the account exists
                const accountExists = await perpClient.provider.connection.getAccountInfo(nftOwnerRebateTokenAccountPk);
                if (!accountExists) {
                    console.error("NFT owner rebate token account does not exist and may need to be created");
                }
            }
        }
    }
    return {
        nftReferralAccountPK,
        nftTradingAccountPk,
        nftOwnerRebateTokenAccountPk,
    };
}
/**
 * Creates a new PerpetualsClient instance with the given connection and wallet
 * @param connection Solana connection
 * @param wallet Solana wallet
 * @returns PerpetualsClient instance
 */
function createPerpClient(connection, wallet) {
    const provider = new anchor_1.AnchorProvider(connection, new anchor_1.Wallet(wallet), {
        commitment: "confirmed",
        preflightCommitment: "confirmed",
        skipPreflight: true,
    });
    return new flash_sdk_2.PerpetualsClient(provider, exports.POOL_CONFIGS[0].programId, exports.POOL_CONFIGS[0].perpComposibilityProgramId, exports.POOL_CONFIGS[0].fbNftRewardProgramId, exports.POOL_CONFIGS[0].rewardDistributionProgram.programId, {});
}
function get_flash_privilege(agent) {
    const FLASH_PRIVILEGE = agent.config.FLASH_PRIVILEGE || "None";
    switch (FLASH_PRIVILEGE.toLowerCase()) {
        case "referral":
            return flash_sdk_2.Privilege.Referral;
        case "nft":
            return flash_sdk_2.Privilege.NFT;
        default:
            return flash_sdk_2.Privilege.None;
    }
}
//# sourceMappingURL=flashUtils.js.map