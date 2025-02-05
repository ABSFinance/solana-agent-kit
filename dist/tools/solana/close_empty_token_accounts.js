"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeEmptyTokenAccounts = closeEmptyTokenAccounts;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
/**
 * Close Empty SPL Token accounts of the agent
 * @param agent SolanaAgentKit instance
 * @returns transaction signature and total number of accounts closed
 */
async function closeEmptyTokenAccounts(agent) {
    try {
        const spl_token = await create_close_instruction(agent, spl_token_1.TOKEN_PROGRAM_ID);
        const token_2022 = await create_close_instruction(agent, spl_token_1.TOKEN_2022_PROGRAM_ID);
        const transaction = new web3_js_1.Transaction();
        const MAX_INSTRUCTIONS = 40; // 40 instructions can be processed in a single transaction without failing
        spl_token
            .slice(0, Math.min(MAX_INSTRUCTIONS, spl_token.length))
            .forEach((instruction) => transaction.add(instruction));
        token_2022
            .slice(0, Math.max(0, MAX_INSTRUCTIONS - spl_token.length))
            .forEach((instruction) => transaction.add(instruction));
        const size = spl_token.length + token_2022.length;
        if (size === 0) {
            return {
                signature: "",
                size: 0,
            };
        }
        const signature = await agent.connection.sendTransaction(transaction, [
            agent.wallet,
        ]);
        return { signature, size };
    }
    catch (error) {
        throw new Error(`Error closing empty token accounts: ${error}`);
    }
}
/**
 * creates the close instuctions of a spl token account
 * @param agnet SolanaAgentKit instance
 * @param token_program Token Program Id
 * @returns close instuction array
 */
async function create_close_instruction(agent, token_program) {
    const instructions = [];
    const ata_accounts = await agent.connection.getTokenAccountsByOwner(agent.wallet_address, { programId: token_program }, "confirmed");
    const tokens = ata_accounts.value;
    const accountExceptions = [
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
    ];
    for (let i = 0; i < tokens.length; i++) {
        const token_data = spl_token_1.AccountLayout.decode(tokens[i].account.data);
        if (token_data.amount === BigInt(0) &&
            !accountExceptions.includes(token_data.mint.toString())) {
            const closeInstruction = (0, spl_token_1.createCloseAccountInstruction)(ata_accounts.value[i].pubkey, agent.wallet_address, agent.wallet_address, [], token_program);
            instructions.push(closeInstruction);
        }
    }
    return instructions;
}
//# sourceMappingURL=close_empty_token_accounts.js.map