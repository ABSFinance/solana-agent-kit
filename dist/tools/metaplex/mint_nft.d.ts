import { SolanaAgentKit } from "../../index";
import { PublicKey } from "@solana/web3.js";
import { MintCollectionNFTResponse } from "../../types";
/**
 * Mint a new NFT as part of an existing collection
 * @param agent SolanaAgentKit instance
 * @param collectionMint Address of the collection's master NFT
 * @param metadata NFT metadata object
 * @param recipient Optional recipient address (defaults to wallet address)
 * @returns Object containing NFT mint address and token account
 */
export declare function mintCollectionNFT(agent: SolanaAgentKit, collectionMint: PublicKey, metadata: {
    name: string;
    uri: string;
    sellerFeeBasisPoints?: number;
    creators?: Array<{
        address: string;
        share: number;
    }>;
}, recipient?: PublicKey): Promise<MintCollectionNFTResponse>;
//# sourceMappingURL=mint_nft.d.ts.map