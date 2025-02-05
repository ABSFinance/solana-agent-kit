"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintCollectionNFT = mintCollectionNFT;
const umi_1 = require("@metaplex-foundation/umi");
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const mpl_core_2 = require("@metaplex-foundation/mpl-core");
const umi_web3js_adapters_1 = require("@metaplex-foundation/umi-web3js-adapters");
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
/**
 * Mint a new NFT as part of an existing collection
 * @param agent SolanaAgentKit instance
 * @param collectionMint Address of the collection's master NFT
 * @param metadata NFT metadata object
 * @param recipient Optional recipient address (defaults to wallet address)
 * @returns Object containing NFT mint address and token account
 */
async function mintCollectionNFT(agent, collectionMint, metadata, recipient) {
    try {
        // Create UMI instance from agent
        const umi = (0, umi_bundle_defaults_1.createUmi)(agent.connection.rpcEndpoint).use((0, mpl_core_1.mplCore)());
        umi.use((0, umi_1.keypairIdentity)((0, umi_web3js_adapters_1.fromWeb3JsKeypair)(agent.wallet)));
        // Convert collection mint to UMI format
        const umiCollectionMint = (0, umi_web3js_adapters_1.fromWeb3JsPublicKey)(collectionMint);
        // Fetch the existing collection
        const collection = await (0, mpl_core_2.fetchCollection)(umi, umiCollectionMint);
        // Generate a new signer for the NFT
        const assetSigner = (0, umi_1.generateSigner)(umi);
        // Create the NFT in the collection
        await (0, mpl_core_1.create)(umi, {
            asset: assetSigner,
            collection: collection,
            name: metadata.name,
            uri: metadata.uri,
            owner: (0, umi_web3js_adapters_1.fromWeb3JsPublicKey)(recipient ?? agent.wallet.publicKey),
        }).sendAndConfirm(umi);
        return {
            mint: (0, umi_web3js_adapters_1.toWeb3JsPublicKey)(assetSigner.publicKey),
            // Note: Token account is now handled automatically by the create instruction
            metadata: (0, umi_web3js_adapters_1.toWeb3JsPublicKey)(assetSigner.publicKey),
        };
    }
    catch (error) {
        throw new Error(`Collection NFT minting failed: ${error.message}`);
    }
}
//# sourceMappingURL=mint_nft.js.map