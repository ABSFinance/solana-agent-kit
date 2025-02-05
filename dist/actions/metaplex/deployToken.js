"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const deployTokenAction = {
    name: "DEPLOY_TOKEN",
    similes: [
        "create token",
        "launch token",
        "deploy new token",
        "create new token",
        "mint token",
    ],
    description: "Deploy a new SPL token on the Solana blockchain with specified parameters",
    examples: [
        [
            {
                input: {
                    name: "My Token",
                    uri: "https://example.com/token.json",
                    symbol: "MTK",
                    decimals: 9,
                    initialSupply: 1000000,
                },
                output: {
                    mint: "7nE9GvcwsqzYxmJLSrYmSB1V1YoJWVK1KWzAcWAzjXkN",
                    status: "success",
                    message: "Token deployed successfully",
                },
                explanation: "Deploy a token with initial supply and metadata",
            },
        ],
        [
            {
                input: {
                    name: "Basic Token",
                    uri: "https://example.com/basic.json",
                    symbol: "BASIC",
                },
                output: {
                    mint: "8nE9GvcwsqzYxmJLSrYmSB1V1YoJWVK1KWzAcWAzjXkM",
                    status: "success",
                    message: "Token deployed successfully",
                },
                explanation: "Deploy a basic token with minimal parameters",
            },
        ],
    ],
    schema: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        uri: zod_1.z.string().url("URI must be a valid URL"),
        symbol: zod_1.z.string().min(1, "Symbol is required"),
        decimals: zod_1.z.number().optional(),
        initialSupply: zod_1.z.number().optional(),
    }),
    handler: async (agent, input) => {
        try {
            const result = await (0, tools_1.deploy_token)(agent, input.name, input.uri, input.symbol, input.decimals, input.initialSupply);
            return {
                mint: result.mint.toString(),
                status: "success",
                message: "Token deployed successfully",
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Token deployment failed: ${error.message}`,
            };
        }
    },
};
exports.default = deployTokenAction;
//# sourceMappingURL=deployToken.js.map