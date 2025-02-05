"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const metaplex_1 = require("../../tools/metaplex");
const getAssetsByCreatorAction = {
    name: "GET_ASSETS_BY_CREATOR",
    similes: [
        "fetch assets by creator",
        "retrieve assets by creator",
        "get assets by creator address",
        "fetch creator assets",
    ],
    description: `Fetch a list of assets created by a specific address using the Metaplex DAS API.`,
    examples: [
        [
            {
                input: {
                    creator: "D3XrkNZz6wx6cofot7Zohsf2KSsu2ArngNk8VqU9cTY3",
                    onlyVerified: true,
                    limit: 10,
                },
                output: {
                    status: "success",
                    message: "Assets retrieved successfully",
                    result: {
                        total: 2,
                        limit: 10,
                        items: [
                            {
                                interface: "V1_NFT",
                                id: "ExampleAssetId1",
                                content: {
                                    json_uri: "https://example.com/asset1.json",
                                    metadata: {
                                        name: "Example Asset 1",
                                        symbol: "EXA1",
                                    },
                                },
                                authorities: [],
                                compression: {},
                                grouping: [],
                                royalty: {},
                                creators: [],
                                ownership: {},
                                supply: {},
                                mutable: true,
                                burnt: false,
                            },
                            {
                                interface: "V1_NFT",
                                id: "ExampleAssetId2",
                                content: {
                                    json_uri: "https://example.com/asset2.json",
                                    metadata: {
                                        name: "Example Asset 2",
                                        symbol: "EXA2",
                                    },
                                },
                                authorities: [],
                                compression: {},
                                grouping: [],
                                royalty: {},
                                creators: [],
                                ownership: {},
                                supply: {},
                                mutable: true,
                                burnt: false,
                            },
                        ],
                    },
                },
                explanation: "Fetch a list of assets created by a specific address",
            },
        ],
    ],
    schema: zod_1.z.object({
        creator: zod_1.z.string().min(1, "Creator address is required"),
        onlyVerified: zod_1.z.boolean(),
        sortBy: zod_1.z
            .object({
            sortBy: zod_1.z.enum(["created", "updated", "recentAction", "none"]),
            sortDirection: zod_1.z.enum(["asc", "desc"]),
        })
            .optional(),
        limit: zod_1.z.number().optional(),
        page: zod_1.z.number().optional(),
        before: zod_1.z.string().optional(),
        after: zod_1.z.string().optional(),
    }),
    handler: async (agent, input) => {
        const result = await (0, metaplex_1.get_assets_by_creator)(agent, input);
        return {
            status: "success",
            message: "Assets retrieved successfully",
            result,
        };
    },
};
exports.default = getAssetsByCreatorAction;
//# sourceMappingURL=getAssetsByCreator.js.map