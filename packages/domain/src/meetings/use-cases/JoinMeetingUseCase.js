"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinMeetingUseCase = void 0;
const shared_1 = require("@sphere/shared");
class JoinMeetingUseCase {
    constructor(meetingRepo) {
        this.meetingRepo = meetingRepo;
    }
    async execute(input) {
        if (!input.meetingID) {
            return (0, shared_1.err)(new Error('meetingID is required'));
        }
        if (!input.userID) {
            return (0, shared_1.err)(new Error('userID is required'));
        }
        if (!input.participantEmail) {
            return (0, shared_1.err)(new Error('participantEmail is required'));
        }
        if (!input.participantName) {
            return (0, shared_1.err)(new Error('participantName is required'));
        }
        // First, ensure the meeting exists and the user is authorized.
        const meetingResult = await this.meetingRepo.getMeetingById(input.meetingID, input.userID);
        if (meetingResult.isFailure()) {
            return meetingResult;
        }
        // Then, join the meeting (may call external API).
        return this.meetingRepo.joinMeeting(input.meetingID, input.userID, input.participantEmail, input.participantName);
    }
}
exports.JoinMeetingUseCase = JoinMeetingUseCase;
//# sourceMappingURL=JoinMeetingUseCase.js.map