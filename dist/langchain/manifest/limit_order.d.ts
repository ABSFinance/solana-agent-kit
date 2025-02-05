import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";
export declare class SolanaLimitOrderTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
//# sourceMappingURL=limit_order.d.ts.map