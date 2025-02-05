"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaGetWalletAddressTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaGetWalletAddressTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_get_wallet_address";
        this.description = `Get the wallet address of the agent`;
    }
    async _call(_input) {
        return this.solanaKit.wallet_address.toString();
    }
}
exports.SolanaGetWalletAddressTool = SolanaGetWalletAddressTool;
//# sourceMappingURL=wallet_address.js.map