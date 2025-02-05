"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPriceInference = getPriceInference;
const allora_sdk_1 = require("@alloralabs/allora-sdk");
async function getPriceInference(agent, tokenSymbol, timeframe) {
    try {
        const chainSlug = agent.config.ALLORA_NETWORK === "mainnet"
            ? allora_sdk_1.ChainSlug.MAINNET
            : allora_sdk_1.ChainSlug.TESTNET;
        const apiKey = agent.config.ALLORA_API_KEY || "UP-d33e797de5134909854be2b7";
        const apiUrl = agent.config.ALLORA_API_URL || "";
        const config = {
            apiKey: apiKey,
            chainSlug: chainSlug,
            baseAPIUrl: apiUrl,
        };
        const client = new allora_sdk_1.AlloraAPIClient(config);
        const inference = await client.getPriceInference(tokenSymbol, timeframe);
        return inference.inference_data.network_inference_normalized;
    }
    catch (error) {
        throw new Error(`Error fetching price inference from Allora: ${error.message}`);
    }
}
//# sourceMappingURL=get_price_inference.js.map