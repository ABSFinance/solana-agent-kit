import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";
export declare class SolanaOrcaCreateSingleSideLiquidityPool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(input: string): Promise<string>;
}
//# sourceMappingURL=orca_single_sided_pool.d.ts.map