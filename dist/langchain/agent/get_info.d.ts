import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";
export declare class SolanaGetInfoTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    private validateInput;
    protected _call(input: string): Promise<string>;
}
//# sourceMappingURL=get_info.d.ts.map