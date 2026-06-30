import { ok, err, type Result } from '@sphere/shared';
import { AnalyticsData, IAnalyticsRepository, ReportOptions, ReportResult } from '@sphere/domain';
import { DatabaseClient } from '../database/DatabaseClient';
import { ReportGenerator } from './ReportGenerator';

export class AnalyticsRepository implements IAnalyticsRepository {
  private reportGenerator: ReportGenerator;

  constructor(db: DatabaseClient) {
    this.reportGenerator = new ReportGenerator(db);
  }

  async generateReport(
    userID: string,
    options: ReportOptions
  ): Promise<Result<ReportResult, Error>> {
    try {
      // Validate options
      const start = new Date(options.startDate);
      const end = new Date(options.endDate);
      if (start > end) {
        return err(new Error('startDate must be before endDate'));
      }

      // Get raw analytics data
      const dataResult = await this.getAnalyticsData(userID, options.startDate, options.endDate);
      if (dataResult.isFailure()) {
        return err(dataResult.error);
      }

      const analyticsData = dataResult.value;

      // Generate report based on format (default to 'json' if not specified)
      const format = options.format || 'json';
      if (format === 'json') {
        return ok({ data: analyticsData });
      }

      // For PDF or CSV, generate file
      const reportUrl = await this.reportGenerator.generate(
        userID,
        analyticsData,
        format as 'pdf' | 'csv',
        options.type
      );

      return ok({ reportUrl });
    } catch (error: any) {
      return err(error);
    }
  }

  async getProductivityScore(
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
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      const startDate = new Date(targetDate);
      startDate.setDate(startDate.getDate() - 7); // Last 7 days for trend

      // Get analytics data for the week
      const dataResult = await this.getAnalyticsData(
        userID,
        startDate.toISOString(),
        new Date(targetDate).toISOString()
      );
      if (dataResult.isFailure()) {
        return err(dataResult.error);
      }

      const data = dataResult.value;

      // Calculate score
      const score = this.calculateScore(data);

      // Get streak
      const streakDays = this.calculateStreak(data.dailyActivity);

      // Get best time of day (mock implementation)
      const bestTimeOfDay = '09:00:00';

      // Get weekly trend (last 7 days productivity scores)
      const weeklyTrend = data.dailyActivity
        .slice(-7)
        .map((day: any) => this.calculateDayScore(day));

      return ok({
        score,
        tasksCompleted: data.tasksCompleted,
        tasksPending: data.tasksPending,
        meetingsAttended: data.meetingsAttended,
        focusHours: data.totalFocusHours,
        streakDays,
        bestTimeOfDay,
        weeklyTrend,
      });
    } catch (error: any) {
      return err(error);
    }
  }

  async getAnalyticsData(
    userID: string,
    startDate: string,
    endDate: string
  ): Promise<Result<AnalyticsData, Error>> {
    try {
      const data = await this.reportGenerator.getRawData(userID, startDate, endDate);
      return ok(data);
    } catch (error: any) {
      return err(error);
    }
  }

  private calculateScore(data: AnalyticsData): number {
    // Weighted score based on completion rate, tasks, meetings, focus hours
    const completionWeight = 0.4;
    const tasksWeight = 0.3;
    const meetingsWeight = 0.15;
    const focusWeight = 0.15;

    const completionScore = data.completionRate;
    const tasksScore = Math.min(100, (data.tasksCompleted / (data.tasksCompleted + data.tasksPending)) * 100);
    const meetingsScore = Math.min(100, (data.meetingsAttended / (data.meetingsScheduled || 1)) * 100);
    const focusScore = Math.min(100, (data.totalFocusHours / 8) * 100);

    return Math.round(
      completionScore * completionWeight +
      tasksScore * tasksWeight +
      meetingsScore * meetingsWeight +
      focusScore * focusWeight
    );
  }

  private calculateStreak(
    dailyActivity: { date: string; tasksCompleted: number; focusHours: number; meetings: number }[]
  ): number {
    let streak = 0;
    const sorted = [...dailyActivity].sort((a, b) => a.date.localeCompare(b.date));
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i].tasksCompleted > 0 || sorted[i].focusHours > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  private calculateDayScore(day: {
    date: string;
    tasksCompleted: number;
    focusHours: number;
    meetings: number;
  }): number {
    const tasksScore = Math.min(100, day.tasksCompleted * 20);
    const focusScore = Math.min(100, day.focusHours * 12.5);
    const meetingsScore = Math.min(100, day.meetings * 25);
    return Math.round((tasksScore + focusScore + meetingsScore) / 3);
  }
}