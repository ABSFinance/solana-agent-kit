"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaClosePosition = void 0;
const web3_js_1 = require("@solana/web3.js");
const tools_1 = require("langchain/tools");
class SolanaClosePosition extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "orca_close_position";
        this.description = `Closes an existing liquidity position in an Orca Whirlpool. This function fetches the position
  details using the provided mint address and closes the position with a 1% slippage.

  Inputs (JSON string):
  - positionMintAddress: string, the address of the position mint that represents the liquidity position.`;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const positionMintAddress = new web3_js_1.PublicKey(inputFormat.positionMintAddress);
            const txId = await this.solanaKit.orcaClosePosition(positionMintAddress);
            return JSON.stringify({
                status: "success",
                message: "Liquidity position closed successfully.",
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
exports.SolanaClosePosition = SolanaClosePosition;
//# sourceMappingURL=orca_position.js.map