"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = exports.keypair = void 0;
const web3_js_1 = require("@solana/web3.js");
exports.keypair = web3_js_1.Keypair.generate();
class Wallet {
    constructor(signer) {
        this._signer = signer;
    }
    async signTransaction(tx) {
        if (tx instanceof web3_js_1.Transaction) {
            tx.sign(this._signer);
        }
        else if (tx instanceof web3_js_1.VersionedTransaction) {
            tx.sign([this._signer]);
        }
        else {
            throw new Error("Unsupported transaction type");
        }
        return tx;
    }
    async signAllTransactions(txs) {
        return Promise.all(txs.map((tx) => this.signTransaction(tx)));
    }
    get publicKey() {
        return this._signer.publicKey;
    }
}
exports.Wallet = Wallet;
//# sourceMappingURL=keypair.js.map