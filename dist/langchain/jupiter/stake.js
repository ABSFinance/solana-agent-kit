"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaStakeTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaStakeTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_stake";
        this.description = `This tool can be used to stake your SOL (Solana), also called as SOL staking or liquid staking.

  Inputs ( input is a JSON string ):
  amount: number, eg 1 or 0.01 (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input) || Number(input);
            const tx = await this.solanaKit.stake(parsedInput.amount);
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
exports.SolanaStakeTool = SolanaStakeTool;
//# sourceMappingURL=stake.js.map