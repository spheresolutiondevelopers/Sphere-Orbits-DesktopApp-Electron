import { type Result } from '@sphere/shared';
import { ICalendarRepository } from '../repositories/ICalendarRepository';
export declare class SyncCalendarUseCase {
    private readonly calendarRepo;
    constructor(calendarRepo: ICalendarRepository);
    execute(userID: string, source: 'google' | 'outlook' | 'apple', startDate: string, endDate: string): Promise<Result<{
        syncedCount: number;
        errors: string[];
    }, Error>>;
}
//# sourceMappingURL=SyncCalendarUseCase.d.ts.map