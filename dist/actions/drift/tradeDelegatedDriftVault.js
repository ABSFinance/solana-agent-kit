"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const tradeDelegatedDriftVaultAction = {
    name: "TRADE_DELEGATED_DRIFT_VAULT",
    similes: [
        "trade delegated drift vault",
        "trade delegated vault",
        "trade vault",
        "trade drift vault",
        "trade delegated vault",
        "trade vault",
        "trade drift vault",
        "open drift vault trade",
    ],
    description: "Carry out trades in a Drift vault.",
    examples: [
        [
            {
                input: {
                    vaultAddress: "J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w",
                    amount: 100,
                    symbol: "SOL",
                    action: "buy",
                    type: "market",
                },
                output: {
                    status: "success",
                    message: "Trade successful",
                    transactionId: "7nE9GvcwsqzYxmJLSrYmSB1V1YoJWVK1KWzAcWAzjXkN",
                    amount: 100,
                    symbol: "SOL",
                    action: "buy",
                    type: "market",
                },
                explanation: "Buy 100 SOL in the vault",
            },
        ],
        [
            {
                input: {
                    vaultAddress: "J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w",
                    amount: 50,
                    symbol: "SOL",
                    action: "sell",
                    type: "limit",
                    price: 200,
                },
                output: {
                    status: "success",
                    message: "Order placed successful",
                    transactionId: "8nE9GvcwsqzYxmJLSrYmSB1V1YoJWVK1KWzAcWAzjXkM",
                    amount: 50,
                    symbol: "SOL",
                    action: "sell",
                    type: "limit",
                    price: 200,
                },
                explanation: "Sell 50 SOL in the vault at $200",
            },
        ],
    ],
    schema: zod_1.z.object({
        vaultAddress: zod_1.z.string().describe("Address of the Drift vault to trade in"),
        amount: zod_1.z
            .number()
            .positive()
            .describe("Amount to trade in normal token amounts e.g 50 SOL, 100 USDC, etc"),
        symbol: zod_1.z.string().describe("Symbol of the token to trade"),
        action: zod_1.z.enum(["long", "short"]).describe("Trade action - long or short"),
        type: zod_1.z.enum(["market", "limit"]).describe("Trade type - market or limit"),
        price: zod_1.z
            .number()
            .positive()
            .optional()
            .describe("USD price for limit order"),
    }),
    handler: async (agent, input) => {
        try {
            const params = {
                vaultAddress: input.vaultAddress,
                amount: input.amount,
                symbol: input.symbol,
                action: input.action,
                type: input.type,
                price: input.price,
            };
            // Carry out the trade
            const transactionId = await (0, tools_1.tradeDriftVault)(agent, params.vaultAddress, params.amount, params.symbol, params.action, params.type, params.price);
            return {
                status: "success",
                message: params.type === "limit"
                    ? "Order placed successfully"
                    : "Trade successful",
                transactionId,
                ...params,
            };
        }
        catch (error) {
            return {
                status: "error",
                // @ts-expect-error error is not a string
                message: error.message,
            };
        }
    },
};
exports.default = tradeDelegatedDriftVaultAction;
//# sourceMappingURL=tradeDelegatedDriftVault.js.map