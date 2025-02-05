"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTPS = getTPS;
async function getTPS(agent) {
    const perfSamples = await agent.connection.getRecentPerformanceSamples();
    if (!perfSamples.length ||
        !perfSamples[0]?.numTransactions ||
        !perfSamples[0]?.samplePeriodSecs) {
        throw new Error("No performance samples available");
    }
    const tps = perfSamples[0].numTransactions / perfSamples[0].samplePeriodSecs;
    return tps;
}
//# sourceMappingURL=get_tps.js.map