"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const agent_1 = require("../../tools/agent");
const getWalletAddressAction = {
    name: "GET_WALLET_ADDRESS",
    similes: ["wallet address", "address", "wallet"],
    description: "Get wallet address of the agent",
    examples: [
        [
            {
                input: {},
                output: {
                    status: "success",
                    address: "0x1234567890abcdef",
                },
                explanation: "The agent's wallet address is 0x1234567890abcdef",
            },
        ],
    ],
    schema: zod_1.z.object({}),
    handler: async (agent) => ({
        status: "success",
        address: (0, agent_1.get_wallet_address)(agent),
    }),
};
exports.default = getWalletAddressAction;
//# sourceMappingURL=getWalletAddress.js.map