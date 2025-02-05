"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaTipLinkTool = void 0;
const web3_js_1 = require("@solana/web3.js");
const tools_1 = require("langchain/tools");
class SolanaTipLinkTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_tiplink";
        this.description = `Create a TipLink for transferring SOL or SPL tokens.
  Input is a JSON string with:
  - amount: number (required) - Amount to transfer
  - splmintAddress: string (optional) - SPL token mint address`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            if (!parsedInput.amount) {
                throw new Error("Amount is required");
            }
            const amount = parseFloat(parsedInput.amount);
            const splmintAddress = parsedInput.splmintAddress
                ? new web3_js_1.PublicKey(parsedInput.splmintAddress)
                : undefined;
            const { url, signature } = await this.solanaKit.createTiplink(amount, splmintAddress);
            return JSON.stringify({
                status: "success",
                url,
                signature,
                amount,
                tokenType: splmintAddress ? "SPL" : "SOL",
                message: `TipLink created successfully`,
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
exports.SolanaTipLinkTool = SolanaTipLinkTool;
//# sourceMappingURL=tiplink.js.map