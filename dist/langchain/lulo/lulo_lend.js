"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaLuloLendTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaLuloLendTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_lulo_lend";
        this.description = `Lend token for yield using Lulo. (support USDC/PYUSD/USDS/USDT/SOL/jitoSOL/bSOL/mSOL/BONK/JUP)
    Inputs:
    mintAddress: string, eg "So11111111111111111111111111111111111111112" (required)
    amount: number, eg 1, 0.01 (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const mintAddress = parsedInput.mintAddress;
            const amount = parsedInput.amount;
            const tx = await this.solanaKit.luloLend(mintAddress, amount);
            return JSON.stringify({
                status: "success",
                message: "Asset lent successfully",
                transaction: tx,
                amount,
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
exports.SolanaLuloLendTool = SolanaLuloLendTool;
//# sourceMappingURL=lulo_lend.js.map