"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaRaydiumCreateCpmm = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const tools_1 = require("langchain/tools");
class SolanaRaydiumCreateCpmm extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "raydium_create_cpmm";
        this.description = `Raydium's newest CPMM, does not require marketID, supports Token 2022 standard

  Inputs (input is a json string):
  mint1: string (required)
  mint2: string (required)
  configId: string (required), stores pool info, index, protocolFeeRate, tradeFeeRate, fundFeeRate, createPoolFee
  mintAAmount: number(int), eg: 1111 (required)
  mintBAmount: number(int), eg: 2222 (required)
  startTime: number(seconds), eg: now number or zero (required)
  `;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const tx = await this.solanaKit.raydiumCreateCpmm(new web3_js_1.PublicKey(inputFormat.mint1), new web3_js_1.PublicKey(inputFormat.mint2), new web3_js_1.PublicKey(inputFormat.configId), new anchor_1.BN(inputFormat.mintAAmount), new anchor_1.BN(inputFormat.mintBAmount), new anchor_1.BN(inputFormat.startTime));
            return JSON.stringify({
                status: "success",
                message: "Raydium cpmm pool created successfully",
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
exports.SolanaRaydiumCreateCpmm = SolanaRaydiumCreateCpmm;
//# sourceMappingURL=raydium_cpmm.js.map