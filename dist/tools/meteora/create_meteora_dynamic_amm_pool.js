"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMeteoraDynamicAMMPool = createMeteoraDynamicAMMPool;
const dynamic_amm_sdk_1 = __importDefault(require("@mercurial-finance/dynamic-amm-sdk"));
const send_tx_1 = require("../../utils/send_tx");
/**
 * Create Meteora Dynamic AMM pool
 * @param agent SolanaAgentKit instance
 * @param tokenAMint Token A mint
 * @param tokenBMint Token B mint
 * @param tokenAAmount Token A amount in lamport units
 * @param tokenBAmount Token B amount in lamport units
 * @param customizableParams Parameters to create Dynamic AMM pool
 *        tradeFeeNumerator (number): Trade fee numerator, with default denominator is 100000
 *        activationType (enum): Should be ActivationType.Timestamp or ActivationType.Slot
 *        activationPoint (BN | null): Activation point depending on activation type, or null if pool doesn't have an activation point
 *        hasAlphaVault (boolean): Whether the pool has Meteora alpha vault or not
 *        padding (Array<number>): Should be set to value Array(90).fill(0)
 * @returns Transaction signature
 */
async function createMeteoraDynamicAMMPool(agent, tokenAMint, tokenBMint, tokenAAmount, tokenBAmount, customizableParams) {
    const initPoolTx = await dynamic_amm_sdk_1.default.createCustomizablePermissionlessConstantProductPool(agent.connection, agent.wallet_address, tokenAMint, tokenBMint, tokenAAmount, tokenBAmount, customizableParams);
    const initPoolTxHash = await (0, send_tx_1.sendTx)(agent, initPoolTx.instructions, [
        agent.wallet,
    ]);
    return initPoolTxHash;
}
//# sourceMappingURL=create_meteora_dynamic_amm_pool.js.map