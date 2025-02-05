"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaHeliusWebhookTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaHeliusWebhookTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "create_helius_webhook";
        this.description = `Creates a Helius Webhook that listens to specified account addresses.
    Inputs (input is a JSON string):
    accountAddresses: string[] | string, 
      e.g. ["BVdNLvyG2DNiWAXBE9qAmc4MTQXymd5Bzfo9xrQSUzVP","Eo2ciguhMLmcTWXELuEQPdu7DWZt67LHXb2rdHZUbot7"]
      or "BVdNLvyG2DNiWAXBE9qAmc4MTQXymd5Bzfo9xrQSUzVP,Eo2ciguhMLmcTWXELuEQPdu7DWZt67LHXb2rdHZUbot7"
    webhookURL: string, e.g. "https://TestServer.test.repl.co/webhooks"`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            let accountAddresses = [];
            if (!parsedInput.accountAddresses) {
                throw new Error('Missing "accountAddresses" property in input JSON.');
            }
            if (Array.isArray(parsedInput.accountAddresses)) {
                accountAddresses = parsedInput.accountAddresses.map((addr) => addr.trim());
            }
            else if (typeof parsedInput.accountAddresses === "string") {
                accountAddresses = parsedInput.accountAddresses
                    .split(",")
                    .map((addr) => addr.trim());
            }
            else {
                throw new Error('Invalid type for "accountAddresses". Expected array or comma-separated string.');
            }
            const webhookURL = parsedInput.webhookURL;
            if (!webhookURL) {
                throw new Error('Invalid input. Expected a "webhookURL" property in the JSON.');
            }
            const result = await this.solanaKit.CreateWebhook(accountAddresses, webhookURL);
            // Return success in JSON
            return JSON.stringify({
                status: "success",
                message: "Helius Webhook created successfully",
                webhookURL: result.webhookURL,
                webhookID: result.webhookID,
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
exports.SolanaHeliusWebhookTool = SolanaHeliusWebhookTool;
//# sourceMappingURL=create_webhook.js.map