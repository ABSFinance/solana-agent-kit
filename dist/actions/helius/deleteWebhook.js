"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const helius_1 = require("../../tools/helius");
const deleteWebhookAction = {
    name: "DELETE_HELIOUS_WEBHOOK",
    similes: ["remove webhook", "unregister webhook", "delete webhook"],
    description: "Deletes a Helius webhook by its unique ID",
    examples: [
        [
            {
                input: {
                    webhookID: "webhook_123",
                },
                output: {
                    status: "success",
                    message: "Webhook deleted successfully.",
                },
                explanation: "Permanently removes a Helius webhook.",
            },
        ],
    ],
    schema: zod_1.z.object({
        webhookID: zod_1.z
            .string()
            .min(1)
            .describe("The unique identifier of the Helius webhook to delete"),
    }),
    handler: async (agent, input) => {
        const result = await (0, helius_1.deleteHeliusWebhook)(agent, input.webhookID);
        return {
            status: "success",
            message: result.message || "Webhook deleted successfully.",
        };
    },
};
exports.default = deleteWebhookAction;
//# sourceMappingURL=deleteWebhook.js.map