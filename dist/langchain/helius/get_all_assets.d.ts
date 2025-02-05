import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";
export declare class SolanaGetAllAssetsByOwner extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
//# sourceMappingURL=get_all_assets.d.ts.map