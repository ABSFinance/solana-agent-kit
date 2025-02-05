"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSolanaTools = createSolanaTools;
const ai_1 = require("ai");
const actionExecutor_1 = require("../utils/actionExecutor");
const actions_1 = require("../actions");
function createSolanaTools(solanaAgentKit) {
    const tools = {};
    const actionKeys = Object.keys(actions_1.ACTIONS);
    for (const key of actionKeys) {
        const action = actions_1.ACTIONS[key];
        tools[key] = (0, ai_1.tool)({
            // @ts-expect-error Value matches type however TS still shows error
            id: action.name,
            description: `
      ${action.description}

      Similes: ${action.similes.map((simile) => `
        ${simile}
      `)}
      `.slice(0, 1023),
            parameters: action.schema,
            execute: async (params) => await (0, actionExecutor_1.executeAction)(action, solanaAgentKit, params),
        });
    }
    return tools;
}
//# sourceMappingURL=index.js.map