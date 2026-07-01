"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductivityScoreUseCase = void 0;
const shared_1 = require("@sphere/shared");
class GetProductivityScoreUseCase {
    constructor(analyticsRepo) {
        this.analyticsRepo = analyticsRepo;
    }
    async execute(userID, date) {
        if (!userID) {
            return (0, shared_1.err)(new Error('userID is required'));
        }
        return this.analyticsRepo.getProductivityScore(userID, date);
    }
}
exports.GetProductivityScoreUseCase = GetProductivityScoreUseCase;
//# sourceMappingURL=GetProductivityScoreUseCase.js.map