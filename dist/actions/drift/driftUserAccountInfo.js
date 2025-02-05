"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tools_1 = require("../../tools");
const driftUserAccountInfoAction = {
    name: "DRIFT_USER_ACCOUNT_INFO",
    similes: ["get drift user account info", "get drift account info"],
    description: "Get information about your drift account",
    examples: [
        [
            {
                input: {},
                explanation: "Get information about your drift account",
                output: {
                    status: "success",
                    data: {},
                },
            },
        ],
    ],
    schema: zod_1.z.object({}),
    handler: async (agent) => {
        try {
            const accountInfo = await (0, tools_1.driftUserAccountInfo)(agent);
            return {
                status: "success",
                data: accountInfo,
            };
        }
        catch (e) {
            return {
                status: "error",
                // @ts-expect-error - error message is a string
                message: `Failed to get drift account info: ${e.message}`,
            };
        }
    },
};
exports.default = driftUserAccountInfoAction;
//# sourceMappingURL=driftUserAccountInfo.js.map