"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const createDriftUserAccountAction = {
    name: "CREATE_DRIFT_USER_ACCOUNT",
    similes: [
        "create drift account",
        "create drift user account",
        "create user account on drift",
    ],
    description: "Create a new user account on Drift protocol",
    examples: [
        [
            {
                input: {
                    amount: 100,
                    symbol: "SOL",
                },
                output: {
                    status: "success",
                    message: "User account created with 100 SOL successfully deposited",
                    account: "4xKpN2...",
                },
                explanation: "Create a new user account with 100 SOL",
            },
        ],
    ],
    schema: zod_1.z.object({
        amount: zod_1.z
            .number()
            .positive()
            .describe("Amount of the token to deposit. In normal token amounts e.g 50 SOL, 100 USDC, etc"),
        symbol: zod_1.z.string().describe("Symbol of the token to deposit"),
    }),
    handler: async (agent, input) => {
        try {
            const res = await (0, tools_1.createDriftUserAccount)(agent, input.amount, input.symbol);
            return {
                status: "success",
                message: res.message ??
                    `User account created with ${input.amount} ${input.symobl} successfully deposited.`,
                account: res.account,
                signature: res.txSignature,
            };
        }
        catch (e) {
            return {
                status: "error",
                // @ts-expect-error - error message is a string
                message: `Failed to create user account: ${e.message}`,
            };
        }
    },
};
exports.default = createDriftUserAccountAction;
//# sourceMappingURL=createDriftUserAccount.js.map