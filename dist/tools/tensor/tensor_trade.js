"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listNFTForSale = listNFTForSale;
exports.cancelListing = cancelListing;
const tensorswap_sdk_1 = require("@tensor-oss/tensorswap-sdk");
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const bn_js_1 = require("bn.js");
const spl_token_1 = require("@solana/spl-token");
async function listNFTForSale(agent, nftMint, price) {
    try {
        if (!web3_js_1.PublicKey.isOnCurve(nftMint)) {
            throw new Error("Invalid NFT mint address");
        }
        const mintInfo = await agent.connection.getAccountInfo(nftMint);
        if (!mintInfo) {
            throw new Error(`NFT mint ${nftMint.toString()} does not exist`);
        }
        const ata = await (0, spl_token_1.getAssociatedTokenAddress)(nftMint, agent.wallet_address);
        try {
            const tokenAccount = await (0, spl_token_1.getAccount)(agent.connection, ata);
            if (!tokenAccount || tokenAccount.amount <= 0) {
                throw new Error(`You don't own this NFT (${nftMint.toString()})`);
            }
        }
        catch (error) {
            console.error(error);
            throw new Error(`No token account found for mint ${nftMint.toString()}. Make sure you own this NFT.`);
        }
        const provider = new anchor_1.AnchorProvider(agent.connection, new anchor_1.Wallet(agent.wallet), anchor_1.AnchorProvider.defaultOptions());
        const tensorSwapSdk = new tensorswap_sdk_1.TensorSwapSDK({ provider });
        const priceInLamports = new bn_js_1.BN(price * 1e9);
        const nftSource = await (0, spl_token_1.getAssociatedTokenAddress)(nftMint, agent.wallet_address);
        const { tx } = await tensorSwapSdk.list({
            nftMint,
            nftSource,
            owner: agent.wallet_address,
            price: priceInLamports,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            payer: agent.wallet_address,
        });
        const transaction = new web3_js_1.Transaction();
        transaction.add(...tx.ixs);
        return await agent.connection.sendTransaction(transaction, [
            agent.wallet,
            ...tx.extraSigners,
        ]);
    }
    catch (error) {
        console.error("Full error details:", error);
        throw error;
    }
}
async function cancelListing(agent, nftMint) {
    const provider = new anchor_1.AnchorProvider(agent.connection, new anchor_1.Wallet(agent.wallet), anchor_1.AnchorProvider.defaultOptions());
    const tensorSwapSdk = new tensorswap_sdk_1.TensorSwapSDK({ provider });
    const nftDest = await (0, spl_token_1.getAssociatedTokenAddress)(nftMint, agent.wallet_address, false, spl_token_1.TOKEN_PROGRAM_ID);
    const { tx } = await tensorSwapSdk.delist({
        nftMint,
        nftDest,
        owner: agent.wallet_address,
        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        payer: agent.wallet_address,
        authData: null,
    });
    const transaction = new web3_js_1.Transaction();
    transaction.add(...tx.ixs);
    return await agent.connection.sendTransaction(transaction, [
        agent.wallet,
        ...tx.extraSigners,
    ]);
}
//# sourceMappingURL=tensor_trade.js.map