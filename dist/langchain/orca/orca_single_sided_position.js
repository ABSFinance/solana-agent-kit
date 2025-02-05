"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaOrcaOpenSingleSidedPosition = void 0;
const web3_js_1 = require("@solana/web3.js");
const decimal_js_1 = require("decimal.js");
const tools_1 = require("langchain/tools");
class SolanaOrcaOpenSingleSidedPosition extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "orca_open_single_sided_position";
        this.description = `Add liquidity to a CLMM by opening a single-sided position in an Orca Whirlpool, the most efficient liquidity pool on Solana.

  Inputs (JSON string):
  - whirlpoolAddress: string, address of the Orca Whirlpool (required).
  - distanceFromCurrentPriceBps: number, distance in basis points from the current price for the position (required).
  - widthBps: number, width of the position in basis points (required).
  - inputTokenMint: string, mint address of the deposit token (required).
  - inputAmount: number, amount of the deposit token, e.g., 100.0 (required).`;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const whirlpoolAddress = new web3_js_1.PublicKey(inputFormat.whirlpoolAddress);
            const distanceFromCurrentPriceBps = inputFormat.distanceFromCurrentPriceBps;
            const widthBps = inputFormat.widthBps;
            const inputTokenMint = new web3_js_1.PublicKey(inputFormat.inputTokenMint);
            const inputAmount = new decimal_js_1.Decimal(inputFormat.inputAmount);
            if (distanceFromCurrentPriceBps < 0 || widthBps < 0) {
                throw new Error("Invalid distanceFromCurrentPriceBps or width. It must be equal or greater than 0.");
            }
            const txId = await this.solanaKit.orcaOpenSingleSidedPosition(whirlpoolAddress, distanceFromCurrentPriceBps, widthBps, inputTokenMint, inputAmount);
            return JSON.stringify({
                status: "success",
                message: "Single-sided liquidity position opened successfully.",
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
exports.SolanaOrcaOpenSingleSidedPosition = SolanaOrcaOpenSingleSidedPosition;
//# sourceMappingURL=orca_single_sided_position.js.map