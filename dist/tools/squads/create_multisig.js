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
exports.create_squads_multisig = create_squads_multisig;
const multisig = __importStar(require("@sqds/multisig"));
/**
 * Creates a new Squads multisig account.
 *
 * @param agent - The SolanaAgentKit instance containing the connection and wallet information.
 * @param creator - The public key of the creator who will be a member of the multisig.
 * @returns A promise that resolves to the transaction ID of the multisig creation transaction.
 *
 * @throws Will throw an error if the transaction fails.
 */
async function create_squads_multisig(agent, creator) {
    const connection = agent.connection;
    const createKey = agent.wallet; // can be any keypair, using the agent wallet as only one multisig is required
    const [multisigPda] = multisig.getMultisigPda({
        createKey: createKey.publicKey,
    });
    const programConfigPda = multisig.getProgramConfigPda({})[0];
    const programConfig = await multisig.accounts.ProgramConfig.fromAccountAddress(connection, programConfigPda);
    const configTreasury = programConfig.treasury;
    const tx = multisig.transactions.multisigCreateV2({
        blockhash: (await connection.getLatestBlockhash()).blockhash,
        treasury: configTreasury,
        createKey: createKey.publicKey,
        creator: agent.wallet.publicKey,
        multisigPda,
        configAuthority: null,
        timeLock: 0,
        threshold: 2,
        rentCollector: null,
        members: [
            {
                key: agent.wallet.publicKey,
                permissions: multisig.types.Permissions.all(),
            },
            {
                key: creator,
                permissions: multisig.types.Permissions.all(),
            },
        ],
    });
    tx.sign([agent.wallet, createKey]);
    const txId = connection.sendRawTransaction(tx.serialize());
    return txId;
}
//# sourceMappingURL=create_multisig.js.map