import { Result } from '@sphere/shared';
import { ICalendarRepository } from '../repositories/ICalendarRepository';

export class SyncCalendarUseCase {
  constructor(private readonly calendarRepo: ICalendarRepository) {}

  async execute(
    userID: string,
    source: 'google' | 'outlook' | 'apple',
    startDate: string,
    endDate: string
  ): Promise<Result<{ syncedCount: number; errors: string[] }, Error>> {
    if (!userID) {
      return Result.err(new Error('userID is required'));
    }
    if (!startDate || !endDate) {
      return Result.err(new Error('startDate and endDate are required'));
    }
    if (new Date(startDate) > new Date(endDate)) {
      return Result.err(new Error('startDate must be before endDate'));
    }

    return this.calendarRepo.syncCalendar(userID, source, startDate, endDate);
  }
}