"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaTPSCalculatorTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaTPSCalculatorTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_get_tps";
        this.description = "Get the current TPS of the Solana network";
    }
    async _call(_input) {
        try {
            const tps = await this.solanaKit.getTPS();
            return `Solana (mainnet-beta) current transactions per second: ${tps}`;
        }
        catch (error) {
            return `Error fetching TPS: ${error.message}`;
        }
    }
}
exports.SolanaTPSCalculatorTool = SolanaTPSCalculatorTool;
//# sourceMappingURL=get_tps.js.map