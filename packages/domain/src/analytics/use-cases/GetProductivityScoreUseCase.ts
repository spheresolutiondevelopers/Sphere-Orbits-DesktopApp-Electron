import { err, type Result } from '@sphere/shared';
import { IAnalyticsRepository } from '../repositories/IAnalyticsRepository';

export class GetProductivityScoreUseCase {
  constructor(private readonly analyticsRepo: IAnalyticsRepository) {}

  async execute(
    userID: string,
    date?: string
  ): Promise<Result<{
    score: number;
    tasksCompleted: number;
    tasksPending: number;
    meetingsAttended: number;
    focusHours: number;
    streakDays: number;
    bestTimeOfDay: string;
    weeklyTrend: number[];
  }, Error>> {
    if (!userID) {
      return err(new Error('userID is required'));
    }
    return this.analyticsRepo.getProductivityScore(userID, date);
  }
}