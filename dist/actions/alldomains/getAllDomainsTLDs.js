"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const getAllDomainsTLDsAction = {
    name: "GET_ALL_TLDS",
    similes: [
        "list domain tlds",
        "get domain extensions",
        "fetch domain tlds",
        "get top level domains",
        "list available tlds",
        "get domain suffixes",
    ],
    description: "Get a list of all available top-level domains (TLDs) for Solana domains",
    examples: [
        [
            {
                input: {},
                output: {
                    status: "success",
                    tlds: [".sol", ".abc", ".backpack", ".bonk"],
                    message: "Successfully retrieved all domain TLDs",
                },
                explanation: "Get a list of all available TLDs that can be used for Solana domains",
            },
        ],
    ],
    schema: zod_1.z.object({}),
    handler: async (agent) => {
        try {
            // Get all domain TLDs
            const tlds = await (0, tools_1.getAllDomainsTLDs)(agent);
            return {
                status: "success",
                tlds,
                message: "Successfully retrieved all domain TLDs",
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to get domain TLDs: ${error.message}`,
            };
        }
    },
};
exports.default = getAllDomainsTLDsAction;
//# sourceMappingURL=getAllDomainsTLDs.js.map