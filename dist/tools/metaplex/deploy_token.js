"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy_token = deploy_token;
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const umi_1 = require("@metaplex-foundation/umi");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const umi_web3js_adapters_1 = require("@metaplex-foundation/umi-web3js-adapters");
const mpl_toolbox_1 = require("@metaplex-foundation/mpl-toolbox");
/**
 * Deploy a new SPL token
 * @param agent SolanaAgentKit instance
 * @param name Name of the token
 * @param uri URI for the token metadata
 * @param symbol Symbol of the token
 * @param decimals Number of decimals for the token (default: 9)
 * @param initialSupply Initial supply to mint (optional)
 * @returns Object containing token mint address and initial account (if supply was minted)
 */
async function deploy_token(agent, name, uri, symbol, decimals = 9, initialSupply) {
    try {
        // Create UMI instance from agent
        const umi = (0, umi_bundle_defaults_1.createUmi)(agent.connection.rpcEndpoint).use((0, mpl_toolbox_1.mplToolbox)());
        umi.use((0, umi_1.keypairIdentity)((0, umi_web3js_adapters_1.fromWeb3JsKeypair)(agent.wallet)));
        // Create new token mint
        const mint = (0, umi_1.generateSigner)(umi);
        let builder = (0, mpl_token_metadata_1.createFungible)(umi, {
            name,
            uri,
            symbol,
            sellerFeeBasisPoints: {
                basisPoints: 0n,
                identifier: "%",
                decimals: 2,
            },
            decimals,
            mint,
        });
        if (initialSupply) {
            builder = builder.add((0, mpl_token_metadata_1.mintV1)(umi, {
                mint: mint.publicKey,
                tokenStandard: mpl_token_metadata_1.TokenStandard.Fungible,
                tokenOwner: (0, umi_web3js_adapters_1.fromWeb3JsPublicKey)(agent.wallet_address),
                amount: initialSupply * Math.pow(10, decimals),
            }));
        }
        builder.sendAndConfirm(umi, { confirm: { commitment: "finalized" } });
        return {
            mint: (0, umi_web3js_adapters_1.toWeb3JsPublicKey)(mint.publicKey),
        };
    }
    catch (error) {
        throw new Error(`Token deployment failed: ${error.message}`);
    }
}
//# sourceMappingURL=deploy_token.js.map