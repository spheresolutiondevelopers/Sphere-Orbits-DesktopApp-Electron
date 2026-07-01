"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMeetingsUseCase = void 0;
const shared_1 = require("@sphere/shared");
class GetMeetingsUseCase {
    constructor(meetingRepo) {
        this.meetingRepo = meetingRepo;
    }
    async execute(userID, filters, pagination) {
        if (!userID) {
            return (0, shared_1.err)(new Error('userID is required'));
        }
        return this.meetingRepo.getMeetings(userID, filters, pagination);
    }
}
exports.GetMeetingsUseCase = GetMeetingsUseCase;
//# sourceMappingURL=GetMeetingsUseCase.js.map