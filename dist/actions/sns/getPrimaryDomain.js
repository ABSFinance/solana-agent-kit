"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const getPrimaryDomainAction = {
    name: "GET_PRIMARY_DOMAIN",
    similes: [
        "get primary domain",
        "lookup primary domain",
        "check primary domain",
        "find primary domain",
        "get main domain",
        "primary sol domain",
    ],
    description: "Get the primary .sol domain associated with a Solana wallet address",
    examples: [
        [
            {
                input: {
                    account: "7nxQB...",
                },
                output: {
                    status: "success",
                    domain: "vitalik.sol",
                    message: "Primary domain: vitalik.sol",
                },
                explanation: "Get the primary .sol domain for a wallet address",
            },
        ],
    ],
    schema: zod_1.z.object({
        account: zod_1.z.string().min(1).describe("The Solana wallet address to lookup"),
    }),
    handler: async (agent, input) => {
        try {
            const account = new web3_js_1.PublicKey(input.account);
            const response = await (0, tools_1.getPrimaryDomain)(agent, account);
            return {
                status: "success",
                domain: response,
                message: `Primary domain: ${response}`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to get primary domain: ${error.message}`,
            };
        }
    },
};
exports.default = getPrimaryDomainAction;
//# sourceMappingURL=getPrimaryDomain.js.map