import { AnalyticsData as AnalyticsDataDTO } from '@sphere/shared';
export declare class AnalyticsData {
    tasksCompleted: number;
    tasksPending: number;
    tasksOverdue: number;
    completionRate: number;
    totalFocusHours: number;
    meetingsAttended: number;
    meetingsScheduled: number;
    appointmentsBooked: number;
    productivityScore: number;
    categoryBreakdown: Record<string, number>;
    dailyActivity: {
        date: string;
        tasksCompleted: number;
        focusHours: number;
        meetings: number;
    }[];
    constructor(tasksCompleted: number, tasksPending: number, tasksOverdue: number, completionRate: number, // 0-100
    totalFocusHours: number, meetingsAttended: number, meetingsScheduled: number, appointmentsBooked: number, productivityScore: number, // 0-100
    categoryBreakdown: Record<string, number>, dailyActivity: {
        date: string;
        tasksCompleted: number;
        focusHours: number;
        meetings: number;
    }[]);
    /**
     * Factory method to create AnalyticsData from a DTO.
     */
    static fromDTO(dto: AnalyticsDataDTO): AnalyticsData;
    /**
     * Converts this AnalyticsData to a DTO.
     */
    toDTO(): AnalyticsDataDTO;
    /**
     * Returns the overall productivity score as a grade (A-F).
     */
    getGrade(): string;
    /**
     * Returns the most productive category.
     */
    getMostProductiveCategory(): string;
    /**
     * Returns the current streak (consecutive days with tasks completed).
     */
    getStreak(): number;
}
//# sourceMappingURL=AnalyticsData.d.ts.map