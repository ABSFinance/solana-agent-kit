import { Tool } from "langchain/tools";
import type { SolanaAgentKit } from "../../agent";
export declare class SolanaDriftPerpMarketFundingRateTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
//# sourceMappingURL=perp_market_funding_rate.d.ts.map