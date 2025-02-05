"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const resolveDomainAction = {
    name: "RESOLVE_ALL_DOMAINS",
    similes: [
        "resolve domain",
        "lookup domain",
        "get domain owner",
        "check domain",
        "find domain owner",
    ],
    description: "Resolve a Solana domain name to get its owner's public key",
    examples: [
        [
            {
                input: {
                    domain: "example.sol",
                },
                output: {
                    status: "success",
                    owner: "7nxQB...",
                },
                explanation: "Resolve a .sol domain name to get the owner's public key",
            },
        ],
    ],
    schema: zod_1.z.object({
        domain: zod_1.z.string().min(1).describe("The domain name to resolve"),
    }),
    handler: async (agent, input) => {
        try {
            const domain = input.domain;
            const tld = await (0, tools_1.resolveAllDomains)(agent, domain);
            return {
                status: "success",
                owner: tld,
                message: `Successfully resolved domain ${domain}`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to resolve domain: ${error.message}`,
            };
        }
    },
};
exports.default = resolveDomainAction;
//# sourceMappingURL=resolveDomain.js.map