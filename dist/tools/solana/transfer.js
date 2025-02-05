"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfer = transfer;
const web3_js_1 = require("@solana/web3.js");
const web3_js_2 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
/**
 * Transfer SOL or SPL tokens to a recipient
 * @param agent SolanaAgentKit instance
 * @param to Recipient's public key
 * @param amount Amount to transfer
 * @param mint Optional mint address for SPL tokens
 * @returns Transaction signature
 */
async function transfer(agent, to, amount, mint) {
    try {
        let tx;
        if (!mint) {
            // Transfer native SOL
            const transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
                fromPubkey: agent.wallet_address,
                toPubkey: to,
                lamports: amount * web3_js_2.LAMPORTS_PER_SOL,
            }));
            tx = await agent.connection.sendTransaction(transaction, [agent.wallet]);
        }
        else {
            // Transfer SPL token
            const fromAta = await (0, spl_token_1.getAssociatedTokenAddress)(mint, agent.wallet_address);
            const toAta = await (0, spl_token_1.getAssociatedTokenAddress)(mint, to);
            // Get mint info to determine decimals
            const mintInfo = await (0, spl_token_1.getMint)(agent.connection, mint);
            const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);
            const transaction = new web3_js_1.Transaction().add((0, spl_token_1.createTransferInstruction)(fromAta, toAta, agent.wallet_address, adjustedAmount));
            tx = await agent.connection.sendTransaction(transaction, [agent.wallet]);
        }
        return tx;
    }
    catch (error) {
        throw new Error(`Transfer failed: ${error.message}`);
    }
}
//# sourceMappingURL=transfer.js.map