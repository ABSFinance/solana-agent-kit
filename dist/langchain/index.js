"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSolanaTools = createSolanaTools;
__exportStar(require("./adrena"), exports);
__exportStar(require("./alldomains"), exports);
__exportStar(require("./dexscreener"), exports);
__exportStar(require("./alldomains"), exports);
__exportStar(require("./flash"), exports);
__exportStar(require("./gibwork"), exports);
__exportStar(require("./jupiter"), exports);
__exportStar(require("./lulo"), exports);
__exportStar(require("./manifest"), exports);
__exportStar(require("./solana"), exports);
__exportStar(require("./agent"), exports);
__exportStar(require("./metaplex"), exports);
__exportStar(require("./openbook"), exports);
__exportStar(require("./orca"), exports);
__exportStar(require("./pumpfun"), exports);
__exportStar(require("./pyth"), exports);
__exportStar(require("./raydium"), exports);
__exportStar(require("./rugcheck"), exports);
__exportStar(require("./sendarcade"), exports);
__exportStar(require("./solayer"), exports);
__exportStar(require("./tensor"), exports);
__exportStar(require("./3land"), exports);
__exportStar(require("./tiplink"), exports);
__exportStar(require("./sns"), exports);
__exportStar(require("./lightprotocol"), exports);
__exportStar(require("./squads"), exports);
__exportStar(require("./meteora"), exports);
__exportStar(require("./helius"), exports);
__exportStar(require("./drift"), exports);
__exportStar(require("./voltr"), exports);
__exportStar(require("./allora"), exports);
const index_1 = require("./index");
function createSolanaTools(solanaKit) {
    return [
        new index_1.SolanaGetInfoTool(solanaKit),
        new index_1.SolanaBalanceTool(solanaKit),
        new index_1.SolanaBalanceOtherTool(solanaKit),
        new index_1.SolanaTransferTool(solanaKit),
        new index_1.SolanaDeployTokenTool(solanaKit),
        new index_1.SolanaDeployCollectionTool(solanaKit),
        new index_1.SolanaMintNFTTool(solanaKit),
        new index_1.SolanaTradeTool(solanaKit),
        new index_1.SolanaRequestFundsTool(solanaKit),
        new index_1.SolanaRegisterDomainTool(solanaKit),
        new index_1.SolanaGetWalletAddressTool(solanaKit),
        new index_1.SolanaPumpfunTokenLaunchTool(solanaKit),
        new index_1.SolanaCreateImageTool(solanaKit),
        new index_1.SolanaLendAssetTool(solanaKit),
        new index_1.SolanaLuloLendTool(solanaKit),
        new index_1.SolanaLuloWithdrawTool(solanaKit),
        new index_1.SolanaTPSCalculatorTool(solanaKit),
        new index_1.SolanaStakeTool(solanaKit),
        new index_1.SolanaRestakeTool(solanaKit),
        new index_1.SolanaFetchPriceTool(solanaKit),
        new index_1.SolanaGetDomainTool(solanaKit),
        new index_1.SolanaTokenDataTool(solanaKit),
        new index_1.SolanaTokenDataByTickerTool(solanaKit),
        new index_1.SolanaCompressedAirdropTool(solanaKit),
        new index_1.SolanaRaydiumCreateAmmV4(solanaKit),
        new index_1.SolanaRaydiumCreateClmm(solanaKit),
        new index_1.SolanaRaydiumCreateCpmm(solanaKit),
        new index_1.SolanaOpenbookCreateMarket(solanaKit),
        new index_1.SolanaManifestCreateMarket(solanaKit),
        new index_1.SolanaLimitOrderTool(solanaKit),
        new index_1.SolanaBatchOrderTool(solanaKit),
        new index_1.SolanaCancelAllOrdersTool(solanaKit),
        new index_1.SolanaWithdrawAllTool(solanaKit),
        new index_1.SolanaMeteoraCreateDynamicPool(solanaKit),
        new index_1.SolanaMeteoraCreateDlmmPool(solanaKit),
        new index_1.SolanaClosePosition(solanaKit),
        new index_1.SolanaOrcaCreateCLMM(solanaKit),
        new index_1.SolanaOrcaCreateSingleSideLiquidityPool(solanaKit),
        new index_1.SolanaOrcaFetchPositions(solanaKit),
        new index_1.SolanaOrcaOpenCenteredPosition(solanaKit),
        new index_1.SolanaOrcaOpenSingleSidedPosition(solanaKit),
        new index_1.SolanaPythFetchPrice(solanaKit),
        new index_1.SolanaResolveDomainTool(solanaKit),
        new index_1.SolanaGetOwnedDomains(solanaKit),
        new index_1.SolanaGetOwnedTldDomains(solanaKit),
        new index_1.SolanaGetAllTlds(solanaKit),
        new index_1.SolanaGetMainDomain(solanaKit),
        new index_1.SolanaResolveAllDomainsTool(solanaKit),
        new index_1.SolanaCreateGibworkTask(solanaKit),
        new index_1.SolanaRockPaperScissorsTool(solanaKit),
        new index_1.SolanaTipLinkTool(solanaKit),
        new index_1.SolanaListNFTForSaleTool(solanaKit),
        new index_1.SolanaCancelNFTListingTool(solanaKit),
        new index_1.SolanaCloseEmptyTokenAccounts(solanaKit),
        new index_1.SolanaFetchTokenReportSummaryTool(solanaKit),
        new index_1.SolanaFetchTokenDetailedReportTool(solanaKit),
        new index_1.Solana3LandCreateSingle(solanaKit),
        new index_1.Solana3LandCreateCollection(solanaKit),
        new index_1.SolanaPerpOpenTradeTool(solanaKit),
        new index_1.SolanaPerpCloseTradeTool(solanaKit),
        new index_1.SolanaFlashOpenTrade(solanaKit),
        new index_1.SolanaFlashCloseTrade(solanaKit),
        new index_1.SolanaCreate2by2Multisig(solanaKit),
        new index_1.SolanaCreateProposal2by2Multisig(solanaKit),
        new index_1.SolanaApproveProposal2by2Multisig(solanaKit),
        new index_1.SolanaRejectProposal2by2Multisig(solanaKit),
        new index_1.SolanaExecuteProposal2by2Multisig(solanaKit),
        new index_1.SolanaDepositTo2by2Multisig(solanaKit),
        new index_1.SolanaTransferFrom2by2Multisig(solanaKit),
        new index_1.SolanaSendTransactionWithPriorityFee(solanaKit),
        new index_1.SolanaHeliusWebhookTool(solanaKit),
        new index_1.SolanaGetHeliusWebhookTool(solanaKit),
        new index_1.SolanaDeleteHeliusWebhookTool(solanaKit),
        new index_1.SolanaParseTransactionHeliusTool(solanaKit),
        new index_1.SolanaGetAllAssetsByOwner(solanaKit),
        new index_1.Solana3LandCreateSingle(solanaKit),
        new index_1.SolanaSendTransactionWithPriorityFee(solanaKit),
        new index_1.SolanaHeliusWebhookTool(solanaKit),
        new index_1.SolanaGetHeliusWebhookTool(solanaKit),
        new index_1.SolanaDeleteHeliusWebhookTool(solanaKit),
        new index_1.SolanaCreateDriftUserAccountTool(solanaKit),
        new index_1.SolanaCreateDriftVaultTool(solanaKit),
        new index_1.SolanaDepositIntoDriftVaultTool(solanaKit),
        new index_1.SolanaDepositToDriftUserAccountTool(solanaKit),
        new index_1.SolanaDeriveVaultAddressTool(solanaKit),
        new index_1.SolanaCheckDriftAccountTool(solanaKit),
        new index_1.SolanaDriftUserAccountInfoTool(solanaKit),
        new index_1.SolanaRequestDriftWithdrawalTool(solanaKit),
        new index_1.SolanaTradeDelegatedDriftVaultTool(solanaKit),
        new index_1.SolanaTradeDriftPerpAccountTool(solanaKit),
        new index_1.SolanaUpdateDriftVaultDelegateTool(solanaKit),
        new index_1.SolanaUpdateDriftVaultTool(solanaKit),
        new index_1.SolanaDriftVaultInfoTool(solanaKit),
        new index_1.SolanaWithdrawFromDriftAccountTool(solanaKit),
        new index_1.SolanaWithdrawFromDriftVaultTool(solanaKit),
        new index_1.SolanaDriftSpotTokenSwapTool(solanaKit),
        new index_1.SolanaStakeToDriftInsuranceFundTool(solanaKit),
        new index_1.SolanaRequestUnstakeFromDriftInsuranceFundTool(solanaKit),
        new index_1.SolanaUnstakeFromDriftInsuranceFundTool(solanaKit),
        new index_1.SolanaDriftLendAndBorrowAPYTool(solanaKit),
        new index_1.SolanaDriftEntryQuoteOfPerpTradeTool(solanaKit),
        new index_1.SolanaDriftPerpMarketFundingRateTool(solanaKit),
        new index_1.SolanaVoltrGetPositionValues(solanaKit),
        new index_1.SolanaVoltrDepositStrategy(solanaKit),
        new index_1.SolanaVoltrWithdrawStrategy(solanaKit),
        new index_1.SolanaGetAssetTool(solanaKit),
        new index_1.SolanaGetAssetsByAuthorityTool(solanaKit),
        new index_1.SolanaGetAssetsByCreatorTool(solanaKit),
        new index_1.SolanaAlloraGetPriceInference(solanaKit),
        new index_1.SolanaAlloraGetAllTopics(solanaKit),
        new index_1.SolanaAlloraGetInferenceByTopicId(solanaKit),
    ];
}
//# sourceMappingURL=index.js.map