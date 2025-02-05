"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaOrcaCreateSingleSideLiquidityPool = void 0;
const web3_js_1 = require("@solana/web3.js");
const decimal_js_1 = require("decimal.js");
const orca_1 = require("../../tools/orca");
const tools_1 = require("langchain/tools");
class SolanaOrcaCreateSingleSideLiquidityPool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "orca_create_single_sided_liquidity_pool";
        this.description = `Create a single-sided liquidity pool on Orca, the most efficient and capital-optimized CLMM platform on Solana.

  This function initializes a single-sided liquidity pool, ideal for community driven project, fair launches, and fundraising. Minimize price impact by setting a narrow price range.

  Inputs (JSON string):
  - depositTokenAmount: number, in units of the deposit token including decimals, e.g., 1000000000 (required).
  - depositTokenMint: string, mint address of the deposit token, e.g., "DepositTokenMintAddress" (required).
  - otherTokenMint: string, mint address of the other token, e.g., "OtherTokenMintAddress" (required).
  - initialPrice: number, initial price of the deposit token in terms of the other token, e.g., 0.001 (required).
  - maxPrice: number, maximum price at which liquidity is added, e.g., 5.0 (required).
  - feeTier: number, fee tier for the pool in bps. Options: 1, 2, 4, 5, 16, 30, 65, 100, 200 (required).`;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const depositTokenAmount = inputFormat.depositTokenAmount;
            const depositTokenMint = new web3_js_1.PublicKey(inputFormat.depositTokenMint);
            const otherTokenMint = new web3_js_1.PublicKey(inputFormat.otherTokenMint);
            const initialPrice = new decimal_js_1.Decimal(inputFormat.initialPrice);
            const maxPrice = new decimal_js_1.Decimal(inputFormat.maxPrice);
            const feeTier = inputFormat.feeTier;
            if (!feeTier || !(feeTier in orca_1.FEE_TIERS)) {
                throw new Error(`Invalid feeTier. Available options: ${Object.keys(orca_1.FEE_TIERS).join(", ")}`);
            }
            const txId = await this.solanaKit.orcaCreateSingleSidedLiquidityPool(depositTokenAmount, depositTokenMint, otherTokenMint, initialPrice, maxPrice, feeTier);
            return JSON.stringify({
                status: "success",
                message: "Single-sided Whirlpool created successfully",
                transaction: txId,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaOrcaCreateSingleSideLiquidityPool = SolanaOrcaCreateSingleSideLiquidityPool;
//# sourceMappingURL=orca_single_sided_pool.js.map