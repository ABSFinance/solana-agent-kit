import "dotenv/config";
import { SolanaAgentKit } from "../../src";
import { addLiquidityBalToDriftVault } from "../../src/tools/drift/drift_vault";

const agent = new SolanaAgentKit(
  process.env.SOLANA_PRIVATE_KEY!,
  process.env.RPC_URL!,
  { OPENAI_API_KEY: process.env.OPENAI_API_KEY! },
);

// Test configuration
// const vaultAddress = "8v9scusseJaAG6vkffCSUiinZUqQ3DA1JtR2Ynz98Gk5";
const vaultAddress = "8v9scusseJaAG6vkffCSUiinZUqQ3DA1JtR2Ynz98Gk5";
const amount = 10; // 1 USDC

// Example: Adding balanced liquidity to SOL-PERP market
(async () => {
  try {
    const txid = await addLiquidityBalToDriftVault(
      agent,
      vaultAddress,
      "SOL",       // market symbol
      amount       // amount
    );  

    console.log("Liquidity added successfully!");
    console.log("Transaction ID:", txid);
    console.log("Market: SOL-PERP");
    console.log("Amount:", amount);

  } catch (error) {
    console.error("Error adding liquidity:", error);
  }
})(); 