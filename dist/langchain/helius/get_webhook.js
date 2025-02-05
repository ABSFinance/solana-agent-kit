"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaGetHeliusWebhookTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaGetHeliusWebhookTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "get_helius_webhook";
        this.description = `Retrieves a Helius Webhook by its ID.
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
            const result = await this.solanaKit.getWebhook(webhookID);
            return JSON.stringify({
                status: "success",
                message: "Helius Webhook retrieved successfully",
                wallet: result.wallet,
                webhookURL: result.webhookURL,
                transactionTypes: result.transactionTypes,
                accountAddresses: result.accountAddresses,
                webhookType: result.webhookType,
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
exports.SolanaGetHeliusWebhookTool = SolanaGetHeliusWebhookTool;
//# sourceMappingURL=get_webhook.js.map