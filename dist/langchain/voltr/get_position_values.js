"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaVoltrGetPositionValues = void 0;
const tools_1 = require("langchain/tools");
const web3_js_1 = require("@solana/web3.js");
class SolanaVoltrGetPositionValues extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_voltr_get_position_values";
        this.description = `Get the total asset value and current value for each strategy of a given Voltr vault
    
    Inputs:
    vault: string (required)
    `;
    }
    async _call(input) {
        return this.solanaKit.voltrGetPositionValues(new web3_js_1.PublicKey(input));
    }
}
exports.SolanaVoltrGetPositionValues = SolanaVoltrGetPositionValues;
//# sourceMappingURL=get_position_values.js.map