"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaRestakeTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaRestakeTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_restake";
        this.description = `This tool can be used to restake your SOL on Solayer to receive Solayer SOL (sSOL) as a Liquid Staking Token (LST).

  Inputs:
  amount: number, eg 1 or 0.01 (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input) || Number(input);
            const tx = await this.solanaKit.restake(parsedInput.amount);
            return JSON.stringify({
                status: "success",
                message: "Staked successfully",
                transaction: tx,
                amount: parsedInput.amount,
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
exports.SolanaRestakeTool = SolanaRestakeTool;
//# sourceMappingURL=restake.js.map