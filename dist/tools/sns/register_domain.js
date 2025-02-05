"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDomain = registerDomain;
const spl_name_service_1 = require("@bonfida/spl-name-service");
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const constants_1 = require("../../constants");
/**
 * Register a .sol domain name using Bonfida Name Service
 * @param agent SolanaAgentKit instance
 * @param name Domain name to register (without .sol)
 * @param spaceKB Space allocation in KB (max 10KB)
 * @returns Transaction signature
 */
async function registerDomain(agent, name, spaceKB = 1) {
    try {
        // Validate space size
        if (spaceKB > 10) {
            throw new Error("Maximum domain size is 10KB");
        }
        // Convert KB to bytes
        const space = spaceKB * 1000;
        const buyerTokenAccount = await (0, spl_token_1.getAssociatedTokenAddressSync)(agent.wallet_address, constants_1.TOKENS.USDC);
        // Create registration instruction
        const instruction = await (0, spl_name_service_1.registerDomainNameV2)(agent.connection, name, space, agent.wallet_address, buyerTokenAccount);
        // Create and sign transaction
        const transaction = new web3_js_1.Transaction().add(...instruction);
        transaction.recentBlockhash = (await agent.connection.getLatestBlockhash()).blockhash;
        transaction.feePayer = agent.wallet_address;
        // Sign and send transaction
        const signature = await agent.connection.sendTransaction(transaction, [
            agent.wallet,
        ]);
        return signature;
    }
    catch (error) {
        throw new Error(`Domain registration failed: ${error.message}`);
    }
}
//# sourceMappingURL=register_domain.js.map