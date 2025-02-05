"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const getAllRegisteredAllDomainsAction = {
    name: "GET_ALL_REGISTERED_ALL_DOMAINS",
    similes: [
        "list registered domains",
        "get all domains",
        "fetch registered domains",
        "get domain list",
        "list active domains",
        "get registered names",
    ],
    description: "Get a list of all registered domains across all TLDs",
    examples: [
        [
            {
                input: {
                    limit: 100,
                    offset: 0,
                },
                output: {
                    status: "success",
                    domains: ["solana.sol", "bonk.abc", "wallet.backpack"],
                    total: 3,
                    message: "Successfully retrieved registered domains",
                },
                explanation: "Get the first 100 registered domains across all TLDs",
            },
        ],
    ],
    schema: zod_1.z.object({
        limit: zod_1.z
            .number()
            .positive()
            .max(1000)
            .default(100)
            .describe("Maximum number of domains to return"),
        offset: zod_1.z
            .number()
            .nonnegative()
            .default(0)
            .describe("Number of domains to skip"),
    }),
    handler: async (agent, input) => {
        try {
            const limit = input.limit || 100;
            const offset = input.offset || 0;
            // Get all registered domains
            const domains = await (0, tools_1.getAllRegisteredAllDomains)(agent);
            return {
                status: "success",
                domains: domains.slice(offset, offset + limit),
                total: domains.length,
                message: "Successfully retrieved registered domains",
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to get registered domains: ${error.message}`,
            };
        }
    },
};
exports.default = getAllRegisteredAllDomainsAction;
//# sourceMappingURL=getAllRegisteredAllDomains.js.map