"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaRockPaperScissorsTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaRockPaperScissorsTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "rock_paper_scissors";
        this.description = `Play rock paper scissors to win SEND coins.

  Inputs (input is a JSON string):
  choice: string, either "rock", "paper", or "scissors" (required)
  amount: number, amount of SOL to play with - must be 0.1, 0.01, or 0.005 SOL (required)`;
    }
    validateInput(input) {
        if (input.choice !== undefined) {
            throw new Error("choice is required.");
        }
        if (input.amount !== undefined &&
            (typeof input.spaceKB !== "number" || input.spaceKB <= 0)) {
            throw new Error("amount must be a positive number when provided");
        }
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            this.validateInput(parsedInput);
            const result = await this.solanaKit.rockPaperScissors(Number(parsedInput['"amount"']), parsedInput['"choice"'].replace(/^"|"$/g, ""));
            return JSON.stringify({
                status: "success",
                message: result,
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
exports.SolanaRockPaperScissorsTool = SolanaRockPaperScissorsTool;
//# sourceMappingURL=rock_paper_scissors.js.map