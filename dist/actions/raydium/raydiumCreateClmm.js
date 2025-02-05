"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const decimal_js_1 = __importDefault(require("decimal.js"));
const tools_1 = require("../../tools");
const raydiumCreateClmmAction = {
    name: "RAYDIUM_CREATE_CLMM",
    similes: [
        "create clmm pool",
        "create concentrated liquidity pool",
        "raydium clmm setup",
        "launch concentrated liquidity market maker",
    ],
    description: `Create a Raydium Concentrated Liquidity Market Maker (CLMM) pool with custom ranges, providing increased capital efficiency`,
    examples: [
        [
            {
                input: {
                    mint1: "9xU1vzz456... (PublicKey)",
                    mint2: "EfrsBcG98... (PublicKey)",
                    configId: "D6yTTr... (Config PublicKey)",
                    initialPrice: 123.12,
                    startTime: 0, // or current UNIX timestamp
                },
                output: {
                    status: "success",
                    message: "Create raydium clmm pool successfully",
                    transaction: "3skCN8... (transaction signature)",
                },
                explanation: "Creates a CLMM pool between mint1 and mint2 at an initial price of 123.12 and start time of 0.",
            },
        ],
    ],
    // Validate tool inputs using zod
    schema: zod_1.z.object({
        mint1: zod_1.z.string().min(1).describe("First token mint address (public key)"),
        mint2: zod_1.z.string().min(1).describe("Second token mint address (public key)"),
        configId: zod_1.z.string().min(1).describe("Raydium configId (public key)"),
        initialPrice: zod_1.z.number().describe("Initial price for the CLMM pool"),
        startTime: zod_1.z
            .number()
            .describe("Start time in seconds (UNIX timestamp or zero)"),
    }),
    handler: async (agent, input) => {
        try {
            const { mint1, mint2, configId, initialPrice, startTime } = input;
            const tx = await (0, tools_1.raydiumCreateClmm)(agent, new web3_js_1.PublicKey(mint1), new web3_js_1.PublicKey(mint2), new web3_js_1.PublicKey(configId), new decimal_js_1.default(initialPrice), new anchor_1.BN(startTime));
            return {
                status: "success",
                message: "Create raydium clmm pool successfully",
                transaction: tx,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to create CLMM pool: ${error.message}`,
                code: error.code || "UNKNOWN_ERROR",
            };
        }
    },
};
exports.default = raydiumCreateClmmAction;
//# sourceMappingURL=raydiumCreateClmm.js.map