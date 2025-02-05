"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaGetInfoTool = void 0;
const tools_1 = require("langchain/tools");
const agent_1 = require("../../tools/agent");
class SolanaGetInfoTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_get_info";
        this.description = "Get detailed and latest information about any topic using Perplexity AI. Input should be a question or topic to get information about.";
    }
    validateInput(input) {
        if (typeof input !== "string" || input.trim().length === 0) {
            throw new Error("Input must be a non-empty string question");
        }
    }
    async _call(input) {
        try {
            this.validateInput(input);
            const result = await (0, agent_1.get_info)(this.solanaKit, input.trim());
            return JSON.stringify({
                status: "success",
                message: "Information retrieved successfully",
                content: result,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaGetInfoTool = SolanaGetInfoTool;
//# sourceMappingURL=get_info.js.map