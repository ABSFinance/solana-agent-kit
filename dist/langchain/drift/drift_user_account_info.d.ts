import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";
export declare class SolanaDriftUserAccountInfoTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(_input: string): Promise<string>;
}
//# sourceMappingURL=drift_user_account_info.d.ts.map