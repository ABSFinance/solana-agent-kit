"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = require("bn.js");
const withdrawVoltrStrategyAction = {
    name: "WITHDRAW_VOLTR_STRATEGY",
    similes: [
        "withdraw from voltr strategy",
        "remove funds from voltr vault strategy",
        "take out from voltr strategy",
        "withdraw assets from voltr",
        "pull from voltr vault",
        "redeem from voltr strategy",
    ],
    description: "Withdraw assets from a specific strategy within a Voltr vault",
    examples: [
        [
            {
                input: {
                    withdrawAmount: "1000000000", // 1 USDC with 6 decimals
                    vault: "7opUkqYtxmQRriZvwZkPcg6LqmGjAh1RSEsVrdsGDx5K",
                    strategy: "9ZQQYvr4x7AMqd6abVa1f5duGjti5wk1MHsX6hogPsLk",
                },
                output: {
                    status: "success",
                    vault: "7opUkqYtxmQRriZvwZkPcg6LqmGjAh1RSEsVrdsGDx5K",
                    strategy: "9ZQQYvr4x7AMqd6abVa1f5duGjti5wk1MHsX6hogPsLk",
                    signature: "2ZE7Rz...",
                    message: "Successfully withdrew 1000000000 from strategy",
                },
                explanation: "Withdraw 1 USDC from a Voltr vault strategy",
            },
        ],
    ],
    schema: zod_1.z.object({
        withdrawAmount: zod_1.z
            .string()
            .min(1)
            .describe("The amount to withdraw (in base units including decimals)"),
        vault: zod_1.z
            .string()
            .min(1)
            .describe("The public key of the Voltr source vault to deposit assets into, e.g., 'Ga27...'"),
        strategy: zod_1.z
            .string()
            .min(1)
            .describe("The public key of the initialized target strategy to withdraw from, e.g., 'Jheh...'"),
    }),
    handler: async (agent, input) => {
        try {
            const withdrawAmount = new bn_js_1.BN(input.withdrawAmount);
            const vault = new web3_js_1.PublicKey(input.vault);
            const strategy = new web3_js_1.PublicKey(input.strategy);
            const signature = await agent.voltrWithdrawStrategy(withdrawAmount, vault, strategy);
            return {
                status: "success",
                vault: vault.toBase58(),
                strategy: strategy.toBase58(),
                signature,
                message: `Successfully withdrew ${input.withdrawAmount} from strategy`,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to withdraw from strategy: ${error.message}`,
            };
        }
    },
};
exports.default = withdrawVoltrStrategyAction;
//# sourceMappingURL=withdrawStrategy.js.map