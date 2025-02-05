import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";
export declare class SolanaVoltrWithdrawStrategy extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(input: string): Promise<string>;
}
//# sourceMappingURL=withdraw_strategy.d.ts.map