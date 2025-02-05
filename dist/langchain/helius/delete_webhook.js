"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaDeleteHeliusWebhookTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaDeleteHeliusWebhookTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "delete_helius_webhook";
        this.description = `Deletes a Helius Webhook by its ID.
  Inputs (input is a JSON string):
    webhookID: string, e.g. "1ed4244d-a591-4854-ac31-cc28d40b8255"`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const webhookID = parsedInput.webhookID;
            if (!webhookID || typeof webhookID !== "string") {
                throw new Error('Invalid input. Expected a "webhookID" property in the JSON.');
            }
            const result = await this.solanaKit.deleteWebhook(webhookID);
            return JSON.stringify({
                status: "success",
                message: "Helius Webhook deleted successfully",
                data: result,
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
exports.SolanaDeleteHeliusWebhookTool = SolanaDeleteHeliusWebhookTool;
//# sourceMappingURL=delete_webhook.js.map