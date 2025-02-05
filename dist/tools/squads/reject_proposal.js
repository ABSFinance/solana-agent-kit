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
exports.multisig_reject_proposal = multisig_reject_proposal;
const multisig = __importStar(require("@sqds/multisig"));
const { Multisig } = multisig.accounts;
/**
 * Rejects a proposal in a Solana multisig setup.
 *
 * @param agent - The SolanaAgentKit instance containing the wallet and connection.
 * @param transactionIndex - Optional. The index of the transaction to reject. If not provided, the current transaction index will be used.
 * @returns A promise that resolves to the transaction ID of the rejection transaction.
 * @throws Will throw an error if the transaction fails.
 */
async function multisig_reject_proposal(agent, transactionIndex) {
    try {
        const createKey = agent.wallet;
        const [multisigPda] = multisig.getMultisigPda({
            createKey: createKey.publicKey,
        });
        const multisigInfo = await Multisig.fromAccountAddress(agent.connection, multisigPda);
        const currentTransactionIndex = Number(multisigInfo.transactionIndex);
        if (!transactionIndex) {
            transactionIndex = BigInt(currentTransactionIndex);
        }
        else if (typeof transactionIndex !== "bigint") {
            transactionIndex = BigInt(transactionIndex);
        }
        // const [proposalPda, proposalBump] = multisig.getProposalPda({
        //   multisigPda,
        //   transactionIndex,
        // });
        const multisigTx = multisig.transactions.proposalReject({
            blockhash: (await agent.connection.getLatestBlockhash()).blockhash,
            feePayer: agent.wallet.publicKey,
            multisigPda,
            transactionIndex: transactionIndex,
            member: agent.wallet.publicKey,
        });
        multisigTx.sign([agent.wallet]);
        const tx = await agent.connection.sendRawTransaction(multisigTx.serialize());
        return tx;
    }
    catch (error) {
        throw new Error(`Transfer failed: ${error}`);
    }
}
//# sourceMappingURL=reject_proposal.js.map