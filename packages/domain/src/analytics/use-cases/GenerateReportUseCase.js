"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateReportUseCase = void 0;
const shared_1 = require("@sphere/shared");
class GenerateReportUseCase {
    constructor(analyticsRepo) {
        this.analyticsRepo = analyticsRepo;
    }
    async execute(userID, options) {
        if (!userID) {
            return (0, shared_1.err)(new Error('userID is required'));
        }
        if (!options.startDate || !options.endDate) {
            return (0, shared_1.err)(new Error('startDate and endDate are required'));
        }
        const start = new Date(options.startDate);
        const end = new Date(options.endDate);
        if (start > end) {
            return (0, shared_1.err)(new Error('startDate must be before endDate'));
        }
        if (options.type === 'custom' && !options.startDate && !options.endDate) {
            return (0, shared_1.err)(new Error('Custom report requires startDate and endDate'));
        }
        return this.analyticsRepo.generateReport(userID, options);
    }
}
exports.GenerateReportUseCase = GenerateReportUseCase;
//# sourceMappingURL=GenerateReportUseCase.js.map