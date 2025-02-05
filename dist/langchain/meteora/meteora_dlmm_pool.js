"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaMeteoraCreateDlmmPool = void 0;
const web3_js_1 = require("@solana/web3.js");
const tools_1 = require("langchain/tools");
const bn_js_1 = require("bn.js");
class SolanaMeteoraCreateDlmmPool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "meteora_create_dlmm_pool";
        this.description = `Create a Meteora DLMM Pool. This function doesn't add liquidity.
  
  Inputs (JSON string):
  - tokenAMint: string, token A mint (required).
  - tokenBMint: string, token B mint (required).
  - binStep: number, pool bin step, e.g., 20 (required).
  - initialPrice: number, pool initial price, e.g., 0.25 (required).
  - feeBps: number, trade fee in percentage, e.g. 20 for 0.2% (required).
  - priceRoundingUp: boolean, whether the initial price should be rounded up or not, default is true (optional).
  - activationType: number, pool start trading time indicator. 0 is slot and 1 is timestamp, default is 1 for timestamp (optional).
  - activationPoint: number, pool start trading slot / timestamp, default is null means pool can start trading immediately (optional).
  - hasAlphaVault: boolean, whether the pool supports alpha vault, default is false (optional).
  `;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const tokenAMint = new web3_js_1.PublicKey(inputFormat.tokenAMint);
            const tokenBMint = new web3_js_1.PublicKey(inputFormat.tokenBMint);
            const binStep = inputFormat.binStep;
            const initialPrice = inputFormat.initialPrice;
            const feeBps = inputFormat.feeBps;
            const priceRoundingUp = inputFormat.priceRoundingUp ?? true;
            const activationType = inputFormat.activationType ?? 1;
            const activationPoint = inputFormat.activationPoint
                ? new bn_js_1.BN(inputFormat.activationPoint)
                : undefined;
            const hasAlphaVault = inputFormat.hasAlphaVault ?? false;
            const txId = await this.solanaKit.meteoraCreateDlmmPool(tokenAMint, tokenBMint, binStep, initialPrice, priceRoundingUp, feeBps, activationType, hasAlphaVault, activationPoint);
            return JSON.stringify({
                status: "success",
                message: "Meteora DLMM pool created successfully.",
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
exports.SolanaMeteoraCreateDlmmPool = SolanaMeteoraCreateDlmmPool;
//# sourceMappingURL=meteora_dlmm_pool.js.map