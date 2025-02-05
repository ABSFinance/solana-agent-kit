import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";
export declare class SolanaApproveProposal2by2Multisig extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
//# sourceMappingURL=approve_proposal.d.ts.map