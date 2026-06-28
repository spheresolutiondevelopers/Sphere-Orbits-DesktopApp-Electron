import { Result } from '@sphere/shared';
import { IAnalyticsRepository, ReportOptions, ReportResult } from '../repositories/IAnalyticsRepository';

export class GenerateReportUseCase {
  constructor(private readonly analyticsRepo: IAnalyticsRepository) {}

  async execute(
    userID: string,
    options: ReportOptions
  ): Promise<Result<ReportResult, Error>> {
    if (!userID) {
      return Result.err(new Error('userID is required'));
    }
    if (!options.startDate || !options.endDate) {
      return Result.err(new Error('startDate and endDate are required'));
    }
    const start = new Date(options.startDate);
    const end = new Date(options.endDate);
    if (start > end) {
      return Result.err(new Error('startDate must be before endDate'));
    }
    if (options.type === 'custom' && !options.startDate && !options.endDate) {
      return Result.err(new Error('Custom report requires startDate and endDate'));
    }

    return this.analyticsRepo.generateReport(userID, options);
  }
}