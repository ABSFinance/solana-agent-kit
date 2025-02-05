import { Keypair, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
export declare const keypair: Keypair;
export declare class Wallet {
    private _signer;
    constructor(signer: Keypair);
    signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T>;
    signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]>;
    get publicKey(): PublicKey;
}
//# sourceMappingURL=keypair.d.ts.map