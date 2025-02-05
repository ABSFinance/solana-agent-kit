"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const zod_1 = require("zod");
const metaplex_1 = require("../../tools/metaplex");
const mintNFTAction = {
    name: "MINT_NFT",
    similes: [
        "mint nft",
        "create nft",
        "mint token",
        "create token",
        "add nft to collection",
    ],
    description: "Mint a new NFT in a collection on Solana blockchain.",
    examples: [
        [
            {
                input: {
                    collectionMint: "J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w",
                    name: "My NFT",
                    uri: "https://example.com/nft.json",
                },
                output: {
                    status: "success",
                    message: "NFT minted successfully",
                    mintAddress: "7nE9GvcwsqzYxmJLSrYmSB1V1YoJWVK1KWzAcWAzjXkN",
                    metadata: {
                        name: "My NFT",
                        uri: "https://example.com/nft.json",
                    },
                    recipient: "7nE9GvcwsqzYxmJLSrYmSB1V1YoJWVK1KWzAcWAzjXkN",
                },
                explanation: "Mint an NFT to the default wallet",
            },
        ],
        [
            {
                input: {
                    collectionMint: "J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w",
                    name: "Gift NFT",
                    uri: "https://example.com/gift.json",
                    recipient: "9aUn5swQzUTRanaaTwmszxiv89cvFwUCjEBv1vZCoT1u",
                },
                output: {
                    status: "success",
                    message: "NFT minted successfully",
                    mintAddress: "8nE9GvcwsqzYxmJLSrYmSB1V1YoJWVK1KWzAcWAzjXkM",
                    metadata: {
                        name: "Gift NFT",
                        uri: "https://example.com/gift.json",
                    },
                    recipient: "9aUn5swQzUTRanaaTwmszxiv89cvFwUCjEBv1vZCoT1u",
                },
                explanation: "Mint an NFT to a specific recipient",
            },
        ],
    ],
    schema: zod_1.z.object({
        collectionMint: zod_1.z.string().min(32, "Invalid collection mint address"),
        name: zod_1.z.string().min(1, "Name is required"),
        uri: zod_1.z.string().url("URI must be a valid URL"),
        recipient: zod_1.z.string().min(32, "Invalid recipient address"),
    }),
    handler: async (agent, input) => {
        const result = await (0, metaplex_1.mintCollectionNFT)(agent, new web3_js_1.PublicKey(input.collectionMint), {
            name: input.name,
            uri: input.uri,
        }, input.recipient ? new web3_js_1.PublicKey(input.recipient) : undefined);
        return {
            status: "success",
            message: "NFT minted successfully",
            mintAddress: result.mint.toString(),
            metadata: {
                name: input.name,
                uri: input.uri,
            },
            recipient: input.recipient || result.mint.toString(),
        };
    },
};
exports.default = mintNFTAction;
//# sourceMappingURL=mintNFT.js.map