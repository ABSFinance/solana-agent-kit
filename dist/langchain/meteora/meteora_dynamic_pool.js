"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaMeteoraCreateDynamicPool = void 0;
const web3_js_1 = require("@solana/web3.js");
const tools_1 = require("langchain/tools");
const bn_js_1 = require("bn.js");
const spl_token_1 = require("@solana/spl-token");
const decimal_js_1 = __importDefault(require("decimal.js"));
class SolanaMeteoraCreateDynamicPool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "meteora_create_dynamic_pool";
        this.description = `Create a Meteora Dynamic Pool. This function adds liquidity with a constant-product formula.
  
  Inputs (JSON string):
  - tokenAMint: string, token A mint (required).
  - tokenBMint: string, token B mint (required).
  - tokenAAmount: number, token A amount not including decimals, e.g., 1 (required).
  - tokenBAmount: number, token B amount not including decimals, e.g., 0.2 (required).
  - tradeFeeNumerator: number, trade fee numerator, e.g., 2500 for 2.5% (required).
  - activationType: number, pool start trading time indicator, 0 is slot and 1 is timestamp, default is 1 for timestamp (optional).
  - activationPoint: number, pool start trading slot / timestamp, default is null means pool can start trading immediately (optional).
  - hasAlphaVault: boolean, whether the pool supports alpha vault, default is false (optional).
  `;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const tokenAMint = new web3_js_1.PublicKey(inputFormat.tokenAMint);
            const tokenBMint = new web3_js_1.PublicKey(inputFormat.tokenBMint);
            const tokenAMintInfo = await this.solanaKit.connection.getAccountInfo(tokenAMint);
            const tokenBMintInfo = await this.solanaKit.connection.getAccountInfo(tokenBMint);
            if (!tokenAMintInfo) {
                return JSON.stringify({
                    status: "error",
                    message: "failed to fetch tokenAMint info",
                    code: "UNKNOWN_ERROR",
                });
            }
            if (!tokenBMintInfo) {
                return JSON.stringify({
                    status: "error",
                    message: "failed to fetch tokenBMint info",
                    code: "UNKNOWN_ERROR",
                });
            }
            const tokenADecimals = spl_token_1.MintLayout.decode(tokenAMintInfo.data).decimals;
            const tokenBDecimals = spl_token_1.MintLayout.decode(tokenBMintInfo.data).decimals;
            const tokenAAmount = new bn_js_1.BN(new decimal_js_1.default(inputFormat.tokenAAmount)
                .mul(10 ** tokenADecimals)
                .toString());
            const tokenBAmount = new bn_js_1.BN(new decimal_js_1.default(inputFormat.tokenBAmount)
                .mul(10 ** tokenBDecimals)
                .toString());
            const tradeFeeNumerator = new bn_js_1.BN(inputFormat.tradeFeeNumerator.toString()).toNumber();
            const activationType = inputFormat.activationType ?? 1;
            const activationPoint = inputFormat.activationPoint
                ? new bn_js_1.BN(inputFormat.activationPoint)
                : null;
            const hasAlphaVault = inputFormat.hasAlphaVault ?? false;
            const txId = await this.solanaKit.meteoraCreateDynamicPool(tokenAMint, tokenBMint, tokenAAmount, tokenBAmount, tradeFeeNumerator, activationPoint, hasAlphaVault, activationType);
            return JSON.stringify({
                status: "success",
                message: "Meteora Dynamic pool created successfully.",
                transaction: txId,
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
exports.SolanaMeteoraCreateDynamicPool = SolanaMeteoraCreateDynamicPool;
//# sourceMappingURL=meteora_dynamic_pool.js.map