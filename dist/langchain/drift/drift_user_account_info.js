"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaDriftUserAccountInfoTool = void 0;
const tools_1 = require("langchain/tools");
class SolanaDriftUserAccountInfoTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "drift_user_account_info";
        this.description = `Get information about your drift account.
  
  Inputs: No inputs required - retrieves current user's account info`;
    }
    async _call(_input) {
        try {
            const accountInfo = await this.solanaKit.driftUserAccountInfo();
            return JSON.stringify({
                status: "success",
                data: accountInfo,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "DRIFT_ACCOUNT_INFO_ERROR",
            });
        }
    }
}
exports.SolanaDriftUserAccountInfoTool = SolanaDriftUserAccountInfoTool;
//# sourceMappingURL=drift_user_account_info.js.map