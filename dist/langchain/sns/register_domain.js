"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaRegisterDomainTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaRegisterDomainTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_register_domain";
        this.description = `Register a .sol domain name for your wallet.

  Inputs:
  name: string, eg "pumpfun.sol" (required)
  spaceKB: number, eg 1 (optional, default is 1)
  `;
    }
    validateInput(input) {
        if (!input.name || typeof input.name !== "string") {
            throw new Error("name is required and must be a string");
        }
        if (input.spaceKB !== undefined &&
            (typeof input.spaceKB !== "number" || input.spaceKB <= 0)) {
            throw new Error("spaceKB must be a positive number when provided");
        }
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            this.validateInput(parsedInput);
            const tx = await this.solanaKit.registerDomain(parsedInput.name, parsedInput.spaceKB || 1);
            return JSON.stringify({
                status: "success",
                message: "Domain registered successfully",
                transaction: tx,
                domain: `${parsedInput.name}.sol`,
                spaceKB: parsedInput.spaceKB || 1,
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
exports.SolanaRegisterDomainTool = SolanaRegisterDomainTool;
//# sourceMappingURL=register_domain.js.map