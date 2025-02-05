"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const web3_js_1 = require("@solana/web3.js");
const tools_1 = require("../../tools");
const getTokenDataAction = {
    name: "GET_TOKEN_DATA",
    similes: [
        "get token info",
        "token details",
        "lookup token",
        "find token",
        "token data",
    ],
    description: "Get token data from either a token address or ticker symbol",
    examples: [
        [
            {
                input: {
                    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                },
                output: {
                    status: "success",
                    token: {
                        name: "USD Coin",
                        symbol: "USDC",
                        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                        decimals: 6,
                    },
                },
                explanation: "Get token data using the token's address",
            },
        ],
        [
            {
                input: {
                    ticker: "SOL",
                },
                output: {
                    status: "success",
                    token: {
                        name: "Wrapped SOL",
                        symbol: "SOL",
                        address: "So11111111111111111111111111111111111111112",
                        decimals: 9,
                    },
                },
                explanation: "Get token data using the token's ticker symbol",
            },
        ],
    ],
    schema: zod_1.z
        .object({
        address: zod_1.z.string().optional().describe("The token's mint address"),
        ticker: zod_1.z.string().optional().describe("The token's ticker symbol"),
    })
        .refine((data) => data.address || data.ticker, {
        message: "Either address or ticker must be provided",
    }),
    handler: async (agent, input) => {
        try {
            let tokenData;
            if (input.address) {
                tokenData = await (0, tools_1.getTokenDataByAddress)(new web3_js_1.PublicKey(input.address));
            }
            else if (input.ticker) {
                const address = await (0, tools_1.getTokenAddressFromTicker)(input.ticker);
                if (address) {
                    tokenData = await (0, tools_1.getTokenDataByAddress)(new web3_js_1.PublicKey(address));
                }
            }
            if (!tokenData) {
                return {
                    status: "error",
                    message: "Token not found or not verified",
                };
            }
            return {
                status: "success",
                token: {
                    name: tokenData.name,
                    symbol: tokenData.symbol,
                    address: tokenData.address,
                    decimals: tokenData.decimals,
                    logoURI: tokenData.logoURI,
                },
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to get token data: ${error.message}`,
            };
        }
    },
};
exports.default = getTokenDataAction;
//# sourceMappingURL=getTokenData.js.map