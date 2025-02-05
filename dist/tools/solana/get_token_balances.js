"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_token_balance = get_token_balance;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const tokenMetadata_1 = require("../../utils/tokenMetadata");
/**
 * Get the token balances of a Solana wallet
 * @param agent - SolanaAgentKit instance
 * @param token_address - Optional SPL token mint address. If not provided, returns SOL balance
 * @returns Promise resolving to the balance as an object containing sol balance and token balances with their respective mints, symbols, names and decimals
 */
async function get_token_balance(agent, walletAddress) {
    const [lamportsBalance, tokenAccountData] = await Promise.all([
        agent.connection.getBalance(walletAddress ?? agent.wallet_address),
        agent.connection.getParsedTokenAccountsByOwner(walletAddress ?? agent.wallet_address, {
            programId: spl_token_1.TOKEN_PROGRAM_ID,
        }),
    ]);
    const removedZeroBalance = tokenAccountData.value.filter((v) => v.account.data.parsed.info.tokenAmount.uiAmount !== 0);
    const tokenBalances = await Promise.all(removedZeroBalance.map(async (v) => {
        const mint = v.account.data.parsed.info.mint;
        const mintInfo = await (0, tokenMetadata_1.getTokenMetadata)(agent.connection, mint);
        return {
            tokenAddress: mint,
            name: mintInfo.name ?? "",
            symbol: mintInfo.symbol ?? "",
            balance: v.account.data.parsed.info.tokenAmount.uiAmount,
            decimals: v.account.data.parsed.info.tokenAmount.decimals,
        };
    }));
    const solBalance = lamportsBalance / web3_js_1.LAMPORTS_PER_SOL;
    return {
        sol: solBalance,
        tokens: tokenBalances,
    };
}
//# sourceMappingURL=get_token_balances.js.map