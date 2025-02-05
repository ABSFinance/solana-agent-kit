"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const solana_1 = require("../../tools/solana");
const getTPSAction = {
    name: "GET_TPS",
    similes: [
        "get transactions per second",
        "check network speed",
        "network performance",
        "transaction throughput",
        "network tps",
    ],
    description: "Get the current transactions per second (TPS) of the Solana network",
    examples: [
        [
            {
                input: {},
                output: {
                    status: "success",
                    tps: 3500,
                    message: "Current network TPS: 3500",
                },
                explanation: "Get the current TPS of the Solana network",
            },
        ],
    ],
    schema: zod_1.z.object({}), // No input parameters required
    handler: async (agent, _input) => {
        try {
            const response = await (0, solana_1.getTPS)(agent);
            return {
                status: "success",
                response,
                message: `Current network TPS: ${response}`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to get TPS: ${error.message}`,
            };
        }
    },
};
exports.default = getTPSAction;
//# sourceMappingURL=getTPS.js.map