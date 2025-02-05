"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaAlloraGetAllTopics = void 0;
const tools_1 = require("langchain/tools");
class SolanaAlloraGetAllTopics extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_allora_get_all_topics";
        this.description = `Get all topics from Allora's API
  
    Inputs: None`;
    }
    async _call(_) {
        try {
            const topics = await this.solanaKit.getAllTopics();
            const response = {
                status: "success",
                message: "Topics fetched successfully",
                topics,
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
exports.SolanaAlloraGetAllTopics = SolanaAlloraGetAllTopics;
//# sourceMappingURL=get_all_topics.js.map