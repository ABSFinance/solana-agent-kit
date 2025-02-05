import { OraclePrice } from "flash-sdk";
import { PoolConfig, Token, PerpetualsClient, Privilege } from "flash-sdk";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";
import { SolanaAgentKit } from "../index";
export declare const POOL_CONFIGS: PoolConfig[];
export declare const ALL_TOKENS: Token[];
export declare const ALL_CUSTODIES: import("flash-sdk").CustodyConfig[];
export declare const OPEN_POSITION_CU = 150000;
export declare const CLOSE_POSITION_CU = 180000;
export interface PythPriceEntry {
    price: OraclePrice;
    emaPrice: OraclePrice;
    isStale: boolean;
    status: PriceStatus;
}
export declare enum PriceStatus {
    Trading = 0,
    Unknown = 1,
    Halted = 2,
    Auction = 3
}
export declare const fetchOraclePrice: (symbol: string) => Promise<PythPriceEntry>;
export interface MarketInfo {
    [key: string]: {
        tokenPair: string;
        token: string;
        side: string;
        pool: string;
    };
}
declare const marketSdkInfo: MarketInfo;
export { marketSdkInfo };
export interface MarketTokenSides {
    [token: string]: {
        long?: {
            marketID: string;
        };
        short?: {
            marketID: string;
        };
    };
}
declare const marketTokenMap: MarketTokenSides;
export { marketTokenMap };
interface TradingAccountResult {
    nftReferralAccountPK: PublicKey | null;
    nftTradingAccountPk: PublicKey | null;
    nftOwnerRebateTokenAccountPk: PublicKey | null;
}
export declare function getNftTradingAccountInfo(userPublicKey: PublicKey, perpClient: PerpetualsClient, poolConfig: PoolConfig, collateralCustodySymbol: string): Promise<TradingAccountResult>;
/**
 * Creates a new PerpetualsClient instance with the given connection and wallet
 * @param connection Solana connection
 * @param wallet Solana wallet
 * @returns PerpetualsClient instance
 */
export declare function createPerpClient(connection: Connection, wallet: Keypair): PerpetualsClient;
export declare function get_flash_privilege(agent: SolanaAgentKit): Privilege;
//# sourceMappingURL=flashUtils.d.ts.map