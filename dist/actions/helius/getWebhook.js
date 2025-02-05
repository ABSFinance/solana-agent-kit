"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const helius_1 = require("../../tools/helius");
const getWebhookAction = {
    name: "GET_HELIOUS_WEBHOOK",
    similes: ["fetch webhook details", "retrieve webhook", "get webhook info"],
    description: "Retrieves details of a Helius webhook by its unique ID",
    examples: [
        [
            {
                input: {
                    webhookID: "webhook_123",
                },
                output: {
                    status: "success",
                    wallet: "WalletPublicKey",
                    webhookURL: "https://yourdomain.com/webhook",
                    transactionTypes: ["Any"],
                    accountAddresses: ["SomePublicKey", "AnotherPublicKey"],
                    webhookType: "enhanced",
                    message: "Webhook details retrieved successfully.",
                },
                explanation: "Retrieves detailed information about an existing Helius webhook, including the wallet address it monitors, the types of transactions it tracks, and the specific webhook URL.",
            },
        ],
    ],
    schema: zod_1.z.object({
        webhookID: zod_1.z
            .string()
            .min(1)
            .describe("The unique identifier of the Helius webhook to retrieve"),
    }),
    handler: async (agent, input) => {
        const webhookDetails = await (0, helius_1.getHeliusWebhook)(agent, input.webhookID);
        return {
            status: "success",
            ...webhookDetails,
            message: "Webhook details retrieved successfully.",
        };
    },
};
exports.default = getWebhookAction;
//# sourceMappingURL=getWebhook.js.map