import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";
export declare class SolanaAlloraGetPriceInference extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(input: string): Promise<string>;
}
//# sourceMappingURL=get_price_inference.d.ts.map