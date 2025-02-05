"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaRaydiumCreateClmm = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const decimal_js_1 = require("decimal.js");
const tools_1 = require("langchain/tools");
class SolanaRaydiumCreateClmm extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "raydium_create_clmm";
        this.description = `Concentrated liquidity market maker, custom liquidity ranges, increased capital efficiency

  Inputs (input is a json string):
  mint1: string (required)
  mint2: string (required)
  configId: string (required) stores pool info, id, index, protocolFeeRate, tradeFeeRate, tickSpacing, fundFeeRate
  initialPrice: number, eg: 123.12 (required)
  startTime: number(seconds), eg: now number or zero (required)
  `;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const tx = await this.solanaKit.raydiumCreateClmm(new web3_js_1.PublicKey(inputFormat.mint1), new web3_js_1.PublicKey(inputFormat.mint2), new web3_js_1.PublicKey(inputFormat.configId), new decimal_js_1.Decimal(inputFormat.initialPrice), new anchor_1.BN(inputFormat.startTime));
            return JSON.stringify({
                status: "success",
                message: "Raydium clmm pool created successfully",
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
exports.SolanaRaydiumCreateClmm = SolanaRaydiumCreateClmm;
//# sourceMappingURL=raydium_clmm.js.map