import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";
export declare class SolanaAlloraGetAllTopics extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(_: string): Promise<string>;
}
//# sourceMappingURL=get_all_topics.d.ts.map