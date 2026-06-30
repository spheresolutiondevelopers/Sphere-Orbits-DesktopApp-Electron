import { Result } from '@sphere/shared';
import { AnalyticsData } from '../entities/AnalyticsData';

export interface ReportOptions {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate: string;
  endDate: string;
  format?: 'json' | 'pdf' | 'csv';  // 👈 Add this line
}

export interface ReportResult {
  reportUrl?: string;
  data?: AnalyticsData;
}

export interface IAnalyticsRepository {
  generateReport(
    userID: string,
    options: ReportOptions
  ): Promise<Result<ReportResult, Error>>;

  getProductivityScore(
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
  }, Error>>;

  getAnalyticsData(
    userID: string,
    startDate: string,
    endDate: string
  ): Promise<Result<AnalyticsData, Error>>;
}