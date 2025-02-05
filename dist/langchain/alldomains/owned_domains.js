"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaGetOwnedDomains = void 0;
const web3_js_1 = require("@solana/web3.js");
const tools_1 = require("langchain/tools");
class SolanaGetOwnedDomains extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_get_owned_domains";
        this.description = `Get all domains owned by a specific wallet address.

  Inputs:
  owner: string, eg "4Be9CvxqHW6BYiRAxW9Q3xu1ycTMWaL5z8NX4HR3ha7t" (required)`;
    }
    async _call(input) {
        try {
            const ownerPubkey = new web3_js_1.PublicKey(input.trim());
            const domains = await this.solanaKit.getOwnedAllDomains(ownerPubkey);
            return JSON.stringify({
                status: "success",
                message: "Owned domains fetched successfully",
                domains,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "FETCH_OWNED_DOMAINS_ERROR",
            });
        }
    }
}
exports.SolanaGetOwnedDomains = SolanaGetOwnedDomains;
//# sourceMappingURL=owned_domains.js.map