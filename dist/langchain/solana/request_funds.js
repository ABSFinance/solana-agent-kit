"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaRequestFundsTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaRequestFundsTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_request_funds";
        this.description = "Request SOL from Solana faucet (devnet/testnet only)";
    }
    async _call(_input) {
        try {
            await this.solanaKit.requestFaucetFunds();
            return JSON.stringify({
                status: "success",
                message: "Successfully requested faucet funds",
                network: this.solanaKit.connection.rpcEndpoint.split("/")[2],
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
exports.SolanaRequestFundsTool = SolanaRequestFundsTool;
//# sourceMappingURL=request_funds.js.map