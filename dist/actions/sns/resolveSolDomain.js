"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools/");
const resolveSolDomainAction = {
    name: "RESOLVE_SOL_DOMAIN",
    similes: [
        "resolve sol domain",
        "lookup sol domain",
        "get sol domain owner",
        "check sol domain",
        "find sol domain owner",
        "resolve .sol",
    ],
    description: "Resolve a .sol domain to its corresponding Solana wallet address using Bonfida Name Service",
    examples: [
        [
            {
                input: {
                    domain: "vitalik.sol",
                },
                output: {
                    status: "success",
                    owner: "7nxQB...",
                    message: "Successfully resolved vitalik.sol",
                },
                explanation: "Resolve a .sol domain to get the owner's wallet address",
            },
        ],
    ],
    schema: zod_1.z.object({
        domain: zod_1.z
            .string()
            .min(1)
            .describe("The .sol domain to resolve (with or without .sol suffix)"),
    }),
    handler: async (agent, input) => {
        try {
            const domain = input.domain;
            const res = await (0, tools_1.resolveSolDomain)(agent, domain);
            return {
                status: "success",
                owner: res.toString(),
                message: `Successfully resolved ${res}`,
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
exports.default = resolveSolDomainAction;
//# sourceMappingURL=resolveSolDomain.js.map