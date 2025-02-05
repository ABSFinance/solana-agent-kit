"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaDriftSpotTokenSwapTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaDriftSpotTokenSwapTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "drift_spot_token_swap";
        this.description = `Swap spot tokens on Drift protocol.
  
  Inputs (JSON string):
  - fromSymbol: string, symbol of token to swap from (required)
  - toSymbol: string, symbol of token to swap to (required)
  - fromAmount: number, amount to swap from (optional) required if toAmount is not provided
  - toAmount: number, amount to swap to (optional) required if fromAmount is not provided
  - slippage: number, slippage tolerance in percentage (optional)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const tx = await this.solanaKit.driftSpotTokenSwap(parsedInput);
            return JSON.stringify({
                status: "success",
                message: `Swapped ${parsedInput.fromAmount} ${parsedInput.fromSymbol} for ${parsedInput.toSymbol}`,
                signature: tx,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "DRIFT_SPOT_TOKEN_SWAP_ERROR",
            });
        }
    }
}
exports.SolanaDriftSpotTokenSwapTool = SolanaDriftSpotTokenSwapTool;
//# sourceMappingURL=swap_spot_token.js.map