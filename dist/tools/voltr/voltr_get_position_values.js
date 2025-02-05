"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voltrGetPositionValues = voltrGetPositionValues;
const vault_sdk_1 = require("@voltr/vault-sdk");
/**
 * Gets the value of assets in a Voltr vault
 * @param agent SolanaAgentKit instance
 * @param vault Public key of the target vault
 * @returns Position and total values for the vault
 */
async function voltrGetPositionValues(agent, vault) {
    const vc = new vault_sdk_1.VoltrClient(agent.connection, agent.wallet);
    const positionAndTotalValues = await vc.getPositionAndTotalValuesForVault(vault);
    return JSON.stringify(positionAndTotalValues);
}
//# sourceMappingURL=voltr_get_position_values.js.map