"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaRaydiumCreateAmmV4 = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const tools_1 = require("langchain/tools");
class SolanaRaydiumCreateAmmV4 extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "raydium_create_ammV4";
        this.description = `Raydium's Legacy AMM that requires an OpenBook marketID

  Inputs (input is a json string):
  marketId: string (required)
  baseAmount: number(int), eg: 111111 (required)
  quoteAmount: number(int), eg: 111111 (required)
  startTime: number(seconds), eg: now number or zero (required)
  `;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const tx = await this.solanaKit.raydiumCreateAmmV4(new web3_js_1.PublicKey(inputFormat.marketId), new anchor_1.BN(inputFormat.baseAmount), new anchor_1.BN(inputFormat.quoteAmount), new anchor_1.BN(inputFormat.startTime));
            return JSON.stringify({
                status: "success",
                message: "Raydium amm v4 pool created successfully",
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
exports.SolanaRaydiumCreateAmmV4 = SolanaRaydiumCreateAmmV4;
//# sourceMappingURL=raydium_amm.js.map