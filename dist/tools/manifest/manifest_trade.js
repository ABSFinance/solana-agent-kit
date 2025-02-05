"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manifestCreateMarket = manifestCreateMarket;
exports.limitOrder = limitOrder;
exports.cancelAllOrders = cancelAllOrders;
exports.withdrawAll = withdrawAll;
exports.generateOrdersfromPattern = generateOrdersfromPattern;
exports.batchOrder = batchOrder;
const manifest_sdk_1 = require("@cks-systems/manifest-sdk");
const web3_js_1 = require("@solana/web3.js");
async function manifestCreateMarket(agent, baseMint, quoteMint) {
    const marketKeypair = web3_js_1.Keypair.generate();
    const FIXED_MANIFEST_HEADER_SIZE = 256;
    const createAccountIx = web3_js_1.SystemProgram.createAccount({
        fromPubkey: agent.wallet.publicKey,
        newAccountPubkey: marketKeypair.publicKey,
        space: FIXED_MANIFEST_HEADER_SIZE,
        lamports: await agent.connection.getMinimumBalanceForRentExemption(FIXED_MANIFEST_HEADER_SIZE),
        programId: new web3_js_1.PublicKey("MNFSTqtC93rEfYHB6hF82sKdZpUDFWkViLByLd1k1Ms"),
    });
    const createMarketIx = manifest_sdk_1.ManifestClient["createMarketIx"](agent.wallet.publicKey, baseMint, quoteMint, marketKeypair.publicKey);
    const tx = new web3_js_1.Transaction();
    tx.add(createAccountIx);
    tx.add(createMarketIx);
    const signature = await (0, web3_js_1.sendAndConfirmTransaction)(agent.connection, tx, [
        agent.wallet,
        marketKeypair,
    ]);
    return [signature, marketKeypair.publicKey.toBase58()];
}
/**
 * Place limit orders using Manifest
 * @param agent SolanaAgentKit instance
 * @param marketId Public key for the manifest market
 * @param quantity Amount to trade in tokens
 * @param side Buy or Sell
 * @param price Price in tokens ie. SOL/USDC
 * @returns Transaction signature
 */
async function limitOrder(agent, marketId, quantity, side, price) {
    try {
        const mfxClient = await manifest_sdk_1.ManifestClient.getClientForMarket(agent.connection, marketId, agent.wallet);
        const orderParams = {
            numBaseTokens: quantity,
            tokenPrice: price,
            isBid: side === "Buy",
            lastValidSlot: 0,
            orderType: manifest_sdk_1.OrderType.Limit,
            clientOrderId: Number(Math.random() * 1000),
        };
        const depositPlaceOrderIx = await mfxClient.placeOrderWithRequiredDepositIx(agent.wallet.publicKey, orderParams);
        const signature = await (0, web3_js_1.sendAndConfirmTransaction)(agent.connection, new web3_js_1.Transaction().add(...depositPlaceOrderIx), [agent.wallet]);
        return signature;
    }
    catch (error) {
        throw new Error(`Limit Order failed: ${error.message}`);
    }
}
/**
 * Cancels all orders from Manifest
 * @param agent SolanaAgentKit instance
 * @param marketId Public key for the manifest market
 * @returns Transaction signature
 */
async function cancelAllOrders(agent, marketId) {
    try {
        const mfxClient = await manifest_sdk_1.ManifestClient.getClientForMarket(agent.connection, marketId, agent.wallet);
        const cancelAllOrdersIx = await mfxClient.cancelAllIx();
        const signature = await (0, web3_js_1.sendAndConfirmTransaction)(agent.connection, new web3_js_1.Transaction().add(cancelAllOrdersIx), [agent.wallet]);
        return signature;
    }
    catch (error) {
        throw new Error(`Cancel all orders failed: ${error.message}`);
    }
}
/**
 * Withdraws all funds from Manifest
 * @param agent SolanaAgentKit instance
 * @param marketId Public key for the manifest market
 * @returns Transaction signature
 */
