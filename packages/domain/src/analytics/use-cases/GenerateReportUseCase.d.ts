import { type Result } from '@sphere/shared';
import { IAnalyticsRepository, ReportOptions, ReportResult } from '../repositories/IAnalyticsRepository';
export declare class GenerateReportUseCase {
    private readonly analyticsRepo;
    constructor(analyticsRepo: IAnalyticsRepository);
    execute(userID: string, options: ReportOptions): Promise<Result<ReportResult, Error>>;
}
//# sourceMappingURL=GenerateReportUseCase.d.ts.map