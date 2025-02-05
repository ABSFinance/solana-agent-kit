"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const web3_js_1 = require("@solana/web3.js");
const gibwork_1 = require("../../tools/gibwork");
const createGibworkTaskAction = {
    name: "CREATE_GIBWORK_TASK",
    similes: [
        "create task",
        "post job",
        "create gig",
        "post task",
        "create work",
        "new task on gibwork",
    ],
    description: "Create a new task on the Gibwork platform with payment in SPL tokens",
    examples: [
        [
            {
                input: {
                    title: "Build a Solana dApp",
                    content: "Create a simple Solana dApp with React frontend",
                    requirements: "Experience with Rust and React",
                    tags: ["solana", "rust", "react"],
                    tokenMintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                    tokenAmount: 100,
                },
                output: {
                    status: "success",
                    taskId: "task_123",
                    signature: "3YKpM1...",
                    message: "Successfully created task: Build a Solana dApp",
                },
                explanation: "Create a new task on Gibwork with 100 USDC payment",
            },
        ],
    ],
    schema: zod_1.z.object({
        title: zod_1.z.string().min(1).describe("Title of the task"),
        content: zod_1.z.string().min(1).describe("Description of the task"),
        requirements: zod_1.z
            .string()
            .min(1)
            .describe("Requirements to complete the task"),
        tags: zod_1.z
            .array(zod_1.z.string())
            .min(1)
            .describe("List of tags associated with the task"),
        tokenMintAddress: zod_1.z.string().describe("Token mint address for payment"),
        tokenAmount: zod_1.z.number().positive().describe("Payment amount for the task"),
        payer: zod_1.z
            .string()
            .optional()
            .describe("Optional payer address (defaults to wallet address)"),
    }),
    handler: async (agent, input) => {
        try {
            const responseData = await (0, gibwork_1.create_gibwork_task)(agent, input.title, input.content, input.requirements, input.tags, new web3_js_1.PublicKey(input.tokenMintAddress), input.tokenAmount, input.payer ? new web3_js_1.PublicKey(input.payer) : undefined);
            return {
                status: "success",
                taskId: responseData.taskId,
                signature: responseData.signature,
                message: `Successfully created task: ${input.title}`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to create task: ${error.message}`,
            };
        }
    },
};
exports.default = createGibworkTaskAction;
//# sourceMappingURL=createGibworkTask.js.map