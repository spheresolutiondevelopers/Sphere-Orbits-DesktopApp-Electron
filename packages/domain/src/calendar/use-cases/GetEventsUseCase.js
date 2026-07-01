"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEventsUseCase = void 0;
const shared_1 = require("@sphere/shared");
class GetEventsUseCase {
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
        // Try to get from local cache first, then from remote.
        // We'll implement a simple strategy: fetch remote and merge with local.
        // The repository handles the details.
        return this.calendarRepo.getEvents(source, startDate, endDate);
    }
}
exports.GetEventsUseCase = GetEventsUseCase;
//# sourceMappingURL=GetEventsUseCase.js.map