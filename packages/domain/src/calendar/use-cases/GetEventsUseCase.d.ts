import { type Result } from '@sphere/shared';
import { ICalendarRepository } from '../repositories/ICalendarRepository';
import { CalendarEvent } from '../entities/CalendarEvent';
export declare class GetEventsUseCase {
    private readonly calendarRepo;
    constructor(calendarRepo: ICalendarRepository);
    execute(userID: string, source: 'google' | 'outlook' | 'apple', startDate: string, endDate: string): Promise<Result<CalendarEvent[], Error>>;
}
//# sourceMappingURL=GetEventsUseCase.d.ts.map