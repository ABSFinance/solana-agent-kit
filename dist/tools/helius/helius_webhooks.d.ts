import { SolanaAgentKit } from "../../index";
import { HeliusWebhookResponse, HeliusWebhookIdResponse } from "../../index";
export declare function create_HeliusWebhook(agent: SolanaAgentKit, accountAddresses: string[], webhookURL: string): Promise<HeliusWebhookResponse>;
/**
 * Retrieves a Helius Webhook by ID, returning only the specified fields.
 *
 * @param agent     - An instance of SolanaAgentKit (with .config.HELIUS_API_KEY)
 * @param webhookID - The unique ID of the webhook to retrieve
 *
 * @returns A HeliusWebhook object containing { wallet, webhookURL, transactionTypes, accountAddresses, webhookType }
 */
export declare function getHeliusWebhook(agent: SolanaAgentKit, webhookID: string): Promise<HeliusWebhookIdResponse>;
/**
 * Deletes a Helius Webhook by its ID.
 *
 * @param agent     - An instance of SolanaAgentKit (with .config.HELIUS_API_KEY)
 * @param webhookID - The unique ID of the webhook to delete
 *
 * @returns The response body from the Helius API (which may contain status or other info)
 */
export declare function deleteHeliusWebhook(agent: SolanaAgentKit, webhookID: string): Promise<any>;
//# sourceMappingURL=helius_webhooks.d.ts.map