"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTransaction = parseTransaction;
/**
 * Parse a Solana transaction using the Helius Enhanced Transactions API
 * @param agent SolanaAgentKit instance
 * @param transactionId The transaction ID to parse
 * @returns Parsed transaction data
 */
async function parseTransaction(agent, transactionId) {
    try {
        const apiKey = agent.config.HELIUS_API_KEY;
        if (!apiKey) {
            throw new Error("HELIUS_API_KEY not found in environment variables");
        }
        const url = `https://api.helius.xyz/v0/transactions/?api-key=${apiKey}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                transactions: [transactionId],
            }),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error parsing transaction: ", error.message);
        throw new Error(`Transaction parsing failed: ${error.message}`);
    }
}
//# sourceMappingURL=helius_transaction_parsing.js.map