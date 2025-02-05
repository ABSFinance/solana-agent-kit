import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";
export declare class SolanaGetWalletAddressTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(_input: string): Promise<string>;
}
//# sourceMappingURL=wallet_address.d.ts.map