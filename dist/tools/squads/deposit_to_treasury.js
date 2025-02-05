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
exports.multisig_deposit_to_treasury = multisig_deposit_to_treasury;
const web3_js_1 = require("@solana/web3.js");
const web3_js_2 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const multisig = __importStar(require("@sqds/multisig"));
/**
 * Transfer SOL or SPL tokens to a multisig vault.
 * @param agent SolanaAgentKit instance
 * @param amount Amount to transfer
 * @param vaultIndex Optional vault index, default is 0
 * @param mint Optional mint address for SPL tokens
 * @returns Transaction signature
 */
async function multisig_deposit_to_treasury(agent, amount, vaultIndex, mint) {
    try {
        let tx;
        if (!vaultIndex) {
            vaultIndex = 0;
        }
        const createKey = agent.wallet;
        const [multisigPda] = multisig.getMultisigPda({
            createKey: createKey.publicKey,
        });
        const [vaultPda] = multisig.getVaultPda({
            multisigPda,
            index: vaultIndex,
        });
        const to = vaultPda;
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
            const transaction = new web3_js_1.Transaction();
            const toAta = await (0, spl_token_1.getAssociatedTokenAddress)(mint, to, true);
            const toTokenAccountInfo = await agent.connection.getAccountInfo(toAta);
            // Create associated token account if it doesn't exist
            if (!toTokenAccountInfo) {
                transaction.add((0, spl_token_1.createAssociatedTokenAccountInstruction)(agent.wallet_address, toAta, to, mint));
            }
            // Get mint info to determine decimals
            const mintInfo = await (0, spl_token_1.getMint)(agent.connection, mint);
            const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);
            transaction.add((0, spl_token_1.createTransferInstruction)(fromAta, toAta, agent.wallet_address, adjustedAmount));
            tx = await agent.connection.sendTransaction(transaction, [agent.wallet]);
        }
        return tx;
    }
    catch (error) {
        throw new Error(`Transfer failed: ${error}`);
    }
}
//# sourceMappingURL=deposit_to_treasury.js.map