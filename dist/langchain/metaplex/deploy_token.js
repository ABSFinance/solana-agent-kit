"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaDeployTokenTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaDeployTokenTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_deploy_token";
        this.description = `Deploy a new token on Solana blockchain.

  Inputs (input is a JSON string):
  name: string, eg "My Token" (required)
  uri: string, eg "https://example.com/token.json" (required)
  symbol: string, eg "MTK" (required)
  decimals?: number, eg 9 (optional, defaults to 9)
  initialSupply?: number, eg 1000000 (optional)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const result = await this.solanaKit.deployToken(parsedInput.name, parsedInput.uri, parsedInput.symbol, parsedInput.decimals, parsedInput.initialSupply);
            return JSON.stringify({
                status: "success",
                message: "Token deployed successfully",
                mintAddress: result.mint.toString(),
                decimals: parsedInput.decimals || 9,
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
exports.SolanaDeployTokenTool = SolanaDeployTokenTool;
//# sourceMappingURL=deploy_token.js.map