"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const metaplex_1 = require("../../tools/metaplex");
const getAssetAction = {
    name: "GET_ASSET",
    similes: [
        "fetch asset",
        "retrieve asset",
        "get asset details",
        "fetch asset details",
    ],
    description: `Fetch asset details using the Metaplex DAS API.`,
    examples: [
        [
            {
                input: {
                    assetId: "Asset ID",
                },
                output: {
                    status: "success",
                    message: "Asset retrieved successfully",
                    result: {
                        // Example asset details
                        name: "Example Asset",
                        symbol: "EXA",
                        uri: "https://example.com/asset.json",
                    },
                },
                explanation: "Fetch details of an asset using its ID",
            },
        ],
    ],
    schema: zod_1.z.object({
        assetId: zod_1.z.string().min(1, "Asset ID is required"),
    }),
    handler: async (agent, input) => {
        const assetId = input.assetId;
        const result = await (0, metaplex_1.get_asset)(agent, assetId);
        return {
            status: "success",
            message: "Asset retrieved successfully",
            result,
        };
    },
};
exports.default = getAssetAction;
//# sourceMappingURL=getAsset.js.map