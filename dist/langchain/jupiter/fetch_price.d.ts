import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";
/**
 * Tool to fetch the price of a token in USDC
 */
export declare class SolanaFetchPriceTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(input: string): Promise<string>;
}
//# sourceMappingURL=fetch_price.d.ts.map