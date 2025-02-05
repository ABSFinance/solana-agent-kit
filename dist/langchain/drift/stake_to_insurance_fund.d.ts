import { Tool } from "langchain/tools";
import type { SolanaAgentKit } from "../../agent";
export declare class SolanaStakeToDriftInsuranceFundTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
//# sourceMappingURL=stake_to_insurance_fund.d.ts.map