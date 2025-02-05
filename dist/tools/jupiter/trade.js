"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trade = trade;
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("../../constants");
const spl_token_1 = require("@solana/spl-token");
/**
 * Swap tokens using Jupiter Exchange
 * @param agent SolanaAgentKit instance
 * @param outputMint Target token mint address
 * @param inputAmount Amount to swap (in token decimals)
 * @param inputMint Source token mint address (defaults to USDC)
 * @param slippageBps Slippage tolerance in basis points (default: 300 = 3%)
 * @returns Transaction signature
 */
async function trade(agent, outputMint, inputAmount, inputMint = constants_1.TOKENS.USDC, 
// @deprecated use dynamicSlippage instead
slippageBps = constants_1.DEFAULT_OPTIONS.SLIPPAGE_BPS) {
    try {
        // Check if input token is native SOL
        const isNativeSol = inputMint.equals(constants_1.TOKENS.SOL);
        // For native SOL, we use LAMPORTS_PER_SOL, otherwise fetch mint info
        const inputDecimals = isNativeSol
            ? 9 // SOL always has 9 decimals
            : (await (0, spl_token_1.getMint)(agent.connection, inputMint)).decimals;
        // Calculate the correct amount based on actual decimals
        const scaledAmount = inputAmount * Math.pow(10, inputDecimals);
        const quoteResponse = await (await fetch(`${constants_1.JUP_API}/quote?` +
            `inputMint=${isNativeSol ? constants_1.TOKENS.SOL.toString() : inputMint.toString()}` +
            `&outputMint=${outputMint.toString()}` +
            `&amount=${scaledAmount}` +
            `&dynamicSlippage=true` +
            `&minimizeSlippage=false` +
            `&onlyDirectRoutes=false` +
            `&maxAccounts=64` +
            `&swapMode=ExactIn` +
            `${agent.config.JUPITER_FEE_BPS ? `&platformFeeBps=${agent.config.JUPITER_FEE_BPS}` : ""}`)).json();
        // Get serialized transaction
        let feeAccount;
        if (agent.config.JUPITER_REFERRAL_ACCOUNT) {
            [feeAccount] = web3_js_1.PublicKey.findProgramAddressSync([
                Buffer.from("referral_ata"),
                new web3_js_1.PublicKey(agent.config.JUPITER_REFERRAL_ACCOUNT).toBuffer(),
                constants_1.TOKENS.SOL.toBuffer(),
            ], new web3_js_1.PublicKey(constants_1.JUP_REFERRAL_ADDRESS));
        }
        const { swapTransaction } = await (await fetch("https://quote-api.jup.ag/v6/swap", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                quoteResponse,
                userPublicKey: agent.wallet_address.toString(),
                wrapAndUnwrapSol: true,
                dynamicComputeUnitLimit: true,
                dynamicSlippage: true,
                prioritizationFeeLamports: {
                    priorityLevelWithMaxLamports: {
                        maxLamports: 10000000,
                        global: false,
                        priorityLevel: agent.config.PRIORITY_LEVEL || "medium",
                    },
                },
                feeAccount: feeAccount ? feeAccount.toString() : null,
            }),
        })).json();
        // Deserialize transaction
        const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
        const transaction = web3_js_1.VersionedTransaction.deserialize(swapTransactionBuf);
        // Sign and send transaction
        transaction.sign([agent.wallet]);
        const signature = await agent.connection.sendTransaction(transaction);
        return signature;
    }
    catch (error) {
        throw new Error(`Swap failed: ${error.message}`);
    }
}
//# sourceMappingURL=trade.js.map