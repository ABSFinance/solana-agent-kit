"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_TipLink = create_TipLink;
const api_1 = require("@tiplink/api");
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const MINIMUM_SOL_BALANCE = 0.003 * web3_js_1.LAMPORTS_PER_SOL;
async function create_TipLink(agent, amount, splmintAddress) {
    try {
        const tiplink = await api_1.TipLink.create();
        if (!splmintAddress) {
            const transaction = new web3_js_1.Transaction();
            transaction.add(web3_js_1.SystemProgram.transfer({
                fromPubkey: agent.wallet_address,
                toPubkey: tiplink.keypair.publicKey,
                lamports: amount * web3_js_1.LAMPORTS_PER_SOL,
            }));
            const signature = await (0, web3_js_1.sendAndConfirmTransaction)(agent.connection, transaction, [agent.wallet], { commitment: "confirmed" });
            return {
                url: tiplink.url.toString(),
                signature,
            };
        }
        else {
            const fromAta = await (0, spl_token_1.getAssociatedTokenAddress)(splmintAddress, agent.wallet_address);
            const toAta = await (0, spl_token_1.getAssociatedTokenAddress)(splmintAddress, tiplink.keypair.publicKey);
            const mintInfo = await (0, spl_token_1.getMint)(agent.connection, splmintAddress);
            const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);
            const transaction = new web3_js_1.Transaction();
            transaction.add(web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: 5000,
            }));
            transaction.add(web3_js_1.SystemProgram.transfer({
                fromPubkey: agent.wallet_address,
                toPubkey: tiplink.keypair.publicKey,
                lamports: MINIMUM_SOL_BALANCE,
            }));
            transaction.add((0, spl_token_1.createAssociatedTokenAccountInstruction)(agent.wallet_address, toAta, tiplink.keypair.publicKey, splmintAddress));
            transaction.add((0, spl_token_1.createTransferInstruction)(fromAta, toAta, agent.wallet_address, adjustedAmount));
            const signature = await (0, web3_js_1.sendAndConfirmTransaction)(agent.connection, transaction, [agent.wallet], { commitment: "confirmed" });
            return {
                url: tiplink.url.toString(),
                signature,
            };
        }
    }
    catch (error) {
        console.error("Error creating TipLink or sending funds:", error.message);
        throw new Error(`Failed to create TipLink: ${error.message}`);
    }
}
//# sourceMappingURL=create_tiplinks.js.map