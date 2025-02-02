import "dotenv/config";
import { SolanaAgentKit } from "../../src";
import { removeLiquidityBalFromDriftVault } from "../../src/tools/drift/drift_vault";

const agent = new SolanaAgentKit(
  process.env.SOLANA_PRIVATE_KEY!,
  process.env.RPC_URL!,
  { OPENAI_API_KEY: process.env.OPENAI_API_KEY! },
);

// Test configuration
const vaultAddress = "8v9scusseJaAG6vkffCSUiinZUqQ3DA1JtR2Ynz98Gk5";

// Example: Removing balanced liquidity from SOL-PERP market
(async () => {
  try {
    const txid = await removeLiquidityBalFromDriftVault(
      agent,
      vaultAddress,
      "SOL"       // market symbol
    );  

    console.log("Liquidity removed successfully!");
    console.log("Transaction ID:", txid);
    console.log("Market: SOL-PERP");

  } catch (error) {
    console.error("Error removing liquidity:", error);
  }
})(); 