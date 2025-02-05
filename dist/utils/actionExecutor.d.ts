import { Action } from "../types/action";
import { SolanaAgentKit } from "../agent";
/**
 * Find an action by its name or one of its similes
 */
export declare function findAction(query: string): Action | undefined;
/**
 * Execute an action with the given input
 */
export declare function executeAction(action: Action, agent: SolanaAgentKit, input: Record<string, any>): Promise<Record<string, any>>;
/**
 * Get examples for an action
 */
export declare function getActionExamples(action: Action): string;
//# sourceMappingURL=actionExecutor.d.ts.map