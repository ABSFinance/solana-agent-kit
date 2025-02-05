"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaResolveDomainTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaResolveDomainTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_resolve_domain";
        this.description = `Resolve ONLY .sol domain names to a Solana PublicKey.
  This tool is exclusively for .sol domains.
  DO NOT use this for other domain types like .blink, .bonk, etc.

  Inputs:
  domain: string, eg "pumpfun.sol" (required)
  `;
    }
    async _call(input) {
        try {
            const domain = input.trim();
            const publicKey = await this.solanaKit.resolveSolDomain(domain);
            return JSON.stringify({
                status: "success",
                message: "Domain resolved successfully",
                publicKey: publicKey.toBase58(),
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
exports.SolanaResolveDomainTool = SolanaResolveDomainTool;
//# sourceMappingURL=resolve_domain.js.map