"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaAlloraGetInferenceByTopicId = void 0;
const tools_1 = require("langchain/tools");
class SolanaAlloraGetInferenceByTopicId extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_allora_get_inference_by_topic_id";
        this.description = `Get the inference for a given topic ID from Allora's API
    Inputs:
    topicId: number as a string, e.g., "42"`;
    }
    async _call(input) {
        try {
            const topicId = Number(input);
            const inference = await this.solanaKit.getInferenceByTopicId(topicId);
            const response = {
                status: "success",
                message: "Inference fetched successfully",
                topicId,
                inference,
            };
            return JSON.stringify(response);
        }
        catch (error) {
            const response = {
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            };
            return JSON.stringify(response);
        }
    }
}
exports.SolanaAlloraGetInferenceByTopicId = SolanaAlloraGetInferenceByTopicId;
//# sourceMappingURL=get_inference_by_topic_id.js.map