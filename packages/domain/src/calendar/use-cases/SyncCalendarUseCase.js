"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncCalendarUseCase = void 0;
const shared_1 = require("@sphere/shared");
class SyncCalendarUseCase {
    constructor(calendarRepo) {
        this.calendarRepo = calendarRepo;
    }
    async execute(userID, source, startDate, endDate) {
        if (!userID) {
            return (0, shared_1.err)(new Error('userID is required'));
        }
        if (!startDate || !endDate) {
            return (0, shared_1.err)(new Error('startDate and endDate are required'));
        }
        if (new Date(startDate) > new Date(endDate)) {
            return (0, shared_1.err)(new Error('startDate must be before endDate'));
        }
        return this.calendarRepo.syncCalendar(userID, source, startDate, endDate);
    }
}
exports.SyncCalendarUseCase = SyncCalendarUseCase;
//# sourceMappingURL=SyncCalendarUseCase.js.map