"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.multisig_transfer_from_treasury = multisig_transfer_from_treasury;
const web3_js_1 = require("@solana/web3.js");
const web3_js_2 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const multisig = __importStar(require("@sqds/multisig"));
const { Multisig } = multisig.accounts;
/**
 * Transfer SOL or SPL tokens to a recipient from a multisig vault.
 * @param agent - SolanaAgentKit instance.
 * @param amount - Amount to transfer.
 * @param to - Recipient's public key.
 * @param vaultIndex - Optional vault index, default is 0.
 * @param mint - Optional mint address for SPL tokens.
 * @returns Transaction signature.
 */
async function multisig_transfer_from_treasury(agent, amount, to, vaultIndex = 0, mint) {
    try {
        let transferInstruction;
        const createKey = agent.wallet;
        const [multisigPda] = multisig.getMultisigPda({
            createKey: createKey.publicKey,
        });
        const multisigInfo = await Multisig.fromAccountAddress(agent.connection, multisigPda);
        const currentTransactionIndex = Number(multisigInfo.transactionIndex);
        const transactionIndex = BigInt(currentTransactionIndex + 1);
        const [vaultPda] = multisig.getVaultPda({
            multisigPda,
            index: vaultIndex,
        });
        if (!mint) {
            // Transfer native SOL
            transferInstruction = web3_js_1.SystemProgram.transfer({
                fromPubkey: agent.wallet_address,
                toPubkey: to,
                lamports: amount * web3_js_2.LAMPORTS_PER_SOL,
            });
        }
        else {
            // Transfer SPL token
            const fromAta = await (0, spl_token_1.getAssociatedTokenAddress)(mint, vaultPda, true);
            const toAta = await (0, spl_token_1.getAssociatedTokenAddress)(mint, to, true);
            const mintInfo = await (0, spl_token_1.getMint)(agent.connection, mint);
            const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);
            transferInstruction = (0, spl_token_1.createTransferInstruction)(fromAta, toAta, agent.wallet_address, adjustedAmount);
        }
        const transferMessage = new web3_js_1.TransactionMessage({
            payerKey: vaultPda,
            recentBlockhash: (await agent.connection.getLatestBlockhash()).blockhash,
            instructions: [transferInstruction],
        });
        const multisigTx = multisig.transactions.vaultTransactionCreate({
            blockhash: (await agent.connection.getLatestBlockhash()).blockhash,
            feePayer: agent.wallet_address,
            multisigPda,
            transactionIndex,
            creator: agent.wallet_address,
            vaultIndex: 0,
            ephemeralSigners: 0,
            transactionMessage: transferMessage,
        });
        multisigTx.sign([agent.wallet]);
        const tx = await agent.connection.sendRawTransaction(multisigTx.serialize());
        return tx;
    }
    catch (error) {
        throw new Error(`Transfer failed: ${error}`);
    }
}
//# sourceMappingURL=transfer_from_treasury.js.map