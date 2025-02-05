"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaGetOwnedTldDomains = void 0;
const tools_1 = require("langchain/tools");
class SolanaGetOwnedTldDomains extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_get_owned_tld_domains";
        this.description = `Get all domains owned by the agent's wallet for a specific TLD.

  Inputs:
  tld: string, eg "bonk" (required)`;
    }
    async _call(input) {
        try {
            const domains = await this.solanaKit.getOwnedDomainsForTLD(input);
            return JSON.stringify({
                status: "success",
                message: "TLD domains fetched successfully",
                domains,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "FETCH_TLD_DOMAINS_ERROR",
            });
        }
    }
}
exports.SolanaGetOwnedTldDomains = SolanaGetOwnedTldDomains;
//# sourceMappingURL=tld_domains.js.map