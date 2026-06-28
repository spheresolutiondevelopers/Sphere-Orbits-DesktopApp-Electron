import { Result } from '@sphere/shared';
import { AnalyticsData } from '../entities/AnalyticsData';

export interface ReportOptions {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate: string;
  endDate: string;
}

export interface ReportResult {
  reportUrl?: string; // If generated as PDF/CSV
  data?: AnalyticsData; // For JSON reports
}

export interface IAnalyticsRepository {
  /**
   * Generates a productivity report for the given date range.
   */
  generateReport(
    userID: string,
    options: ReportOptions
  ): Promise<Result<ReportResult, Error>>;

  /**
   * Calculates the productivity score for a given date.
   * If no date is provided, uses today.
   */
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
    bestTimeOfDay: string; // HH:mm:ss
    weeklyTrend: number[];
  }, Error>>;

  /**
   * Gets raw analytics data for a date range.
   */
  getAnalyticsData(
    userID: string,
    startDate: string,
    endDate: string
  ): Promise<Result<AnalyticsData, Error>>;
}