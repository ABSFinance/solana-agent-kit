"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaOrcaCreateCLMM = void 0;
const web3_js_1 = require("@solana/web3.js");
const decimal_js_1 = require("decimal.js");
const orca_1 = require("../../tools/orca");
const tools_1 = require("langchain/tools");
class SolanaOrcaCreateCLMM extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "orca_create_clmm";
        this.description = `Create a Concentrated Liquidity Market Maker (CLMM) pool on Orca, the most efficient and capital-optimized CLMM on Solana. This function initializes a CLMM pool but does not add liquidity. You can add liquidity later using a centered position or a single-sided position.

  Inputs (JSON string):
  - mintDeploy: string, the mint of the token you want to deploy (required).
  - mintPair: string, The mint of the token you want to pair the deployed mint with (required).
  - initialPrice: number, initial price of mintA in terms of mintB, e.g., 0.001 (required).
  - feeTier: number, fee tier in bps. Options: 1, 2, 4, 5, 16, 30, 65, 100, 200 (required).`;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const mintA = new web3_js_1.PublicKey(inputFormat.mintDeploy);
            const mintB = new web3_js_1.PublicKey(inputFormat.mintPair);
            const initialPrice = new decimal_js_1.Decimal(inputFormat.initialPrice);
            const feeTier = inputFormat.feeTier;
            if (!feeTier || !(feeTier in orca_1.FEE_TIERS)) {
                throw new Error(`Invalid feeTier. Available options: ${Object.keys(orca_1.FEE_TIERS).join(", ")}`);
            }
            const txId = await this.solanaKit.orcaCreateCLMM(mintA, mintB, initialPrice, feeTier);
            return JSON.stringify({
                status: "success",
                message: "CLMM pool created successfully. Note: No liquidity was added.",
                transaction: txId,
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
exports.SolanaOrcaCreateCLMM = SolanaOrcaCreateCLMM;
//# sourceMappingURL=orca_clmm.js.map