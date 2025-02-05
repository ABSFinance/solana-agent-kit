"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCollection = createCollection;
exports.createSingle = createSingle;
const listings_sdk_1 = require("@3land/listings-sdk");
/**
 * Create a collection on 3Land
 * @param optionsWithBase58 represents the privateKey of the wallet - can be an array of numbers, Uint8Array or base58 string
 * @param collectionOpts represents the options for the collection creation
 * @returns
 */
async function createCollection(optionsWithBase58, collectionOpts, priorityFeeParam) {
    try {
        const collection = await (0, listings_sdk_1.createCollectionImp)(optionsWithBase58, collectionOpts, priorityFeeParam);
        return collection;
    }
    catch (error) {
        throw new Error(`Collection creation failed: ${error.message}`);
    }
}
/**
 * Create a single edition on 3Land
 * @param optionsWithBase58 represents the privateKey of the wallet - can be an array of numbers, Uint8Array or base58 string
 * @param collectionAccount represents the account for the nft collection
 * @param createItemOptions the options for the creation of the single NFT listing
 * @returns
 */
async function createSingle(optionsWithBase58, collectionAccount, createItemOptions, isMainnet = false, withPool = false, priorityFeeParam) {
    try {
        const landStore = isMainnet
            ? "AmQNs2kgw4LvS9sm6yE9JJ4Hs3JpVu65eyx9pxMG2xA"
            : "GyPCu89S63P9NcCQAtuSJesiefhhgpGWrNVJs4bF2cSK";
        const singleEditionTx = await (0, listings_sdk_1.createSingleImp)(optionsWithBase58, landStore, collectionAccount, createItemOptions, true, //isAI
        withPool, priorityFeeParam);
        return singleEditionTx;
    }
    catch (error) {
        throw new Error(`Single edition creation failed: ${error.message}`);
    }
}
//# sourceMappingURL=create_3land_collectible.js.map