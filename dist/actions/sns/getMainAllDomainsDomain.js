"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const getMainAllDomainsDomainAction = {
    name: "GET_MAIN_ALL_DOMAINS_DOMAIN",
    similes: [
        "get main domain",
        "fetch primary domain",
        "get default domain",
        "get main address name",
        "get primary name",
        "get main domain name",
    ],
    description: "Get the main domain associated with a wallet address",
    examples: [
        [
            {
                input: {
                    address: "7nxQB...",
                },
                output: {
                    status: "success",
                    domain: "solana.sol",
                    message: "Successfully retrieved main domain",
                },
                explanation: "Get the main domain name for a given wallet address",
            },
        ],
    ],
    schema: zod_1.z.object({
        address: zod_1.z
            .string()
            .min(1)
            .describe("The wallet address to get the main domain for"),
    }),
    handler: async (agent, input) => {
        try {
            const mainDomain = await (0, tools_1.getMainAllDomainsDomain)(agent, new web3_js_1.PublicKey(input.address));
            if (!mainDomain) {
                return {
                    status: "error",
                    message: "No main domain found for this address",
                };
            }
            return {
                status: "success",
                domain: mainDomain,
                message: "Successfully retrieved main domain",
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to get main domain: ${error.message}`,
            };
        }
    },
};
exports.default = getMainAllDomainsDomainAction;
//# sourceMappingURL=getMainAllDomainsDomain.js.map