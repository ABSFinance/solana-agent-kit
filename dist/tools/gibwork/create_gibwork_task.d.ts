import { PublicKey } from "@solana/web3.js";
import { GibworkCreateTaskReponse, SolanaAgentKit } from "../../index";
/**
 * Create an new task on Gibwork
 * @param agent SolanaAgentKit instance
 * @param title Title of the task
 * @param content Description of the task
 * @param requirements Requirements to complete the task
 * @param tags List of tags associated with the task
 * @param payer Payer address for the task (default: agent wallet address)
 * @param tokenMintAddress Token mint address for payment
 * @param tokenAmount Payment amount for the task
 * @returns Object containing task creation transaction and generated taskId
 */
export declare function create_gibwork_task(agent: SolanaAgentKit, title: string, content: string, requirements: string, tags: string[], tokenMintAddress: PublicKey, tokenAmount: number, payer?: PublicKey): Promise<GibworkCreateTaskReponse>;
//# sourceMappingURL=create_gibwork_task.d.ts.map