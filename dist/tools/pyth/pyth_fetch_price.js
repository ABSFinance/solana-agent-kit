"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPythPriceFeedID = fetchPythPriceFeedID;
exports.fetchPythPrice = fetchPythPrice;
const bn_js_1 = __importDefault(require("bn.js"));
/**
 * Fetch the price feed ID for a given token symbol from Pyth
 * @param tokenSymbol Token symbol
 * @returns Price feed ID
 */
async function fetchPythPriceFeedID(tokenSymbol) {
    try {
        const stableHermesServiceUrl = "https://hermes.pyth.network";
        const response = await fetch(`${stableHermesServiceUrl}/v2/price_feeds?query=${tokenSymbol}&asset_type=crypto`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.length === 0) {
            throw new Error(`No price feed found for ${tokenSymbol}`);
        }
        if (data.length > 1) {
            const filteredData = data.filter((item) => item.attributes.base.toLowerCase() === tokenSymbol.toLowerCase());
            if (filteredData.length === 0) {
                throw new Error(`No price feed found for ${tokenSymbol}`);
            }
            return filteredData[0].id;
        }
        return data[0].id;
    }
    catch (error) {
        throw new Error(`Fetching price feed ID from Pyth failed: ${error.message}`);
    }
}
/**
 * Fetch the price of a given price feed from Pyth
 * @param priceFeedID Price feed ID
 * @returns Latest price value from feed
 *
 * You can find priceFeedIDs here: https://www.pyth.network/developers/price-feed-ids#stable
 */
async function fetchPythPrice(feedID) {
    try {
        const stableHermesServiceUrl = "https://hermes.pyth.network";
        const response = await fetch(`${stableHermesServiceUrl}/v2/updates/price/latest?ids[]=${feedID}`);
        const data = await response.json();
        const parsedData = data.parsed;
        if (parsedData.length === 0) {
            throw new Error(`No price data found for ${feedID}`);
        }
        const price = new bn_js_1.default(parsedData[0].price.price);
        const exponent = parsedData[0].price.expo;
        if (exponent < 0) {
            const adjustedPrice = price.mul(new bn_js_1.default(100));
            const divisor = new bn_js_1.default(10).pow(new bn_js_1.default(-exponent));
            const scaledPrice = adjustedPrice.div(divisor);
            const priceStr = scaledPrice.toString();
            const formattedPrice = `${priceStr.slice(0, -2)}.${priceStr.slice(-2)}`;
            return formattedPrice.startsWith(".")
                ? `0${formattedPrice}`
                : formattedPrice;
        }
        const scaledPrice = price.div(new bn_js_1.default(10).pow(new bn_js_1.default(exponent)));
        return scaledPrice.toString();
    }
    catch (error) {
        throw new Error(`Fetching price from Pyth failed: ${error.message}`);
    }
}
//# sourceMappingURL=pyth_fetch_price.js.map