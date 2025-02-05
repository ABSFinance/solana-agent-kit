"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaGetMainDomain = void 0;
const web3_js_1 = require("@solana/web3.js");
const tools_1 = require("langchain/tools");
class SolanaGetMainDomain extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_get_main_domain";
        this.description = `Get the main/favorite domain for a given wallet address.

  Inputs:
  owner: string, eg "4Be9CvxqHW6BYiRAxW9Q3xu1ycTMWaL5z8NX4HR3ha7t" (required)`;
    }
    async _call(input) {
        try {
            const ownerPubkey = new web3_js_1.PublicKey(input.trim());
            const mainDomain = await this.solanaKit.getMainAllDomainsDomain(ownerPubkey);
            return JSON.stringify({
                status: "success",
                message: "Main domain fetched successfully",
                domain: mainDomain,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "FETCH_MAIN_DOMAIN_ERROR",
            });
        }
    }
}
exports.SolanaGetMainDomain = SolanaGetMainDomain;
//# sourceMappingURL=main_domain.js.map