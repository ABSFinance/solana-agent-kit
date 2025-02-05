"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const getInferenceByTopicIdAction = {
    name: "ALLORA_GET_INFERENCE_BY_TOPIC_ID",
    similes: ["get allora inference for topic 42", "get inference for topic 42"],
    description: "Get the inference for a given topic ID from Allora's API",
    examples: [
        [
            {
                input: {
                    topicId: "42",
                },
                output: {
                    status: "success",
                    message: "Inference fetched successfully",
                    inference: "The inference for topic 42 is 100",
                },
                explanation: "Get the inference for topic 42",
            },
        ],
    ],
    schema: zod_1.z.object({
        topicId: zod_1.z
            .string()
            .min(1)
            .describe("The topic ID to get the inference for"),
    }),
    handler: async (agent, input) => {
        try {
            const { topicId } = input;
            const inference = await (0, tools_1.getInferenceByTopicId)(agent, topicId);
            return {
                status: "success",
                message: "Inference fetched successfully",
                inference: `The inference for topic ${topicId} is ${inference}`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to fetch inference from Allora: ${error.message}`,
            };
        }
    },
};
exports.default = getInferenceByTopicIdAction;
//# sourceMappingURL=getInferenceByTopicId.js.map