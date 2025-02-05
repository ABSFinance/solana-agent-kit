import { StoreInitOptions, CreateCollectionOptions, CreateSingleOptions } from "@3land/listings-sdk/dist/types/implementation/implementationTypes";
/**
 * Create a collection on 3Land
 * @param optionsWithBase58 represents the privateKey of the wallet - can be an array of numbers, Uint8Array or base58 string
 * @param collectionOpts represents the options for the collection creation
 * @returns
 */
export declare function createCollection(optionsWithBase58: StoreInitOptions, collectionOpts: CreateCollectionOptions, priorityFeeParam?: number): Promise<string | {
    success: boolean;
    error: unknown;
}>;
/**
 * Create a single edition on 3Land
 * @param optionsWithBase58 represents the privateKey of the wallet - can be an array of numbers, Uint8Array or base58 string
 * @param collectionAccount represents the account for the nft collection
 * @param createItemOptions the options for the creation of the single NFT listing
 * @returns
 */
export declare function createSingle(optionsWithBase58: StoreInitOptions, collectionAccount: string, createItemOptions: CreateSingleOptions, isMainnet?: boolean, withPool?: boolean, priorityFeeParam?: number): Promise<{
    transactionId: string;
    payerPublicKey: string;
}>;
//# sourceMappingURL=create_3land_collectible.d.ts.map