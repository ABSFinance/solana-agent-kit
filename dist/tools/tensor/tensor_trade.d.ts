import { SolanaAgentKit } from "../../index";
import { PublicKey } from "@solana/web3.js";
export declare function listNFTForSale(agent: SolanaAgentKit, nftMint: PublicKey, price: number): Promise<string>;
export declare function cancelListing(agent: SolanaAgentKit, nftMint: PublicKey): Promise<string>;
//# sourceMappingURL=tensor_trade.d.ts.map