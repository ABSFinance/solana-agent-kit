"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const tools_1 = require("../../tools");
const raydiumCreateCpmmAction = {
    name: "RAYDIUM_CREATE_CPMM",
    similes: [
        "create raydium pool",
        "setup raydium liquidity pool",
        "initialize raydium amm",
        "create constant product market maker",
        "setup raydium cpmm",
        "create raydium trading pair",
    ],
    description: "Create a new Constant Product Market Maker (CPMM) pool on Raydium",
    examples: [
        [
            {
                input: {
                    baseMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
                    quoteMint: "So11111111111111111111111111111111111111112", // SOL
                    baseAmount: 1000,
                    quoteAmount: 10,
                    startTime: 1672531200, // Unix timestamp
                },
                output: {
                    status: "success",
                    signature: "2ZE7Rz...",
                    poolId: "7nxQB...",
                    message: "Successfully created Raydium CPMM pool",
                },
                explanation: "Create a USDC-SOL pool with initial liquidity of 1000 USDC and 10 SOL",
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
        startTime: zod_1.z
            .number()
            .positive()
            .describe("Unix timestamp when trading should start"),
    }),
    handler: async (agent, input) => {
        try {
            const mintA = new web3_js_1.PublicKey(input.baseMint);
            const mintB = new web3_js_1.PublicKey(input.quoteMint);
            const configId = new web3_js_1.PublicKey(input.configId);
            const mintAAmount = new bn_js_1.default(input.baseAmount);
            const mintBAmount = new bn_js_1.default(input.quoteAmount);
            const startTime = new bn_js_1.default(input.startTime);
            const txId = await (0, tools_1.raydiumCreateCpmm)(agent, mintA, mintB, configId, mintAAmount, mintBAmount, startTime);
            return {
                status: "success",
                signature: txId,
                message: "Successfully created Raydium CPMM pool",
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to create CPMM pool: ${error.message}`,
            };
        }
    },
};
exports.default = raydiumCreateCpmmAction;
//# sourceMappingURL=raydiumCreateCpmm.js.map