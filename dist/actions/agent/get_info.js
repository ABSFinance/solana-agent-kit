"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const agent_1 = require("../../tools/agent");
const getInfoAction = {
    name: "GET_INFO",
    similes: [
        "get information",
        "find information",
        "search for",
        "tell me about",
        "what is",
        "explain",
    ],
    description: "Get detailed information about any topic using Perplexity's AI models",
    examples: [
        [
            {
                input: {
                    prompt: "What is blockchain technology and how does it work?",
                },
                output: {
                    status: "success",
                    message: "Blockchain is a distributed ledger technology...",
                },
                explanation: "Get detailed information about blockchain technology",
            },
        ],
    ],
    schema: zod_1.z.object({
        prompt: zod_1.z
            .string()
            .min(1)
            .max(2000)
            .describe("The question or topic to get information about"),
    }),
    handler: async (agent, input) => {
        try {
            if (!agent.config.PERPLEXITY_API_KEY) {
                return {
                    status: "error",
                    message: "Perplexity API key not found in agent configuration",
                };
            }
            const { prompt } = input;
            const response = await (0, agent_1.get_info)(agent, prompt);
            return {
                status: "success",
                message: response,
            };
        }
        catch (error) {
            // Handle specific Perplexity API error types
            if (error.response) {
                const { status, data } = error.response;
                if (status === 429) {
                    return {
                        status: "error",
                        message: "Rate limit exceeded. Please try again later.",
                    };
                }
                return {
                    status: "error",
                    message: `Perplexity API error: ${data.error?.message || error.message}`,
                };
            }
            return {
                status: "error",
                message: `Failed to get information: ${error.message}`,
            };
        }
    },
};
exports.default = getInfoAction;
//# sourceMappingURL=get_info.js.map