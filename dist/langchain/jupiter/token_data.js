"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaTokenDataTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaTokenDataTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_token_data";
        this.description = `Get the token data for a given token mint address

  Inputs: mintAddress is required.
  mintAddress: string, eg "So11111111111111111111111111111111111111112" (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = input.trim();
            const tokenData = await this.solanaKit.getTokenDataByAddress(parsedInput);
            return JSON.stringify({
                status: "success",
                tokenData,
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
exports.SolanaTokenDataTool = SolanaTokenDataTool;
//# sourceMappingURL=token_data.js.map