import { Tool } from "langchain/tools";
import type { SolanaAgentKit } from "../../agent";
export declare class SolanaDriftLendAndBorrowAPYTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
//# sourceMappingURL=lend_and_borrow_apy.d.ts.map