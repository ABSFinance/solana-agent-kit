"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInferenceByTopicId = getInferenceByTopicId;
const allora_sdk_1 = require("@alloralabs/allora-sdk");
async function getInferenceByTopicId(agent, topicId) {
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
        const inference = await client.getInferenceByTopicID(topicId);
        return inference;
    }
    catch (error) {
        throw new Error(`Error fetching inference from Allora: ${error.message}`);
    }
}
//# sourceMappingURL=get_inference_by_topic_id.js.map