"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaLuloWithdrawTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaLuloWithdrawTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_lulo_withdraw";
        this.description = `Withdraw token USDC using Lulo. (support USDC/PYUSD/USDS/USDT/SOL/jitoSOL/bSOL/mSOL/BONK/JUP)
    Inputs (input is a json string):
    mintAddress: string, eg "So11111111111111111111111111111111111111112" (required)
    amount: number, eg 1, 0.01 (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const mintAddress = parsedInput.mintAddress;
            const amount = parsedInput.amount;
            const tx = await this.solanaKit.luloWithdraw(mintAddress, amount);
            return JSON.stringify({
                status: "success",
                message: "Asset withdraw successfully",
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
exports.SolanaLuloWithdrawTool = SolanaLuloWithdrawTool;
//# sourceMappingURL=lulo_withdraw.js.map