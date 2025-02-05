"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTopics = getAllTopics;
const allora_sdk_1 = require("@alloralabs/allora-sdk");
async function getAllTopics(agent) {
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
        const topics = await client.getAllTopics();
        return topics;
    }
    catch (error) {
        throw new Error(`Error fetching topics from Allora: ${error.message}`);
    }
}
//# sourceMappingURL=get_all_topics.js.map