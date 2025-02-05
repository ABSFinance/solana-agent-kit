"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaResolveAllDomainsTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaResolveAllDomainsTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_resolve_all_domains";
        this.description = `Resolve domain names to a public key for ALL domain types EXCEPT .sol domains.
  Use this for domains like .blink, .bonk, etc.
  DO NOT use this for .sol domains (use solana_resolve_domain instead).

  Input:
  domain: string, eg "mydomain.blink" or "mydomain.bonk" (required)`;
    }
    async _call(input) {
        try {
            const owner = await this.solanaKit.resolveAllDomains(input);
            if (!owner) {
                return JSON.stringify({
                    status: "error",
                    message: "Domain not found",
                    code: "DOMAIN_NOT_FOUND",
                });
            }
            return JSON.stringify({
                status: "success",
                message: "Domain resolved successfully",
                owner: owner?.toString(),
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "DOMAIN_RESOLUTION_ERROR",
            });
        }
    }
}
exports.SolanaResolveAllDomainsTool = SolanaResolveAllDomainsTool;
//# sourceMappingURL=resolve_all_domains.js.map