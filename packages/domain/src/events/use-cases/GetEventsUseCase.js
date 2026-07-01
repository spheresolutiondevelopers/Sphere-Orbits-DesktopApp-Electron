"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEventsUseCase = void 0;
const shared_1 = require("@sphere/shared");
class GetEventsUseCase {
    constructor(eventRepo) {
        this.eventRepo = eventRepo;
    }
    async execute(userID, filters, pagination) {
        if (!userID) {
            return (0, shared_1.err)(new Error('userID is required'));
        }
        return this.eventRepo.getEvents(userID, filters, pagination);
    }
}
exports.GetEventsUseCase = GetEventsUseCase;
//# sourceMappingURL=GetEventsUseCase.js.map