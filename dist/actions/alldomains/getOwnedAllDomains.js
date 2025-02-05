"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const getOwnedAllDomainsAction = {
    name: "GET_OWNED_ALL_DOMAINS",
    similes: [
        "list owned domains",
        "get my domains",
        "fetch wallet domains",
        "get owned names",
        "list my domains",
        "get address domains",
    ],
    description: "Get all domains owned by a specific wallet address across all TLDs",
    examples: [
        [
            {
                input: {
                    address: "7nxQB...",
                },
                output: {
                    status: "success",
                    domains: ["solana.sol", "wallet.abc", "user.backpack"],
                    total: 3,
                    message: "Successfully retrieved owned domains",
                },
                explanation: "Get all domain names owned by a specific wallet address",
            },
        ],
    ],
    schema: zod_1.z.object({
        address: zod_1.z
            .string()
            .min(1)
            .describe("The wallet address to get owned domains for"),
    }),
    handler: async (agent, input) => {
        try {
            const address = new web3_js_1.PublicKey(input.address);
            // Get owned domains
            const domains = await (0, tools_1.getOwnedAllDomains)(agent, address);
            return {
                status: "success",
                domains,
                total: domains.length,
                message: `Successfully retrieved ${domains.length} owned domain${domains.length === 1 ? "" : "s"}`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to get owned domains: ${error.message}`,
            };
        }
    },
};
exports.default = getOwnedAllDomainsAction;
//# sourceMappingURL=getOwnedAllDomains.js.map