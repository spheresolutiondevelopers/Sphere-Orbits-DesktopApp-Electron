import { Result } from '@sphere/shared';
import { ICalendarRepository } from '../repositories/ICalendarRepository';
import { CalendarEvent } from '../entities/CalendarEvent';

export class GetEventsUseCase {
  constructor(private readonly calendarRepo: ICalendarRepository) {}

  async execute(
    userID: string,
    source: 'google' | 'outlook' | 'apple',
    startDate: string,
    endDate: string
  ): Promise<Result<CalendarEvent[], Error>> {
    if (!userID) {
      return Result.err(new Error('userID is required'));
    }
    if (!startDate || !endDate) {
      return Result.err(new Error('startDate and endDate are required'));
    }
    if (new Date(startDate) > new Date(endDate)) {
      return Result.err(new Error('startDate must be before endDate'));
    }

    // Try to get from local cache first, then from remote.
    // We'll implement a simple strategy: fetch remote and merge with local.
    // The repository handles the details.
    return this.calendarRepo.getEvents(source, startDate, endDate);
  }
}