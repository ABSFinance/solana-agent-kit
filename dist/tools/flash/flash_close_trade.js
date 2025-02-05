"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flashCloseTrade = flashCloseTrade;
const web3_js_1 = require("@solana/web3.js");
const flash_sdk_1 = require("flash-sdk");
const anchor_1 = require("@coral-xyz/anchor");
const flashUtils_1 = require("../../utils/flashUtils");
/**
 * Closes an existing position on Flash.Trade
 * @param agent SolanaAgentKit instance
 * @param params Trade parameters
 * @returns Transaction signature
 */
async function flashCloseTrade(agent, params) {
    try {
        const { token, side } = params;
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
        // Fetch oracle prices
        const [targetPrice] = await Promise.all([
            (0, flashUtils_1.fetchOraclePrice)(targetSymbol),
            (0, flashUtils_1.fetchOraclePrice)(collateralSymbol),
        ]);
        // Initialize pool configuration and perpClient
        const poolConfig = flash_sdk_1.PoolConfig.fromIdsByName(marketData.pool, "mainnet-beta");
        const perpClient = (0, flashUtils_1.createPerpClient)(agent.connection, agent.wallet);
        // Calculate price after slippage
        const slippageBpsBN = new anchor_1.BN(100); // 1% slippage
        const sideEnum = side === "long" ? flash_sdk_1.Side.Long : flash_sdk_1.Side.Short;
        const priceWithSlippage = perpClient.getPriceAfterSlippage(false, // isEntry = false for closing position
        slippageBpsBN, targetPrice.price, sideEnum);
        // Get NFT trading account info
        const tradingAccounts = await (0, flashUtils_1.getNftTradingAccountInfo)(agent.wallet_address, perpClient, poolConfig, collateralSymbol);
        if (!tradingAccounts.nftTradingAccountPk ||
            !tradingAccounts.nftReferralAccountPK ||
            !tradingAccounts.nftOwnerRebateTokenAccountPk) {
            throw new Error("Required NFT trading accounts not found");
        }
        // Build and send transaction
        const { instructions, additionalSigners } = await perpClient.closePosition(targetSymbol, collateralSymbol, priceWithSlippage, sideEnum, poolConfig, (0, flashUtils_1.get_flash_privilege)(agent), tradingAccounts.nftTradingAccountPk, tradingAccounts.nftReferralAccountPK, tradingAccounts.nftOwnerRebateTokenAccountPk);
        const computeBudgetIx = web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({
            units: flashUtils_1.CLOSE_POSITION_CU,
        });
        return await perpClient.sendTransaction([computeBudgetIx, ...instructions], {
            additionalSigners: additionalSigners,
            alts: perpClient.addressLookupTables,
            prioritizationFee: 5000000,
        });
    }
    catch (error) {
        throw new Error(`Flash trade close failed: ${error}`);
    }
}
//# sourceMappingURL=flash_close_trade.js.map