import { PublicKey } from "@solana/web3.js";
/**
 * Common token addresses used across the toolkit
 */
export declare const TOKENS: {
    readonly USDC: PublicKey;
    readonly USDT: PublicKey;
    readonly USDS: PublicKey;
    readonly SOL: PublicKey;
    readonly jitoSOL: PublicKey;
    readonly bSOL: PublicKey;
    readonly mSOL: PublicKey;
    readonly BONK: PublicKey;
};
/**
 * Default configuration options
 * @property {number} SLIPPAGE_BPS - Default slippage tolerance in basis points (300 = 3%)
 * @property {number} TOKEN_DECIMALS - Default number of decimals for new tokens
 * @property {number} LEVERAGE_BPS - Default leverage for trading PERP
 */
export declare const DEFAULT_OPTIONS: {
    readonly SLIPPAGE_BPS: 300;
    readonly TOKEN_DECIMALS: 9;
    readonly RERERRAL_FEE: 200;
    readonly LEVERAGE_BPS: 50000;
};
export declare const METEORA_DYNAMIC_FEE_DENOMINATOR = 100000;
/**
 * Jupiter API URL
 */
export declare const JUP_API = "https://quote-api.jup.ag/v6";
export declare const JUP_REFERRAL_ADDRESS = "REFER4ZgmyYx9c6He5XfaTMiGfdLwRnkV4RPp9t9iF3";
export declare const METEORA_DYNAMIC_AMM_PROGRAM_ID: PublicKey;
export declare const METEORA_DLMM_PROGRAM_ID: PublicKey;
/**
 * Minimum compute price required to carry out complex transactions on the Drift protocol
 */
export declare const MINIMUM_COMPUTE_PRICE_FOR_COMPLEX_ACTIONS: number;
//# sourceMappingURL=index.d.ts.map