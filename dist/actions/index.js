"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACTIONS = void 0;
const tokenBalances_1 = __importDefault(require("./tokenBalances"));
const deployToken_1 = __importDefault(require("./metaplex/deployToken"));
const balance_1 = __importDefault(require("./solana/balance"));
const transfer_1 = __importDefault(require("./solana/transfer"));
const deployCollection_1 = __importDefault(require("./metaplex/deployCollection"));
const mintNFT_1 = __importDefault(require("./metaplex/mintNFT"));
const trade_1 = __importDefault(require("./jupiter/trade"));
const requestFunds_1 = __importDefault(require("./solana/requestFunds"));
const registerDomain_1 = __importDefault(require("./sns/registerDomain"));
const getTokenData_1 = __importDefault(require("./jupiter/getTokenData"));
const getTPS_1 = __importDefault(require("./solana/getTPS"));
const fetchPrice_1 = __importDefault(require("./jupiter/fetchPrice"));
const stakeWithJup_1 = __importDefault(require("./jupiter/stakeWithJup"));
const stakeWithSolayer_1 = __importDefault(require("./solayer/stakeWithSolayer"));
const registerDomain_2 = __importDefault(require("./sns/registerDomain"));
const lendAsset_1 = __importDefault(require("./lulo/lendAsset"));
const luloLend_1 = __importDefault(require("./lulo/luloLend"));
const luloWithdraw_1 = __importDefault(require("./lulo/luloWithdraw"));
const createGibworkTask_1 = __importDefault(require("./gibwork/createGibworkTask"));
const resolveSolDomain_1 = __importDefault(require("./sns/resolveSolDomain"));
const pythFetchPrice_1 = __importDefault(require("./pyth/pythFetchPrice"));
const getOwnedDomainsForTLD_1 = __importDefault(require("./alldomains/getOwnedDomainsForTLD"));
const getPrimaryDomain_1 = __importDefault(require("./sns/getPrimaryDomain"));
const getAllDomainsTLDs_1 = __importDefault(require("./alldomains/getAllDomainsTLDs"));
const getOwnedAllDomains_1 = __importDefault(require("./alldomains/getOwnedAllDomains"));
const createImage_1 = __importDefault(require("./agent/createImage"));
const getMainAllDomainsDomain_1 = __importDefault(require("./sns/getMainAllDomainsDomain"));
const getAllRegisteredAllDomains_1 = __importDefault(require("./sns/getAllRegisteredAllDomains"));
const raydiumCreateCpmm_1 = __importDefault(require("./raydium/raydiumCreateCpmm"));
const raydiumCreateAmmV4_1 = __importDefault(require("./raydium/raydiumCreateAmmV4"));
const createOrcaSingleSidedWhirlpool_1 = __importDefault(require("./orca/createOrcaSingleSidedWhirlpool"));
const launchPumpfunToken_1 = __importDefault(require("./pumpfun/launchPumpfunToken"));
const getWalletAddress_1 = __importDefault(require("./agent/getWalletAddress"));
const flashOpenTrade_1 = __importDefault(require("./flash/flashOpenTrade"));
const flashCloseTrade_1 = __importDefault(require("./flash/flashCloseTrade"));
const createMultisig_1 = __importDefault(require("./squads/createMultisig"));
const approveMultisigProposal_1 = __importDefault(require("./squads/approveMultisigProposal"));
const createMultisigProposal_1 = __importDefault(require("./squads/createMultisigProposal"));
const depositToMultisigTreasury_1 = __importDefault(require("./squads/depositToMultisigTreasury"));
const executeMultisigProposal_1 = __importDefault(require("./squads/executeMultisigProposal"));
const rejectMultisigProposal_1 = __importDefault(require("./squads/rejectMultisigProposal"));
const transferFromMultisigTreasury_1 = __importDefault(require("./squads/transferFromMultisigTreasury"));
const createWebhook_1 = __importDefault(require("./helius/createWebhook"));
const deleteWebhook_1 = __importDefault(require("./helius/deleteWebhook"));
const getAssetsbyOwner_1 = __importDefault(require("./helius/getAssetsbyOwner"));
const getWebhook_1 = __importDefault(require("./helius/getWebhook"));
const parseTransaction_1 = __importDefault(require("./helius/parseTransaction"));
const sendTransactionWithPriority_1 = __importDefault(require("./helius/sendTransactionWithPriority"));
const createVault_1 = __importDefault(require("./drift/createVault"));
const updateVault_1 = __importDefault(require("./drift/updateVault"));
const depositIntoVault_1 = __importDefault(require("./drift/depositIntoVault"));
const requestWithdrawalFromVault_1 = __importDefault(require("./drift/requestWithdrawalFromVault"));
const withdrawFromVault_1 = __importDefault(require("./drift/withdrawFromVault"));
const tradeDelegatedDriftVault_1 = __importDefault(require("./drift/tradeDelegatedDriftVault"));
const vaultInfo_1 = __importDefault(require("./drift/vaultInfo"));
const createDriftUserAccount_1 = __importDefault(require("./drift/createDriftUserAccount"));
const tradePerpAccount_1 = __importDefault(require("./drift/tradePerpAccount"));
const doesUserHaveDriftAccount_1 = __importDefault(require("./drift/doesUserHaveDriftAccount"));
const depositToDriftUserAccount_1 = __importDefault(require("./drift/depositToDriftUserAccount"));
const withdrawFromDriftAccount_1 = __importDefault(require("./drift/withdrawFromDriftAccount"));
const driftUserAccountInfo_1 = __importDefault(require("./drift/driftUserAccountInfo"));
const deriveVaultAddress_1 = __importDefault(require("./drift/deriveVaultAddress"));
const updateDriftVaultDelegate_1 = __importDefault(require("./drift/updateDriftVaultDelegate"));
const availableMarkets_1 = __importDefault(require("./drift/availableMarkets"));
const stakeToDriftInsuranceFund_1 = __importDefault(require("./drift/stakeToDriftInsuranceFund"));
const requestUnstakeFromDriftInsuranceFund_1 = __importDefault(require("./drift/requestUnstakeFromDriftInsuranceFund"));
const unstakeFromDriftInsuranceFund_1 = __importDefault(require("./drift/unstakeFromDriftInsuranceFund"));
const swapSpotToken_1 = __importDefault(require("./drift/swapSpotToken"));
const perpMarketFundingRate_1 = __importDefault(require("./drift/perpMarketFundingRate"));
const entryQuoteOfPerpTrade_1 = __importDefault(require("./drift/entryQuoteOfPerpTrade"));
const getLendAndBorrowAPY_1 = __importDefault(require("./drift/getLendAndBorrowAPY"));
const getPositionValues_1 = __importDefault(require("./voltr/getPositionValues"));
const depositStrategy_1 = __importDefault(require("./voltr/depositStrategy"));
const withdrawStrategy_1 = __importDefault(require("./voltr/withdrawStrategy"));
const getAsset_1 = __importDefault(require("./metaplex/getAsset"));
const getAssetsByAuthority_1 = __importDefault(require("./metaplex/getAssetsByAuthority"));
const getAssetsByCreator_1 = __importDefault(require("./metaplex/getAssetsByCreator"));
const get_info_1 = __importDefault(require("./agent/get_info"));
const getPriceInference_1 = __importDefault(require("./allora/getPriceInference"));
const getAllTopics_1 = __importDefault(require("./allora/getAllTopics"));
const getInferenceByTopicId_1 = __importDefault(require("./allora/getInferenceByTopicId"));
exports.ACTIONS = {
    GET_INFO_ACTION: get_info_1.default,
    WALLET_ADDRESS_ACTION: getWalletAddress_1.default,
    TOKEN_BALANCES_ACTION: tokenBalances_1.default,
    DEPLOY_TOKEN_ACTION: deployToken_1.default,
    BALANCE_ACTION: balance_1.default,
    TRANSFER_ACTION: transfer_1.default,
    DEPLOY_COLLECTION_ACTION: deployCollection_1.default,
    MINT_NFT_ACTION: mintNFT_1.default,
    TRADE_ACTION: trade_1.default,
    REQUEST_FUNDS_ACTION: requestFunds_1.default,
    RESOLVE_DOMAIN_ACTION: registerDomain_1.default,
    GET_TOKEN_DATA_ACTION: getTokenData_1.default,
    GET_TPS_ACTION: getTPS_1.default,
    FETCH_PRICE_ACTION: fetchPrice_1.default,
    STAKE_WITH_JUP_ACTION: stakeWithJup_1.default,
    STAKE_WITH_SOLAYER_ACTION: stakeWithSolayer_1.default,
    REGISTER_DOMAIN_ACTION: registerDomain_2.default,
    LEND_ASSET_ACTION: lendAsset_1.default,
    LULO_LEND_ACTION: luloLend_1.default,
    LULO_WITHDRAW_ACTION: luloWithdraw_1.default,
    CREATE_GIBWORK_TASK_ACTION: createGibworkTask_1.default,
    RESOLVE_SOL_DOMAIN_ACTION: resolveSolDomain_1.default,
    PYTH_FETCH_PRICE_ACTION: pythFetchPrice_1.default,
    GET_OWNED_DOMAINS_FOR_TLD_ACTION: getOwnedDomainsForTLD_1.default,
    GET_PRIMARY_DOMAIN_ACTION: getPrimaryDomain_1.default,
    GET_ALL_DOMAINS_TLDS_ACTION: getAllDomainsTLDs_1.default,
    GET_OWNED_ALL_DOMAINS_ACTION: getOwnedAllDomains_1.default,
    CREATE_IMAGE_ACTION: createImage_1.default,
    GET_MAIN_ALL_DOMAINS_DOMAIN_ACTION: getMainAllDomainsDomain_1.default,
    GET_ALL_REGISTERED_ALL_DOMAINS_ACTION: getAllRegisteredAllDomains_1.default,
    RAYDIUM_CREATE_CPMM_ACTION: raydiumCreateCpmm_1.default,
    RAYDIUM_CREATE_AMM_V4_ACTION: raydiumCreateAmmV4_1.default,
    CREATE_ORCA_SINGLE_SIDED_WHIRLPOOL_ACTION: createOrcaSingleSidedWhirlpool_1.default,
    LAUNCH_PUMPFUN_TOKEN_ACTION: launchPumpfunToken_1.default,
    FLASH_OPEN_TRADE_ACTION: flashOpenTrade_1.default,
    FLASH_CLOSE_TRADE_ACTION: flashCloseTrade_1.default,
    CREATE_MULTISIG_ACTION: createMultisig_1.default,
    DEPOSIT_TO_MULTISIG_ACTION: depositToMultisigTreasury_1.default,
    TRANSFER_FROM_MULTISIG_ACTION: transferFromMultisigTreasury_1.default,
    CREATE_MULTISIG_PROPOSAL_ACTION: createMultisigProposal_1.default,
    APPROVE_MULTISIG_PROPOSAL_ACTION: approveMultisigProposal_1.default,
    REJECT_MULTISIG_PROPOSAL_ACTION: rejectMultisigProposal_1.default,
    EXECUTE_MULTISIG_PROPOSAL_ACTION: executeMultisigProposal_1.default,
    CREATE_WEBHOOK_ACTION: createWebhook_1.default,
    DELETE_WEBHOOK_ACTION: deleteWebhook_1.default,
    GET_ASSETS_BY_OWNER_ACTION: getAssetsbyOwner_1.default,
    GET_WEBHOOK_ACTION: getWebhook_1.default,
    PARSE_TRANSACTION_ACTION: parseTransaction_1.default,
    SEND_TRANSACTION_WITH_PRIORITY_ACTION: sendTransactionWithPriority_1.default,
    CREATE_DRIFT_VAULT_ACTION: createVault_1.default,
    UPDATE_DRIFT_VAULT_ACTION: updateVault_1.default,
    DEPOSIT_INTO_DRIFT_VAULT_ACTION: depositIntoVault_1.default,
    REQUEST_WITHDRAWAL_FROM_DRIFT_VAULT_ACTION: requestWithdrawalFromVault_1.default,
    WITHDRAW_FROM_DRIFT_VAULT_ACTION: withdrawFromVault_1.default,
    TRADE_DELEGATED_DRIFT_VAULT_ACTION: tradeDelegatedDriftVault_1.default,
    DRIFT_VAULT_INFO_ACTION: vaultInfo_1.default,
    CREATE_DRIFT_USER_ACCOUNT_ACTION: createDriftUserAccount_1.default,
    TRADE_DRIFT_PERP_ACCOUNT_ACTION: tradePerpAccount_1.default,
    DOES_USER_HAVE_DRIFT_ACCOUNT_ACTION: doesUserHaveDriftAccount_1.default,
    DEPOSIT_TO_DRIFT_USER_ACCOUNT_ACTION: depositToDriftUserAccount_1.default,
    WITHDRAW_OR_BORROW_FROM_DRIFT_ACCOUNT_ACTION: withdrawFromDriftAccount_1.default,
    DRIFT_USER_ACCOUNT_INFO_ACTION: driftUserAccountInfo_1.default,
    DERIVE_DRIFT_VAULT_ADDRESS_ACTION: deriveVaultAddress_1.default,
    UPDATE_DRIFT_VAULT_DELEGATE_ACTION: updateDriftVaultDelegate_1.default,
    AVAILABLE_DRIFT_MARKETS_ACTION: availableMarkets_1.default,
    STAKE_TO_DRIFT_INSURANCE_FUND_ACTION: stakeToDriftInsuranceFund_1.default,
    REQUEST_UNSTAKE_FROM_DRIFT_INSURANCE_FUND_ACTION: requestUnstakeFromDriftInsuranceFund_1.default,
    UNSTAKE_FROM_DRIFT_INSURANCE_FUND_ACTION: unstakeFromDriftInsuranceFund_1.default,
    DRIFT_SPOT_TOKEN_SWAP_ACTION: swapSpotToken_1.default,
    DRIFT_PERP_MARKET_FUNDING_RATE_ACTION: perpMarketFundingRate_1.default,
    DRIFT_GET_ENTRY_QUOTE_OF_PERP_TRADE_ACTION: entryQuoteOfPerpTrade_1.default,
    DRIFT_GET_LEND_AND_BORROW_APY_ACTION: getLendAndBorrowAPY_1.default,
    GET_VOLTR_POSITION_VALUES_ACTION: getPositionValues_1.default,
    DEPOSIT_VOLTR_STRATEGY_ACTION: depositStrategy_1.default,
    WITHDRAW_VOLTR_STRATEGY_ACTION: withdrawStrategy_1.default,
    GET_ASSET_ACTION: getAsset_1.default,
    GET_ASSETS_BY_AUTHORITY_ACTION: getAssetsByAuthority_1.default,
    GET_ASSETS_BY_CREATOR_ACTION: getAssetsByCreator_1.default,
    GET_PRICE_INFERENCE_ACTION: getPriceInference_1.default,
    GET_ALL_TOPICS_ACTION: getAllTopics_1.default,
    GET_INFERENCE_BY_TOPIC_ID_ACTION: getInferenceByTopicId_1.default,
};
//# sourceMappingURL=index.js.map