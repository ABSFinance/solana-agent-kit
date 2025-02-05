"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voltrWithdrawStrategy = voltrWithdrawStrategy;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const vault_sdk_1 = require("@voltr/vault-sdk");
/**
 * Withdraws assets from a Voltr strategy
 * @param agent SolanaAgentKit instance
 * @param withdrawAmount Amount to withdraw in base units (BN)
 * @param vault Public key of the target vault
 * @param strategy Public key of the target strategy
 * @returns Transaction signature for the deposit
 */
async function voltrWithdrawStrategy(agent, withdrawAmount, vault, strategy) {
    const vc = new vault_sdk_1.VoltrClient(agent.connection, agent.wallet);
    const vaultAccount = await vc.fetchVaultAccount(vault);
    const vaultAssetMint = vaultAccount.asset.mint;
    const assetTokenProgram = await agent.connection
        .getAccountInfo(new web3_js_1.PublicKey(vaultAssetMint))
        .then((account) => account?.owner);
    if (!assetTokenProgram ||
        !(assetTokenProgram.equals(spl_token_1.TOKEN_PROGRAM_ID) ||
            assetTokenProgram.equals(spl_token_1.TOKEN_2022_PROGRAM_ID))) {
        throw new Error("Invalid asset token program");
    }
    const response = await fetch(`https://voltr.xyz/api/remaining-accounts/deposit-strategy?vault=${vault.toBase58()}&strategy=${strategy.toBase58()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = (await response.json()).data;
    const additionalArgs = data.additionalArgs
        ? Buffer.from(data.additionalArgs)
        : null;
    const instructionDiscriminator = data.instructionDiscriminator
        ? Buffer.from(data.instructionDiscriminator)
        : null;
    const remainingAccounts = data.remainingAccounts?.map((account) => ({
        pubkey: new web3_js_1.PublicKey(account.pubkey),
        isSigner: account.isSigner,
        isWritable: account.isWritable,
    })) ?? [];
    const manager = new web3_js_1.PublicKey("VOLTR_MANAGER_ADDRESS_HERE");
    const withdrawIx = await vc.createWithdrawStrategyIx({
        withdrawAmount,
        additionalArgs,
        instructionDiscriminator,
    }, {
        manager,
        vault,
        vaultAssetMint,
        strategy,
        assetTokenProgram,
        remainingAccounts,
    });
    const transaction = new web3_js_1.Transaction();
    transaction.add(withdrawIx);
    const txSig = await (0, web3_js_1.sendAndConfirmTransaction)(agent.connection, transaction, [
        agent.wallet,
    ]);
    return txSig;
}
//# sourceMappingURL=voltr_withdraw_strategy.js.map