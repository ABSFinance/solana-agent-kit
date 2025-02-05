"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaOrcaFetchPositions = void 0;
const tools_1 = require("langchain/tools");
class SolanaOrcaFetchPositions extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "orca_fetch_positions";
        this.description = `Fetch all the liquidity positions in an Orca Whirlpool by owner. Returns an object with positiont mint addresses as keys and position status details as values.`;
    }
    async _call() {
        try {
            const txId = await this.solanaKit.orcaFetchPositions();
            return JSON.stringify({
                status: "success",
                message: "Liquidity positions fetched.",
                transaction: txId,
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
exports.SolanaOrcaFetchPositions = SolanaOrcaFetchPositions;
//# sourceMappingURL=orca_fetch_positions.js.map