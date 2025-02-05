"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaBatchOrderTool = void 0;
const manifest_1 = require("../../tools/manifest");
const web3_js_1 = require("@solana/web3.js");
const tools_1 = require("langchain/tools");
class SolanaBatchOrderTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_batch_order";
        this.description = `Places multiple limit orders in one transaction using Manifest. Submit orders either as a list or pattern:

  1. List format:
  {
    "marketId": "ENhU8LsaR7vDD2G1CsWcsuSGNrih9Cv5WZEk7q9kPapQ",
    "orders": [
      { "quantity": 1, "side": "Buy", "price": 200 },
      { "quantity": 0.5, "side": "Sell", "price": 205 }
    ]
  }

  2. Pattern format:
  {
    "marketId": "ENhU8LsaR7vDD2G1CsWcsuSGNrih9Cv5WZEk7q9kPapQ",
    "pattern": {
      "side": "Buy",
      "totalQuantity": 100,
      "priceRange": { "max": 1.0 },
      "spacing": { "type": "percentage", "value": 1 },
      "numberOfOrders": 5
    }
  }

  Examples:
  - "Place 5 buy orders totaling 100 tokens, 1% apart below $1"
  - "Create 3 sell orders of 10 tokens each between $50-$55"
  - "Place buy orders worth 50 tokens, $0.10 spacing from $0.80"

  Important: All orders must be in one transaction. Combine buy and sell orders into a single pattern or list. Never break the orders down to individual buy or sell orders.`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            let ordersToPlace = [];
            if (!parsedInput.marketId) {
                throw new Error("Market ID is required");
            }
            if (parsedInput.pattern) {
                ordersToPlace = (0, manifest_1.generateOrdersfromPattern)(parsedInput.pattern);
            }
            else if (Array.isArray(parsedInput.orders)) {
                ordersToPlace = parsedInput.orders;
            }
            else {
                throw new Error("Either pattern or orders array is required");
            }
            if (ordersToPlace.length === 0) {
                throw new Error("No orders generated or provided");
            }
            ordersToPlace.forEach((order, index) => {
                if (!order.quantity || !order.side || !order.price) {
                    throw new Error(`Invalid order at index ${index}: quantity, side, and price are required`);
                }
                if (order.side !== "Buy" && order.side !== "Sell") {
                    throw new Error(`Invalid side at index ${index}: must be "Buy" or "Sell"`);
                }
            });
            const tx = await this.solanaKit.batchOrder(new web3_js_1.PublicKey(parsedInput.marketId), parsedInput.orders);
            return JSON.stringify({
                status: "success",
                message: "Batch order executed successfully",
                transaction: tx,
                marketId: parsedInput.marketId,
                orders: parsedInput.orders,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaBatchOrderTool = SolanaBatchOrderTool;
//# sourceMappingURL=batch_order.js.map