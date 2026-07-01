import { type Result } from '@sphere/shared';
import { IMeetingRepository } from '../repositories/IMeetingRepository';
export interface JoinMeetingInput {
    meetingID: string;
    userID: string;
    participantEmail: string;
    participantName: string;
}
export declare class JoinMeetingUseCase {
    private readonly meetingRepo;
    constructor(meetingRepo: IMeetingRepository);
    execute(input: JoinMeetingInput): Promise<Result<{
        meetingLink: string;
    }, Error>>;
}
//# sourceMappingURL=JoinMeetingUseCase.d.ts.map