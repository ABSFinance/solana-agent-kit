"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaTradeTool = void 0;
const tools_1 = require("langchain/tools");
const web3_js_1 = require("@solana/web3.js");
class SolanaTradeTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_trade";
        this.description = `This tool can be used to swap tokens to another token ( It uses Jupiter Exchange ).

  Inputs ( input is a JSON string ):
  outputMint: string, eg "So11111111111111111111111111111111111111112" or "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa" (required)
  inputAmount: number, eg 1 or 0.01 (required)
  inputMint?: string, eg "So11111111111111111111111111111111111111112" (optional)
  slippageBps?: number, eg 100 (optional)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const tx = await this.solanaKit.trade(new web3_js_1.PublicKey(parsedInput.outputMint), parsedInput.inputAmount, parsedInput.inputMint
                ? new web3_js_1.PublicKey(parsedInput.inputMint)
                : new web3_js_1.PublicKey("So11111111111111111111111111111111111111112"), parsedInput.slippageBps);
            return JSON.stringify({
                status: "success",
                message: "Trade executed successfully",
                transaction: tx,
                inputAmount: parsedInput.inputAmount,
                inputToken: parsedInput.inputMint || "SOL",
                outputToken: parsedInput.outputMint,
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
exports.SolanaTradeTool = SolanaTradeTool;
//# sourceMappingURL=trade.js.map