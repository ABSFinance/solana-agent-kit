"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const metaplex_1 = require("../../tools/metaplex");
const deployCollectionAction = {
    name: "DEPLOY_COLLECTION",
    similes: [
        "create collection",
        "launch collection",
        "deploy nft collection",
        "create nft collection",
        "mint collection",
    ],
    description: `Deploy a new NFT collection on Solana blockchain.`,
    examples: [
        [
            {
                input: {
                    name: "My Collection",
                    uri: "https://example.com/collection.json",
                    royaltyBasisPoints: 500,
                },
                output: {
                    status: "success",
                    message: "Collection deployed successfully",
                    collectionAddress: "7nE9GvcwsqzYxmJLSrYmSB1V1YoJWVK1KWzAcWAzjXkN",
                    name: "My Collection",
                },
                explanation: "Deploy an NFT collection with 5% royalty",
            },
        ],
        [
            {
                input: {
                    name: "Basic Collection",
                    uri: "https://example.com/basic.json",
                },
                output: {
                    status: "success",
                    message: "Collection deployed successfully",
                    collectionAddress: "8nE9GvcwsqzYxmJLSrYmSB1V1YoJWVK1KWzAcWAzjXkM",
                    name: "Basic Collection",
                },
                explanation: "Deploy a basic NFT collection without royalties",
            },
        ],
    ],
    schema: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        uri: zod_1.z.string().url("URI must be a valid URL"),
        royaltyBasisPoints: zod_1.z.number().min(0).max(10000).optional(),
    }),
    handler: async (agent, input) => {
        const options = {
            name: input.name,
            uri: input.uri,
            royaltyBasisPoints: input.royaltyBasisPoints,
        };
        const result = await (0, metaplex_1.deploy_collection)(agent, options);
        return {
            status: "success",
            message: "Collection deployed successfully",
            collectionAddress: result.collectionAddress.toString(),
            name: input.name,
        };
    },
};
exports.default = deployCollectionAction;
//# sourceMappingURL=deployCollection.js.map