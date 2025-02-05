"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaLimitOrderTool = void 0;
const web3_js_1 = require("@solana/web3.js");
const tools_1 = require("langchain/tools");
class SolanaLimitOrderTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_limit_order";
        this.description = `This tool can be used to place limit orders using Manifest.

  Do not allow users to place multiple orders with this instruction, use solana_batch_order instead.

  Inputs ( input is a JSON string ):
  marketId: PublicKey, eg "ENhU8LsaR7vDD2G1CsWcsuSGNrih9Cv5WZEk7q9kPapQ" for SOL/USDC (required)
  quantity: number, eg 1 or 0.01 (required)
  side: string, eg "Buy" or "Sell" (required)
  price: number, in tokens eg 200 for SOL/USDC (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const tx = await this.solanaKit.limitOrder(new web3_js_1.PublicKey(parsedInput.marketId), parsedInput.quantity, parsedInput.side, parsedInput.price);
            return JSON.stringify({
                status: "success",
                message: "Trade executed successfully",
                transaction: tx,
                marketId: parsedInput.marketId,
                quantity: parsedInput.quantity,
                side: parsedInput.side,
                price: parsedInput.price,
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
exports.SolanaLimitOrderTool = SolanaLimitOrderTool;
//# sourceMappingURL=limit_order.js.map