"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaVoltrDepositStrategy = void 0;
const tools_1 = require("langchain/tools");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = require("bn.js");
class SolanaVoltrDepositStrategy extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_voltr_deposit_strategy";
        this.description = `Deposit amount into a strategy for Voltr's vaults
    
    Inputs (input is a json string):
    depositAmount: number (required)
    vault: string (required)
    strategy: string (required)
    `;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const tx = await this.solanaKit.voltrDepositStrategy(new bn_js_1.BN(inputFormat.depositAmount), new web3_js_1.PublicKey(inputFormat.vault), new web3_js_1.PublicKey(inputFormat.strategy));
            return JSON.stringify({
                status: "success",
                message: `Deposited ${inputFormat.depositAmount} into strategy ${inputFormat.strategy} of vault ${inputFormat.vault} successfully`,
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
exports.SolanaVoltrDepositStrategy = SolanaVoltrDepositStrategy;
//# sourceMappingURL=deposit_strategy.js.map