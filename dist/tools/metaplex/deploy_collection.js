"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy_collection = deploy_collection;
const umi_1 = require("@metaplex-foundation/umi");
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const umi_web3js_adapters_1 = require("@metaplex-foundation/umi-web3js-adapters");
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
/**
 * Deploy a new NFT collection
 * @param agent SolanaAgentKit instance
 * @param options Collection options including name, URI, royalties, and creators
 * @returns Object containing collection address and metadata
 */
async function deploy_collection(agent, options) {
    try {
        // Initialize Umi
        const umi = (0, umi_bundle_defaults_1.createUmi)(agent.connection.rpcEndpoint).use((0, mpl_core_1.mplCore)());
        umi.use((0, umi_1.keypairIdentity)((0, umi_web3js_adapters_1.fromWeb3JsKeypair)(agent.wallet)));
        // Generate collection signer
        const collectionSigner = (0, umi_1.generateSigner)(umi);
        // Format creators if provided
        const formattedCreators = options.creators?.map((creator) => ({
            address: (0, umi_1.publicKey)(creator.address),
            percentage: creator.percentage,
        })) || [
            {
                address: (0, umi_1.publicKey)(agent.wallet_address.toString()),
                percentage: 100,
            },
        ];
        // Create collection
        const tx = await (0, mpl_core_1.createCollection)(umi, {
            collection: collectionSigner,
            name: options.name,
            uri: options.uri,
            plugins: [
                {
                    type: "Royalties",
                    basisPoints: options.royaltyBasisPoints || 500, // Default 5%
                    creators: formattedCreators,
                    ruleSet: (0, mpl_core_1.ruleSet)("None"), // Compatibility rule set
                },
            ],
        }).sendAndConfirm(umi);
        return {
            collectionAddress: (0, umi_web3js_adapters_1.toWeb3JsPublicKey)(collectionSigner.publicKey),
            signature: tx.signature,
        };
    }
    catch (error) {
        throw new Error(`Collection deployment failed: ${error.message}`);
    }
}
//# sourceMappingURL=deploy_collection.js.map