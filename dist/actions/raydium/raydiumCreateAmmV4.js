"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const tools_1 = require("../../tools");
const raydiumCreateAmmV4Action = {
    name: "RAYDIUM_CREATE_AMM_V4",
    similes: [
        "create raydium v4 pool",
        "setup raydium v4 liquidity pool",
        "initialize raydium v4 amm",
        "create raydium v4 market maker",
        "setup raydium v4 pool",
        "create raydium v4 trading pair",
    ],
    description: "Create a new AMM V4 pool on Raydium with advanced features and improved efficiency",
    examples: [
        [
            {
                input: {
                    baseMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
                    quoteMint: "So11111111111111111111111111111111111111112", // SOL
                    baseAmount: 1000,
                    quoteAmount: 10,
                    startPrice: 100, // 1 SOL = 100 USDC
                    openTime: 1672531200, // Unix timestamp
                },
                output: {
                    status: "success",
                    signature: "2ZE7Rz...",
                    poolId: "7nxQB...",
                    message: "Successfully created Raydium AMM V4 pool",
                },
                explanation: "Create a USDC-SOL V4 pool with initial liquidity and price",
            },
        ],
    ],
    schema: zod_1.z.object({
        baseMint: zod_1.z.string().min(1).describe("The base token mint address"),
        quoteMint: zod_1.z.string().min(1).describe("The quote token mint address"),
        baseAmount: zod_1.z
            .number()
            .positive()
            .describe("Initial base token amount to provide as liquidity"),
        quoteAmount: zod_1.z
            .number()
            .positive()
            .describe("Initial quote token amount to provide as liquidity"),
        startPrice: zod_1.z
            .number()
            .positive()
            .describe("Initial price of quote token in base token units"),
        openTime: zod_1.z
            .number()
            .positive()
            .describe("Unix timestamp when trading should start"),
    }),
    handler: async (agent, input) => {
        try {
            const marketId = new web3_js_1.PublicKey(input.marketId);
            const baseAmount = new bn_js_1.default(input.baseAmount);
            const quoteAmount = new bn_js_1.default(input.quoteAmount);
            const startTime = new bn_js_1.default(input.startTime);
            const txId = await (0, tools_1.raydiumCreateAmmV4)(agent, marketId, baseAmount, quoteAmount, startTime);
            return {
                status: "success",
                signature: txId,
                message: "Successfully created Raydium AMM V4 pool",
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to create AMM V4 pool: ${error.message}`,
            };
        }
    },
};
exports.default = raydiumCreateAmmV4Action;
//# sourceMappingURL=raydiumCreateAmmV4.js.map