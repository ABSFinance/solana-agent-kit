/**
 * Fetch the price feed ID for a given token symbol from Pyth
 * @param tokenSymbol Token symbol
 * @returns Price feed ID
 */
export declare function fetchPythPriceFeedID(tokenSymbol: string): Promise<string>;
/**
 * Fetch the price of a given price feed from Pyth
 * @param priceFeedID Price feed ID
 * @returns Latest price value from feed
 *
 * You can find priceFeedIDs here: https://www.pyth.network/developers/price-feed-ids#stable
 */
export declare function fetchPythPrice(feedID: string): Promise<string>;
//# sourceMappingURL=pyth_fetch_price.d.ts.map