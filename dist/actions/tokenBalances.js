"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const zod_1 = require("zod");
const tools_1 = require("../tools");
const tokenBalancesAction = {
    name: "TOKEN_BALANCE_ACTION",
    similes: [
        "check token balances",
        "get wallet token balances",
        "view token balances",
        "show token balances",
        "check token balance",
    ],
    description: `Get the token balances of a Solana wallet.
  If you want to get the balance of your wallet, you don't need to provide the wallet address.`,
    examples: [
        [
            {
                input: {},
                output: {
                    status: "success",
                    balance: {
                        sol: 100,
                        tokens: [
                            {
                                tokenAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                                name: "USD Coin",
                                symbol: "USDC",
                                balance: 100,
                                decimals: 9,
                            },
                        ],
                    },
                },
                explanation: "Get token balances of the wallet",
            },
        ],
        [
            {
                input: {
                    walletAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                },
                output: {
                    status: "success",
                    balance: {
                        sol: 100,
                        tokens: [
                            {
                                tokenAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                                name: "USD Coin",
                                symbol: "USDC",
                                balance: 100,
                                decimals: 9,
                            },
                        ],
                    },
                },
                explanation: "Get address token balance",
            },
        ],
    ],
    schema: zod_1.z.object({
        walletAddress: zod_1.z.string().optional(),
    }),
    handler: async (agent, input) => {
        const balance = await (0, tools_1.get_token_balance)(agent, input.tokenAddress && new web3_js_1.PublicKey(input.tokenAddress));
        return {
            status: "success",
            balance: balance,
        };
    },
};
exports.default = tokenBalancesAction;
//# sourceMappingURL=tokenBalances.js.map