"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaFlashCloseTrade = void 0;
const tools_1 = require("langchain/tools");
class SolanaFlashCloseTrade extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_flash_close_trade";
        this.description = `Close an existing leveraged trading position on Flash.Trade exchange.

  Inputs ( input is a JSON string ):
  token: string, eg "SOL", "BTC", "ETH" (required)
  side: string, eg "long", "short" (required)
  
  Example prompt is Close a 20x leveraged trade for SOL on long side`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            // Validate input parameters
            if (!parsedInput.token) {
                throw new Error("Token is required");
            }
            if (!["SOL", "BTC", "ETH"].includes(parsedInput.token)) {
                throw new Error('Token must be one of ["SOL", "BTC", "ETH"]');
            }
            if (!["long", "short"].includes(parsedInput.side)) {
                throw new Error('Side must be either "long" or "short"');
            }
            const tx = await this.solanaKit.flashCloseTrade({
                token: parsedInput.token,
                side: parsedInput.side,
            });
            return JSON.stringify({
                status: "success",
                message: "Flash trade position closed successfully",
                transaction: tx,
                token: parsedInput.token,
                side: parsedInput.side,
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
exports.SolanaFlashCloseTrade = SolanaFlashCloseTrade;
//# sourceMappingURL=flash_close.js.map