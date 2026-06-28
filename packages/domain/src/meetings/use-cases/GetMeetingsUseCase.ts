import { Result } from '@sphere/shared';
import { IMeetingRepository, MeetingFilters, PaginationOptions, PaginatedResult } from '../repositories/IMeetingRepository';
import { Meeting } from '../entities/Meeting';

export class GetMeetingsUseCase {
  constructor(private readonly meetingRepo: IMeetingRepository) {}

  async execute(
    userID: string,
    filters?: MeetingFilters,
    pagination?: PaginationOptions
  ): Promise<Result<PaginatedResult<Meeting>, Error>> {
    if (!userID) {
      return Result.err(new Error('userID is required'));
    }
    return this.meetingRepo.getMeetings(userID, filters, pagination);
  }
}