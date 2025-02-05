"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaOrcaOpenCenteredPosition = void 0;
const web3_js_1 = require("@solana/web3.js");
const decimal_js_1 = require("decimal.js");
const tools_1 = require("langchain/tools");
class SolanaOrcaOpenCenteredPosition extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "orca_open_centered_position_with_liquidity";
        this.description = `Add liquidity to a CLMM by opening a centered position in an Orca Whirlpool, the most efficient liquidity pool on Solana.

  Inputs (JSON string):
  - whirlpoolAddress: string, address of the Orca Whirlpool (required).
  - priceOffsetBps: number, bps offset (one side) from the current pool price, e.g., 500 for 5% (required).
  - inputTokenMint: string, mint address of the deposit token (required).
  - inputAmount: number, amount of the deposit token, e.g., 100.0 (required).`;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const whirlpoolAddress = new web3_js_1.PublicKey(inputFormat.whirlpoolAddress);
            const priceOffsetBps = parseInt(inputFormat.priceOffsetBps, 10);
            const inputTokenMint = new web3_js_1.PublicKey(inputFormat.inputTokenMint);
            const inputAmount = new decimal_js_1.Decimal(inputFormat.inputAmount);
            if (priceOffsetBps < 0) {
                throw new Error("Invalid distanceFromCurrentPriceBps. It must be equal or greater than 0.");
            }
            const txId = await this.solanaKit.orcaOpenCenteredPositionWithLiquidity(whirlpoolAddress, priceOffsetBps, inputTokenMint, inputAmount);
            return JSON.stringify({
                status: "success",
                message: "Centered liquidity position opened successfully.",
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
exports.SolanaOrcaOpenCenteredPosition = SolanaOrcaOpenCenteredPosition;
//# sourceMappingURL=orca_centered_position.js.map