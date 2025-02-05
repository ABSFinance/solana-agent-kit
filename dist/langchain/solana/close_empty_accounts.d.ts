import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";
export declare class SolanaCloseEmptyTokenAccounts extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(): Promise<string>;
}
//# sourceMappingURL=close_empty_accounts.d.ts.map