import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";
export declare class SolanaTradeDelegatedDriftVaultTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
//# sourceMappingURL=trade_delegated_vault.d.ts.map