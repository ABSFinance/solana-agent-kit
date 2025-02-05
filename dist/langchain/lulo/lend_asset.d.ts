import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";
export declare class SolanaLendAssetTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(input: string): Promise<string>;
}
//# sourceMappingURL=lend_asset.d.ts.map