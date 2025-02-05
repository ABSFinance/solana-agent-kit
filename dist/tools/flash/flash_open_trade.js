"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flashOpenTrade = flashOpenTrade;
const web3_js_1 = require("@solana/web3.js");
const flash_sdk_1 = require("flash-sdk");
const anchor_1 = require("@coral-xyz/anchor");
const flashUtils_1 = require("../../utils/flashUtils");
/**
 * Opens a new position on Flash.Trade
 * @param agent SolanaAgentKit instance
 * @param params Trade parameters
 * @returns Transaction signature
 */
async function flashOpenTrade(agent, params) {
    try {
        const { token, side, collateralUsd, leverage } = params;
        // Get market ID from token and side using marketTokenMap
        const tokenMarkets = flashUtils_1.marketTokenMap[token];
        if (!tokenMarkets) {
            throw new Error(`Token ${token} not supported for trading`);
        }
        const sideEntry = tokenMarkets[side];
        if (!sideEntry) {
            throw new Error(`${side} side not available for ${token}`);
        }
        const market = sideEntry.marketID;
        // Validate market data using marketSdkInfo
        const marketData = flashUtils_1.marketSdkInfo[market];
        if (!marketData) {
            throw new Error(`Invalid market configuration for ${token}/${side}`);
        }
        // Get token information
        const [targetSymbol, collateralSymbol] = marketData.tokenPair.split("/");
        const targetToken = flashUtils_1.ALL_TOKENS.find((t) => t.symbol === targetSymbol);
        const collateralToken = flashUtils_1.ALL_TOKENS.find((t) => t.symbol === collateralSymbol);
        if (!targetToken || !collateralToken) {
            throw new Error(`Token not found for pair ${marketData.tokenPair}`);
        }
        // Fetch oracle prices
        const [targetPrice, collateralPrice] = await Promise.all([
            (0, flashUtils_1.fetchOraclePrice)(targetSymbol),
            (0, flashUtils_1.fetchOraclePrice)(collateralSymbol),
        ]);
        // Initialize pool configuration and perpClient
        const poolConfig = flash_sdk_1.PoolConfig.fromIdsByName(marketData.pool, "mainnet-beta");
        const perpClient = (0, flashUtils_1.createPerpClient)(agent.connection, agent.wallet);
        // Calculate position parameters
        const leverageBN = new anchor_1.BN(leverage);
        const collateralTokenPrice = convertPriceToNumber(collateralPrice.price);
        const collateralAmount = calculateCollateralAmount(collateralUsd, collateralTokenPrice, collateralToken.decimals);
        // Get custody accounts
        const { targetCustody, collateralCustody } = await fetchCustodyAccounts(perpClient, poolConfig, targetSymbol, collateralSymbol);
        // Calculate position size
        const positionSize = calculatePositionSize(perpClient, collateralAmount, leverageBN, targetToken, collateralToken, side, targetPrice.price, collateralPrice.price, targetCustody, collateralCustody);
        // Get NFT trading account info
        const tradingAccounts = await (0, flashUtils_1.getNftTradingAccountInfo)(agent.wallet_address, perpClient, poolConfig, collateralSymbol);
        if (!tradingAccounts.nftTradingAccountPk ||
            !tradingAccounts.nftReferralAccountPK) {
            throw new Error("Required NFT trading accounts not found");
        }
        // Prepare transaction
        const slippageBps = new anchor_1.BN(1000);
        const priceWithSlippage = perpClient.getPriceAfterSlippage(true, slippageBps, targetPrice.price, side === "long" ? flash_sdk_1.Side.Long : flash_sdk_1.Side.Short);
        // Build and send transaction
        const { instructions, additionalSigners } = await perpClient.openPosition(targetSymbol, collateralSymbol, priceWithSlippage, collateralAmount, positionSize, side === "long" ? flash_sdk_1.Side.Long : flash_sdk_1.Side.Short, poolConfig, (0, flashUtils_1.get_flash_privilege)(agent), tradingAccounts.nftTradingAccountPk, tradingAccounts.nftReferralAccountPK, tradingAccounts.nftOwnerRebateTokenAccountPk, false);
        const computeBudgetIx = web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({
            units: flashUtils_1.OPEN_POSITION_CU,
        });
        return await perpClient.sendTransaction([computeBudgetIx, ...instructions], {
            additionalSigners: additionalSigners,
            alts: perpClient.addressLookupTables,
            prioritizationFee: 5000000,
        });
    }
    catch (error) {
        throw new Error(`Flash trade failed: ${error}`);
    }
}
// Helper functions
function convertPriceToNumber(oraclePrice) {
    const price = parseInt(oraclePrice.price.toString("hex"), 16);
    const exponent = parseInt(oraclePrice.exponent.toString("hex"), 16);
    return price * Math.pow(10, exponent);
}
function calculateCollateralAmount(usdAmount, tokenPrice, decimals) {
    return new anchor_1.BN((usdAmount / tokenPrice) * Math.pow(10, decimals));
}
async function fetchCustodyAccounts(perpClient, poolConfig, targetSymbol, collateralSymbol) {
    const targetConfig = poolConfig.custodies.find((c) => c.symbol === targetSymbol);
    const collateralConfig = poolConfig.custodies.find((c) => c.symbol === collateralSymbol);
    if (!targetConfig || !collateralConfig) {
        throw new Error("Custody configuration not found");
    }
    const accounts = await perpClient.provider.connection.getMultipleAccountsInfo([targetConfig.custodyAccount, collateralConfig.custodyAccount]);
    if (!accounts[0] || !accounts[1]) {
        throw new Error("Failed to fetch custody accounts");
    }
    return {
        targetCustody: flash_sdk_1.CustodyAccount.from(targetConfig.custodyAccount, perpClient.program.coder.accounts.decode("custody", accounts[0].data)),
        collateralCustody: flash_sdk_1.CustodyAccount.from(collateralConfig.custodyAccount, perpClient.program.coder.accounts.decode("custody", accounts[1].data)),
    };
}
function calculatePositionSize(perpClient, collateralAmount, leverage, targetToken, collateralToken, side, targetPrice, collateralPrice, targetCustody, collateralCustody) {
    return perpClient.getSizeAmountFromLeverageAndCollateral(collateralAmount, leverage.toString(), targetToken, collateralToken, side === "long" ? flash_sdk_1.Side.Long : flash_sdk_1.Side.Short, targetPrice, targetPrice, targetCustody, collateralPrice, collateralPrice, collateralCustody);
}
//# sourceMappingURL=flash_open_trade.js.map