import { Tool } from "langchain/tools";
import type { SolanaAgentKit } from "../../agent";
export declare class SolanaDriftEntryQuoteOfPerpTradeTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
//# sourceMappingURL=entry_quote_of_perp_trade.d.ts.map