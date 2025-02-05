import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";
export declare class SolanaCheckDriftAccountTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(_input: string): Promise<string>;
}
//# sourceMappingURL=does_user_have_drift_account.d.ts.map