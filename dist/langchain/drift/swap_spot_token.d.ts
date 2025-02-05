import { Tool } from "langchain/tools";
import type { SolanaAgentKit } from "../../agent";
export declare class SolanaDriftSpotTokenSwapTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
//# sourceMappingURL=swap_spot_token.d.ts.map