async function withdrawAll(agent, marketId) {
    try {
        const mfxClient = await manifest_sdk_1.ManifestClient.getClientForMarket(agent.connection, marketId, agent.wallet);
        const withdrawAllIx = await mfxClient.withdrawAllIx();
        const signature = await (0, web3_js_1.sendAndConfirmTransaction)(agent.connection, new web3_js_1.Transaction().add(...withdrawAllIx), [agent.wallet]);
        return signature;
    }
    catch (error) {
        throw new Error(`Withdraw all failed: ${error.message}`);
    }
}
/**
 * Generates an array of orders based on the specified pattern
 */
function generateOrdersfromPattern(pattern) {
    const orders = [];
    // Random number of orders if not specified, max of 8
    const numOrders = pattern.numberOfOrders || Math.ceil(Math.random() * 8);
    // Calculate price points
    const prices = [];
    if (pattern.priceRange) {
        const { min, max } = pattern.priceRange;
        if (min && max) {
            // Generate evenly spaced prices
            for (let i = 0; i < numOrders; i++) {
                if (pattern.spacing?.type === "percentage") {
                    const factor = 1 + pattern.spacing.value / 100;
                    prices.push(min * Math.pow(factor, i));
                }
                else {
                    const step = (max - min) / (numOrders - 1);
                    prices.push(min + step * i);
                }
            }
        }
        else if (min) {
            // Generate prices starting from min with specified spacing
            for (let i = 0; i < numOrders; i++) {
                if (pattern.spacing?.type === "percentage") {
                    const factor = 1 + pattern.spacing.value / 100;
                    prices.push(min * Math.pow(factor, i));
                }
                else {
                    prices.push(min + (pattern.spacing?.value || 0.01) * i);
                }
            }
        }
    }
    // Calculate quantities
    let quantities = [];
    if (pattern.totalQuantity) {
        const individualQty = pattern.totalQuantity / numOrders;
        quantities = Array(numOrders).fill(individualQty);
    }
    else if (pattern.individualQuantity) {
        quantities = Array(numOrders).fill(pattern.individualQuantity);
    }
    // Generate orders
    for (let i = 0; i < numOrders; i++) {
        orders.push({
            side: pattern.side,
            price: prices[i],
            quantity: quantities[i],
        });
    }
    return orders;
}
/**
 * Validates that sell orders are not priced below buy orders
 * @param orders Array of order parameters to validate
 * @throws Error if orders are crossed
 */
function validateNoCrossedOrders(orders) {
    // Find lowest sell and highest buy prices
    let lowestSell = Number.MAX_SAFE_INTEGER;
    let highestBuy = 0;
    orders.forEach((order) => {
        if (order.side === "Sell" && order.price < lowestSell) {
            lowestSell = order.price;
        }
        if (order.side === "Buy" && order.price > highestBuy) {
            highestBuy = order.price;
        }
    });
    // Check if orders cross
    if (lowestSell <= highestBuy) {
        throw new Error(`Invalid order prices: Sell order at ${lowestSell} is lower than or equal to Buy order at ${highestBuy}. Orders cannot cross.`);
    }
}
/**
 * Place batch orders using Manifest
 * @param agent SolanaAgentKit instance
 * @param marketId Public key for the manifest market
 * @param quantity Amount to trade in tokens
 * @param side Buy or Sell
 * @param price Price in tokens ie. SOL/USDC
 * @returns Transaction signature
 */
async function batchOrder(agent, marketId, orders) {
    try {
        validateNoCrossedOrders(orders);
        const mfxClient = await manifest_sdk_1.ManifestClient.getClientForMarket(agent.connection, marketId, agent.wallet);
        const placeParams = orders.map((order) => ({
            numBaseTokens: order.quantity,
            tokenPrice: order.price,
            isBid: order.side === "Buy",
            lastValidSlot: 0,
            orderType: manifest_sdk_1.OrderType.Limit,
            clientOrderId: Number(Math.random() * 10000),
        }));
        const batchOrderIx = await mfxClient.batchUpdateIx(placeParams, [], true);
        const signature = await (0, web3_js_1.sendAndConfirmTransaction)(agent.connection, new web3_js_1.Transaction().add(batchOrderIx), [agent.wallet]);
        return signature;
    }
    catch (error) {
        throw new Error(`Batch Order failed: ${error.message}`);
    }
}
//# sourceMappingURL=manifest_trade.js.map