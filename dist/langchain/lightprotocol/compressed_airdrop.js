"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaCompressedAirdropTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaCompressedAirdropTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_compressed_airdrop";
        this.description = `Airdrop SPL tokens with ZK Compression (also called as airdropping tokens)

  Inputs (input is a JSON string):
  mintAddress: string, the mint address of the token, e.g., "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN" (required)
  amount: number, the amount of tokens to airdrop per recipient, e.g., 42 (required)
  decimals: number, the decimals of the token, e.g., 6 (required)
  recipients: string[], the recipient addresses, e.g., ["1nc1nerator11111111111111111111111111111111"] (required)
  priorityFeeInLamports: number, the priority fee in lamports. Default is 30_000. (optional)
  shouldLog: boolean, whether to log progress to stdout. Default is false. (optional)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const txs = await this.solanaKit.sendCompressedAirdrop(parsedInput.mintAddress, parsedInput.amount, parsedInput.decimals, parsedInput.recipients, parsedInput.priorityFeeInLamports || 30000, parsedInput.shouldLog || false);
            return JSON.stringify({
                status: "success",
                message: `Airdropped ${parsedInput.amount} tokens to ${parsedInput.recipients.length} recipients.`,
                transactionHashes: txs,
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
exports.SolanaCompressedAirdropTool = SolanaCompressedAirdropTool;
//# sourceMappingURL=compressed_airdrop.js.map