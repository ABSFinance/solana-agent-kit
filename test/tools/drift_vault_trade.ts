import "dotenv/config";
import { SolanaAgentKit } from "../../src";
import { tradeDriftVault } from "../../src/tools/drift/drift_vault";

const agent = new SolanaAgentKit(
  process.env.SOLANA_PRIVATE_KEY!,
  process.env.RPC_URL!,
  { OPENAI_API_KEY: process.env.OPENAI_API_KEY! },
);

// Test configuration
const vaultAddress = "8v9scusseJaAG6vkffCSUiinZUqQ3DA1JtR2Ynz98Gk5";

// Example: Market long of $100 USD worth of SOL
(async () => {
  try {
    const txid = await tradeDriftVault(
      agent,
      vaultAddress,
      100, // USD amount
      "SOL",
      "long",
      "market"
    );

    console.log("Vault trade executed successfully!");
    console.log("Transaction ID:", txid);
    console.log("Action: Market Long");
    console.log("Symbol: SOL-PERP");
    console.log("Notional Size: $100");

  } catch (error) {
    console.error("Error executing vault trade:", error);
  }
})();