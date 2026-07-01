import { type Result } from '@sphere/shared';
import { IMeetingRepository, MeetingFilters, PaginationOptions, PaginatedResult } from '../repositories/IMeetingRepository';
import { Meeting } from '../entities/Meeting';
export declare class GetMeetingsUseCase {
    private readonly meetingRepo;
    constructor(meetingRepo: IMeetingRepository);
    execute(userID: string, filters?: MeetingFilters, pagination?: PaginationOptions): Promise<Result<PaginatedResult<Meeting>, Error>>;
}
//# sourceMappingURL=GetMeetingsUseCase.d.ts.map