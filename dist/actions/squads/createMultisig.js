"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const web3_js_1 = require("@solana/web3.js");
const createMultisigAction = {
    name: "CREATE_MULTISIG_ACTION",
    similes: [
        "create multisig",
        "create squads multisig",
        "create 2-by-2 multisig",
        "create 2-of-2 multisig",
        "create 2-of-2 multisig account",
        "create 2-of-2 multisig account on Solana",
    ],
    description: `Create a 2-of-2 multisig account on Solana using Squads with the user and the agent, where both approvals will be required to run the transactions.
  
  Note: For one AI agent, only one 2-by-2 multisig can be created as it is pair-wise.`,
    examples: [
        [
            {
                input: {
                    creator: "7nE9GvcwsqzYxmJLSrYmSB1V1YoJWVK1KWzAcWAzjXkN",
                },
                output: {
                    status: "success",
                    message: "2-by-2 multisig account created successfully",
                    signature: "4xKpN2...",
                },
                explanation: "Create a 2-of-2 multisig account on Solana",
            },
        ],
    ],
    schema: zod_1.z.object({
        creator: zod_1.z.string(),
    }),
    handler: async (agent, input) => {
        const multisig = await (0, tools_1.create_squads_multisig)(agent, new web3_js_1.PublicKey(input.creator));
        return {
            status: "success",
            message: "2-by-2 multisig account created successfully",
            signature: multisig,
        };
    },
};
exports.default = createMultisigAction;
//# sourceMappingURL=createMultisig.js.map