"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const registerDomainAction = {
    name: "REGISTER_DOMAIN",
    similes: [
        "register domain",
        "buy domain",
        "get domain name",
        "register .sol",
        "purchase domain",
        "domain registration",
    ],
    description: "Register a .sol domain name using Bonfida Name Service",
    examples: [
        [
            {
                input: {
                    name: "mydomain",
                    spaceKB: 1,
                },
                output: {
                    status: "success",
                    signature: "2ZE7Rz...",
                    message: "Successfully registered mydomain.sol",
                },
                explanation: "Register a new .sol domain with 1KB storage space",
            },
        ],
    ],
    schema: zod_1.z.object({
        name: zod_1.z.string().min(1).describe("Domain name to register (without .sol)"),
        spaceKB: zod_1.z
            .number()
            .min(1)
            .max(10)
            .default(1)
            .describe("Space allocation in KB (max 10KB)"),
    }),
    handler: async (agent, input) => {
        try {
            const name = input.name;
            const spaceKB = input.spaceKB || 1;
            const signature = await (0, tools_1.registerDomain)(agent, name, spaceKB);
            return {
                status: "success",
                signature,
                message: `Successfully registered ${name}.sol`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Domain registration failed: ${error.message}`,
            };
        }
    },
};
exports.default = registerDomainAction;
//# sourceMappingURL=registerDomain.js.map