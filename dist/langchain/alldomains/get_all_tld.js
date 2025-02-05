"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaGetAllTlds = void 0;
const tools_1 = require("langchain/tools");
class SolanaGetAllTlds extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_get_all_tlds";
        this.description = `Get all active top-level domains (TLDs) in the AllDomains Name Service`;
    }
    async _call() {
        try {
            const tlds = await this.solanaKit.getAllDomainsTLDs();
            return JSON.stringify({
                status: "success",
                message: "TLDs fetched successfully",
                tlds,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "FETCH_TLDS_ERROR",
            });
        }
    }
}
exports.SolanaGetAllTlds = SolanaGetAllTlds;
//# sourceMappingURL=get_all_tld.js.map