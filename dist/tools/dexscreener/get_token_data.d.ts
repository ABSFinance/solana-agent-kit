import { PublicKey } from "@solana/web3.js";
import { JupiterTokenData } from "../../types";
export declare function getTokenDataByAddress(mint: PublicKey): Promise<JupiterTokenData | undefined>;
export declare function getTokenAddressFromTicker(ticker: string): Promise<string | null>;
export declare function getTokenDataByTicker(ticker: string): Promise<JupiterTokenData | undefined>;
//# sourceMappingURL=get_token_data.d.ts.map