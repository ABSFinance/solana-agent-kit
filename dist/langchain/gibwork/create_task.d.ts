import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";
export declare class SolanaCreateGibworkTask extends Tool {
    private solanaSdk;
    name: string;
    description: string;
    constructor(solanaSdk: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
//# sourceMappingURL=create_task.d.ts.map