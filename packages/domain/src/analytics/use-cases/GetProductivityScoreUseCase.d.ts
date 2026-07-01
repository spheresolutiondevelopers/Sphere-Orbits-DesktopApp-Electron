import { type Result } from '@sphere/shared';
import { IAnalyticsRepository } from '../repositories/IAnalyticsRepository';
export declare class GetProductivityScoreUseCase {
    private readonly analyticsRepo;
    constructor(analyticsRepo: IAnalyticsRepository);
    execute(userID: string, date?: string): Promise<Result<{
        score: number;
        tasksCompleted: number;
        tasksPending: number;
        meetingsAttended: number;
        focusHours: number;
        streakDays: number;
        bestTimeOfDay: string;
        weeklyTrend: number[];
    }, Error>>;
}
//# sourceMappingURL=GetProductivityScoreUseCase.d.ts.map