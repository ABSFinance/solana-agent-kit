"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaManifestCreateMarket = void 0;
const web3_js_1 = require("@solana/web3.js");
const tools_1 = require("langchain/tools");
class SolanaManifestCreateMarket extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_manifest_create_market";
        this.description = `Manifest market

  Inputs (input is a json string):
  baseMint: string (required)
  quoteMint: string (required)
  `;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const tx = await this.solanaKit.manifestCreateMarket(new web3_js_1.PublicKey(inputFormat.baseMint), new web3_js_1.PublicKey(inputFormat.quoteMint));
            return JSON.stringify({
                status: "success",
                message: "Create manifest market successfully",
                transaction: tx[0],
                marketId: tx[1],
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
exports.SolanaManifestCreateMarket = SolanaManifestCreateMarket;
//# sourceMappingURL=manifest_market.js.map