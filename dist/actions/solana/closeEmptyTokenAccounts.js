"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const closeEmptyTokenAccountsAction = {
    name: "CLOSE_EMPTY_TOKEN_ACCOUNTS",
    similes: [
        "close token accounts",
        "remove empty accounts",
        "clean up token accounts",
        "close SPL token accounts",
        "clean wallet",
    ],
    description: `Close empty SPL Token accounts associated with your wallet to reclaim rent. 
 This action will close both regular SPL Token accounts and Token-2022 accounts that have zero balance. `,
    examples: [
        [
            {
                input: {},
                output: {
                    status: "success",
                    signature: "3KmPyiZvJQk8CfBVVaz8nf3c2crb6iqjQVDqNxknnusyb1FTFpXqD8zVSCBAd1X3rUcD8WiG1bdSjFbeHsmcYGXY",
                    accountsClosed: 10,
                },
                explanation: "Closed 10 empty token accounts successfully.",
            },
        ],
        [
            {
                input: {},
                output: {
                    status: "success",
                    signature: "",
                    accountsClosed: 0,
                },
                explanation: "No empty token accounts were found to close.",
            },
        ],
    ],
    schema: zod_1.z.object({}),
    handler: async (agent) => {
        try {
            const result = await (0, tools_1.closeEmptyTokenAccounts)(agent);
            if (result.size === 0) {
                return {
                    status: "success",
                    signature: "",
                    accountsClosed: 0,
                    message: "No empty token accounts found to close",
                };
            }
            return {
                status: "success",
                signature: result.signature,
                accountsClosed: result.size,
                message: `Successfully closed ${result.size} empty token accounts`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to close empty token accounts: ${error.message}`,
            };
        }
    },
};
exports.default = closeEmptyTokenAccountsAction;
//# sourceMappingURL=closeEmptyTokenAccounts.js.map