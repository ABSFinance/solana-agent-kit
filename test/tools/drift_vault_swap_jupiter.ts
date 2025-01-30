import { SolanaAgentKit } from "../../src/agent";
import { swapJupiterToDriftVault } from "../../src/tools/drift/drift_vault";
import { PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";

async function main() {
  // Initialize the agent
  const agent = new SolanaAgentKit(
    process.env.SOLANA_PRIVATE_KEY!,
    process.env.RPC_URL!,
    { OPENAI_API_KEY: process.env.OPENAI_API_KEY! },
  );

  // Example vault address (replace with your actual vault address)
  const vaultAddress = "8v9scusseJaAG6vkffCSUiinZUqQ3DA1JtR2Ynz98Gk5";

  // Example: Swap USDC to SOL
  const params = {
    inputMint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"), // USDC
    outputMint: new PublicKey("So11111111111111111111111111111111111111112"), // SOL
    amount: new BN(1000000), // 1 USDC (6 decimals)
    slippageBps: 100, // 1% slippage
    swapMode: "ExactIn" as const,
    useV6: true,
  };

  try {
    const txid = await swapJupiterToDriftVault(agent, vaultAddress, params);
    console.log("Swap successful! Transaction ID:", txid);
  } catch (error) {
    console.error("Error during swap:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 