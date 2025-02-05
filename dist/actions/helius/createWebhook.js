"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const helius_1 = require("../../tools/helius");
const createWebhookAction = {
    name: "CREATE_HELIOUS_WEBHOOK",
    similes: ["setup webhook", "register webhook", "initiate webhook"],
    description: "Creates a new webhook in the Helius system to monitor transactions for specified account addresses",
    examples: [
        [
            {
                input: {
                    accountAddresses: [
                        "BVdNLvyG2DNiWAXBE9qAmc4MTQXymd5Bzfo9xrQSUzVP",
                        "Eo2ciguhMLmcTWXELuEQPdu7DWZt67LHXb2rdHZUbot7",
                    ],
                    webhookURL: "https://yourdomain.com/webhook",
                },
                output: {
                    status: "success",
                    webhookURL: "https://yourdomain.com/webhook",
                    webhookID: "webhook_123",
                    message: "Webhook created successfully.",
                },
                explanation: "Creates a Webhook to send live notifications on the given Url with the wallet Addresses.",
            },
        ],
    ],
    schema: zod_1.z.object({
        accountAddresses: zod_1.z
            .array(zod_1.z.string())
            .min(1)
            .describe("List of Solana account public keys to monitor"),
        webhookURL: zod_1.z
            .string()
            .url()
            .describe("The URL where Helius will send webhook notifications"),
    }),
    handler: async (agent, input) => {
        const response = await (0, helius_1.create_HeliusWebhook)(agent, input.accountAddresses, input.webhookURL);
        return {
            status: "success",
            ...response,
            message: "Webhook created successfully.",
        };
    },
};
exports.default = createWebhookAction;
//# sourceMappingURL=createWebhook.js.map