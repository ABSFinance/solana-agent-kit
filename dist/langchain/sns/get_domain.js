"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaGetDomainTool = void 0;
const web3_js_1 = require("@solana/web3.js");
const tools_1 = require("langchain/tools");
class SolanaGetDomainTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_get_domain";
        this.description = `Retrieve the .sol domain associated for a given account address.

  Inputs:
  account: string, eg "4Be9CvxqHW6BYiRAxW9Q3xu1ycTMWaL5z8NX4HR3ha7t" (required)
  `;
    }
    async _call(input) {
        try {
            const account = new web3_js_1.PublicKey(input.trim());
            const domain = await this.solanaKit.getPrimaryDomain(account);
            return JSON.stringify({
                status: "success",
                message: "Primary domain retrieved successfully",
                domain,
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
exports.SolanaGetDomainTool = SolanaGetDomainTool;
//# sourceMappingURL=get_domain.js.map