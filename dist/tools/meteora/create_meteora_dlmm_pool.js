"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMeteoraDlmmPool = createMeteoraDlmmPool;
const bn_js_1 = __importDefault(require("bn.js"));
const dlmm_1 = __importDefault(require("@meteora-ag/dlmm"));
const spl_token_1 = require("@solana/spl-token");
const send_tx_1 = require("../../utils/send_tx");
/**
 * Create Meteora DLMM pool
 * @param agent SolanaAgentKit instance
 * @param binStep DLMM pool bin step
 * @param tokenAMint Token A mint
 * @param tokenBMint Token B mint
 * @param initialPrice Initial pool price in ratio tokenA / tokenB
 * @param priceRoundingUp Whether to rounding up the initial pool price
 * @param feeBps Pool trading fee in BPS
 * @param activationType Pool activation type (ActivationType.Timestamp or ActivationType.Slot)
 * @param hasAlphaVault Whether the pool has Meteora alpha vault or not
 * @param activationPoint Activation point depending on activation type, or null if pool doesn't have an activation point
 * @returns Transaction signature
 */
async function createMeteoraDlmmPool(agent, binStep, tokenAMint, tokenBMint, initialPrice, priceRoundingUp, feeBps, activationType, hasAlphaVault, activationPoint) {
    const tokenAMintInfo = await (0, spl_token_1.getMint)(agent.connection, tokenAMint);
    const tokenBMintInfo = await (0, spl_token_1.getMint)(agent.connection, tokenBMint);
    const initPrice = dlmm_1.default.getPricePerLamport(tokenAMintInfo.decimals, tokenBMintInfo.decimals, initialPrice);
    const activateBinId = dlmm_1.default.getBinIdFromPrice(initPrice, binStep, !priceRoundingUp);
    const initPoolTx = await dlmm_1.default.createCustomizablePermissionlessLbPair(agent.connection, new bn_js_1.default(binStep), tokenAMint, tokenBMint, new bn_js_1.default(activateBinId.toString()), new bn_js_1.default(feeBps), activationType, hasAlphaVault, agent.wallet_address, activationPoint, {
        cluster: "mainnet-beta",
    });
    const initPoolTxHash = await (0, send_tx_1.sendTx)(agent, initPoolTx.instructions, [
        agent.wallet,
    ]);
    return initPoolTxHash;
}
//# sourceMappingURL=create_meteora_dlmm_pool.js.map