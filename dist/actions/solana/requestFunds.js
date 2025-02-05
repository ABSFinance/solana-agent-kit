"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const solana_1 = require("../../tools/solana");
const requestFundsAction = {
    name: "REQUEST_FUNDS",
    similes: [
        "request sol",
        "get test sol",
        "use faucet",
        "request test tokens",
        "get devnet sol",
    ],
    description: "Request SOL from Solana faucet (devnet/testnet only)",
    examples: [
        [
            {
                input: {},
                output: {
                    status: "success",
                    message: "Successfully requested faucet funds",
                    network: "devnet.solana.com",
                },
                explanation: "Request SOL from the devnet faucet",
            },
        ],
    ],
    schema: zod_1.z.object({}), // No input parameters required
    handler: async (agent, _input) => {
        await (0, solana_1.request_faucet_funds)(agent);
        return {
            status: "success",
            message: "Successfully requested faucet funds",
            network: agent.connection.rpcEndpoint.split("/")[2],
        };
    },
};
exports.default = requestFundsAction;
//# sourceMappingURL=requestFunds.js.map