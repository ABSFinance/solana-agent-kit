"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const zod_1 = require("zod");
const openbook_1 = require("../../tools/openbook");
const createOpenbookMarketAction = {
    name: "CREATE_OPENBOOK_MARKET",
    similes: [
        "create openbook market",
        "setup trading market",
        "new openbook market",
        "create trading pair",
        "setup dex market",
        "new trading market",
    ],
    description: "Create a new trading market on Openbook DEX",
    examples: [
        [
            {
                input: {
                    baseMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
                    quoteMint: "So11111111111111111111111111111111111111112", // SOL
                    lotSize: 1,
                    tickSize: 0.01,
                },
                output: {
                    status: "success",
                    signatures: ["2ZE7Rz...", "3YKpM1..."],
                    message: "Successfully created Openbook market",
                },
                explanation: "Create a new USDC/SOL market on Openbook with default lot and tick sizes",
            },
        ],
    ],
    schema: zod_1.z.object({
        baseMint: zod_1.z.string().min(1).describe("The base token's mint address"),
        quoteMint: zod_1.z.string().min(1).describe("The quote token's mint address"),
        lotSize: zod_1.z
            .number()
            .positive()
            .default(1)
            .describe("The minimum order size (lot size)"),
        tickSize: zod_1.z
            .number()
            .positive()
            .default(0.01)
            .describe("The minimum price increment (tick size)"),
    }),
    handler: async (agent, input) => {
        try {
            const baseMint = new web3_js_1.PublicKey(input.baseMint);
            const quoteMint = new web3_js_1.PublicKey(input.quoteMint);
            const lotSize = input.lotSize || 1;
            const tickSize = input.tickSize || 0.01;
            const signatures = await (0, openbook_1.openbookCreateMarket)(agent, baseMint, quoteMint, lotSize, tickSize);
            return {
                status: "success",
                signatures,
                message: "Successfully created Openbook market",
            };
        }
        catch (error) {
            return {
                status: "error",
                message: `Failed to create Openbook market: ${error.message}`,
            };
        }
    },
};
exports.default = createOpenbookMarketAction;
//# sourceMappingURL=createOpenbookMarket.js.map