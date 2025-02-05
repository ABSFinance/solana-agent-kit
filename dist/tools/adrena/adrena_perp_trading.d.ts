import { PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "../../index";
/**
 * Close short trade on Adrena
 * @returns Transaction signature
 */
export declare function closePerpTradeShort({ agent, price, tradeMint, }: {
    agent: SolanaAgentKit;
    price: number;
    tradeMint: PublicKey;
}): Promise<any>;
/**
 * Close long trade on Adrena
 * @returns Transaction signature
 */
export declare function closePerpTradeLong({ agent, price, tradeMint, }: {
    agent: SolanaAgentKit;
    price: number;
    tradeMint: PublicKey;
}): Promise<any>;
/**
 * Open long trade on Adrena
 *
 * Note: provide the same token as collateralMint and as tradeMint to avoid swap
 * @returns Transaction signature
 */
export declare function openPerpTradeLong({ agent, price, collateralAmount, collateralMint, leverage, tradeMint, slippage, }: {
    agent: SolanaAgentKit;
    price: number;
    collateralAmount: number;
    collateralMint?: PublicKey;
    leverage?: number;
    tradeMint?: PublicKey;
    slippage?: number;
}): Promise<string>;
/**
 * Open short trade on Adrena
 *
 * Note: provide USDC as collateralMint to avoid swap
 * @returns Transaction signature
 */
export declare function openPerpTradeShort({ agent, price, collateralAmount, collateralMint, leverage, tradeMint, slippage, }: {
    agent: SolanaAgentKit;
    price: number;
    collateralAmount: number;
    collateralMint?: PublicKey;
    leverage?: number;
    tradeMint?: PublicKey;
    slippage?: number;
}): Promise<string>;
//# sourceMappingURL=adrena_perp_trading.d.ts.map