import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";
export declare class SolanaCreateImageTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    private validateInput;
    protected _call(input: string): Promise<string>;
}
//# sourceMappingURL=create_image.d.ts.map