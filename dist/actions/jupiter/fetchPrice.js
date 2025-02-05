"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const web3_js_1 = require("@solana/web3.js");
const jupiter_1 = require("../../tools/jupiter");
const fetchPriceAction = {
    name: "FETCH_PRICE",
    similes: [
        "get token price",
        "check price",
        "token value",
        "price check",
        "get price in usd",
    ],
    description: "Fetch the current price of a Solana token in USDC using Jupiter API",
    examples: [
        [
            {
                input: {
                    tokenAddress: "So11111111111111111111111111111111111111112",
                },
                output: {
                    status: "success",
                    price: "23.45",
                    message: "Current price: $23.45 USDC",
                },
                explanation: "Get the current price of SOL token in USDC",
            },
        ],
    ],
    schema: zod_1.z.object({
        tokenAddress: zod_1.z
            .string()
            .describe("The mint address of the token to fetch the price for"),
    }),
    handler: async (agent, input) => {
        try {
            const tokenId = new web3_js_1.PublicKey(input.tokenAddress);
            const price = await (0, jupiter_1.fetchPrice)(tokenId);
            return {
                status: "success",
                price,
                message: `Current price: $${price} USDC`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to fetch price: ${error.message}`,
            };
        }
    },
};
exports.default = fetchPriceAction;
//# sourceMappingURL=fetchPrice.js.map