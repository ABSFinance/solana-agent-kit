"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solana3LandCreateSingle = void 0;
const tools_1 = require("langchain/tools");
class Solana3LandCreateSingle extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "3land_minting_tool";
        this.description = `Creates an NFT and lists it on 3.land's website

  Inputs:
  collectionAccount (optional): represents the account for the nft collection
  itemName (required): the name of the NFT
  sellerFee (required): the fee of the seller
  itemAmount (required): the amount of the NFTs that can be minted
  itemDescription (required): the description of the NFT
  traits (required): the traits of the NFT [{trait_type: string, value: string}]
  price (required): the price of the item, if is 0 the listing will be free
  mainImageUrl (required): the main image of the NFT
  coverImageUrl (optional): the cover image of the NFT
  splHash (optional): the hash of the spl token, if not provided listing will be in $SOL
  poolName (optional): the name of the pool
  isMainnet (required): defines if the tx takes places in mainnet
  withPool (optional): defines if minted edition will be tied to a liquidity pool
  priorityFeeParam (optional): default value is 50000, if tx doesnt land this param can help it land
  `;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const isMainnet = inputFormat.isMainnet;
            const withPool = inputFormat.withPool;
            const poolName = inputFormat.poolName;
            const priorityFeeParam = inputFormat?.priorityFeeParam;
            const collectionAccount = inputFormat.collectionAccount;
            const itemName = inputFormat?.itemName;
            const sellerFee = inputFormat?.sellerFee;
            const itemAmount = inputFormat?.itemAmount;
            const itemSymbol = inputFormat?.itemSymbol;
            const itemDescription = inputFormat?.itemDescription;
            const traits = inputFormat?.traits;
            const price = inputFormat?.price;
            const mainImageUrl = inputFormat?.mainImageUrl;
            const coverImageUrl = inputFormat?.coverImageUrl;
            const splHash = inputFormat?.splHash;
            if (withPool) {
                if (!poolName) {
                    throw new Error("poolName is required when withPool is true");
                }
                if (!splHash) {
                    throw new Error("splHash is required when withPool is true");
                }
            }
            const createItemOptions = {
                ...(itemName && { itemName }),
                ...(sellerFee && { sellerFee }),
                ...(itemAmount && { itemAmount }),
                ...(itemSymbol && { itemSymbol }),
                ...(itemDescription && { itemDescription }),
                ...(traits && { traits }),
                ...(price && { price }),
                ...(mainImageUrl && { mainImageUrl }),
                ...(coverImageUrl && { coverImageUrl }),
                ...(splHash && { splHash }),
                ...(poolName && { poolName }),
            };
            if (!collectionAccount) {
                throw new Error("Collection account is required");
            }
            const tx = await this.solanaKit.create3LandNft(collectionAccount, createItemOptions, !isMainnet, withPool, priorityFeeParam);
            return JSON.stringify({
                status: "success",
                message: `Created listing successfully ${tx}`,
                transaction: tx,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.Solana3LandCreateSingle = Solana3LandCreateSingle;
//# sourceMappingURL=create_single.js.map