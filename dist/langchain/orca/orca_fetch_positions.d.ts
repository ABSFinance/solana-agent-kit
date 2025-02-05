import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";
export declare class SolanaOrcaFetchPositions extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(): Promise<string>;
}
//# sourceMappingURL=orca_fetch_positions.d.ts.map