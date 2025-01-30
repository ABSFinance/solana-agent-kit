import "dotenv/config";
import { SolanaAgentKit } from "../../src";
import { PublicKey } from "@solana/web3.js";
import { TokenAmount, toToken, Raydium, Percent, ApiV3PoolInfoStandardItem } from "@raydium-io/raydium-sdk-v2";
import Decimal from "decimal.js";
import { addLiquidityToDriftVault } from "../../src/tools/drift/drift_vault";

const agent = new SolanaAgentKit(
  process.env.SOLANA_PRIVATE_KEY!,
  process.env.RPC_URL!,
  { OPENAI_API_KEY: process.env.OPENAI_API_KEY! },
);

// Test configuration
const vaultAddress = "8v9scusseJaAG6vkffCSUiinZUqQ3DA1JtR2Ynz98Gk5";
const poolId = "AgFnRLUScRD2E4nWQxW73hdbSN7eKEUb2jHX7tx9YTYc";
const inputAmount = new Decimal(0.01);

// Example: Adding liquidity to SOL-USDC pool
(async () => {
  try {
    // First, get the pool info to get token details
    const raydium = await Raydium.load({
      owner: agent.wallet,
      connection: agent.connection,
    });

    const poolData = await raydium.api.fetchPoolById({ ids: poolId });
    if (poolData[0].type !== "Standard") {
      throw new Error("Only standard pools are supported");
    }
    const poolInfo = poolData[0] as ApiV3PoolInfoStandardItem;

    // Compute the other token amount based on pool ratio
    const r = raydium.liquidity.computePairAmount({
      poolInfo,
      amount: inputAmount,
      baseIn: true,
      slippage: new Percent(1, 100), // 1% slippage
    });

    // Create token amounts
    const amountInA = new TokenAmount(
      toToken(poolInfo.mintA),
      new Decimal(inputAmount).mul(10 ** poolInfo.mintA.decimals).toFixed(0)
    );

    const amountInB = new TokenAmount(
      toToken(poolInfo.mintB),
      new Decimal(r.maxAnotherAmount.toExact())
        .mul(10 ** poolInfo.mintB.decimals)
        .toFixed(0)
    );

    // Set minimum amount from computed values
    const otherAmountMin = r.minAnotherAmount;

    // Add liquidity
    const txid = await addLiquidityToDriftVault(
      agent,
      vaultAddress,
      poolId,
      amountInA,
      amountInB,
      otherAmountMin,
      "a", // fixed side is token A
      {
        bypassAssociatedCheck: false,
        checkCreateATAOwner: false,
      }
    );

    console.log("Transaction successful! TxID:", txid);
    console.log("Amount A:", amountInA.toExact());
    console.log("Amount B:", amountInB.toExact());
    console.log("Min Amount B:", otherAmountMin.toExact());
  } catch (error) {
    console.error("Error adding liquidity:", error);
  }
})(); 
