"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const zod_1 = require("zod");
const helius_1 = require("../../tools/helius");
const getAssetsByOwnerAction = {
    name: "FETCH_ASSETS_BY_OWNER",
    similes: [
        "fetch assets",
        "get assets",
        "retrieve assets",
        "list assets",
        "assets by owner",
    ],
    description: "Fetch assets owned by a specific Solana wallet address using the Helius Digital Asset Standard API",
    examples: [
        [
            {
                input: {
                    ownerPublicKey: "4Pf8q3mHGLdkoc1M8xWZwW5q32gYmdhwC2gJ8K9EAGDX",
                    limit: 10,
                },
                output: {
                    status: "success",
                    assets: [
                        {
                            name: "Helius NFT #1",
                            type: "NFT",
                            owner: "4Pf8q3mHGLdkoc1M8xWZwW5q32gYmdhwC2gJ8K9EAGDX",
                        },
                        {
                            name: "Helius Token #10",
                            type: "Token",
                            owner: "4Pf8q3mHGLdkoc1M8xWZwW5q32gYmdhwC2gJ8K9EAGDX",
                        },
                    ],
                    message: "Successfully fetched assets for the wallet address",
                },
                explanation: "Fetches a list of assets from the for the given wallet address with a limit of 10 items.",
            },
        ],
    ],
    schema: zod_1.z.object({
        ownerPublicKey: zod_1.z.string().describe("Owner's Solana wallet PublicKey"),
        limit: zod_1.z
            .number()
            .positive()
            .describe("Number of assets to retrieve per request"),
    }),
    handler: async (agent, input) => {
        try {
            const assets = await (0, helius_1.getAssetsByOwner)(agent, new web3_js_1.PublicKey(input.ownerPublicKey), input.limit);
            return {
                status: "success",
                assets: assets,
                message: `Successfully fetched assets for the wallet address: ${input.ownerPublicKey}`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to fetch assets: ${error.message}`,
            };
        }
    },
};
exports.default = getAssetsByOwnerAction;
//# sourceMappingURL=getAssetsbyOwner.js.map