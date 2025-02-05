"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaOpenbookCreateMarket = void 0;
const web3_js_1 = require("@solana/web3.js");
const tools_1 = require("langchain/tools");
class SolanaOpenbookCreateMarket extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_openbook_create_market";
        this.description = `Openbook marketId, required for ammv4

  Inputs (input is a json string):
  baseMint: string (required)
  quoteMint: string (required)
  lotSize: number (required)
  tickSize: number (required)
  `;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const tx = await this.solanaKit.openbookCreateMarket(new web3_js_1.PublicKey(inputFormat.baseMint), new web3_js_1.PublicKey(inputFormat.quoteMint), inputFormat.lotSize, inputFormat.tickSize);
            return JSON.stringify({
                status: "success",
                message: "Openbook market created successfully",
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
exports.SolanaOpenbookCreateMarket = SolanaOpenbookCreateMarket;
//# sourceMappingURL=openbook_market.js.map