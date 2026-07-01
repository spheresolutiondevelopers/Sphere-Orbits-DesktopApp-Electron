import { z } from 'zod';
export declare const ProductivityReportSchema: z.ZodObject<{
    reportID: z.ZodString;
    userID: z.ZodString;
    reportType: z.ZodEnum<["daily", "weekly", "monthly", "custom"]>;
    startDate: z.ZodString;
    endDate: z.ZodString;
    generatedAt: z.ZodString;
    format: z.ZodDefault<z.ZodEnum<["json", "pdf", "csv"]>>;
    data: z.ZodObject<{
        tasksCompleted: z.ZodNumber;
        tasksPending: z.ZodNumber;
        tasksOverdue: z.ZodNumber;
        completionRate: z.ZodNumber;
        totalFocusHours: z.ZodNumber;
        meetingsAttended: z.ZodNumber;
        meetingsScheduled: z.ZodNumber;
        appointmentsBooked: z.ZodNumber;
        productivityScore: z.ZodNumber;
        categoryBreakdown: z.ZodRecord<z.ZodString, z.ZodNumber>;
        dailyActivity: z.ZodArray<z.ZodObject<{
            date: z.ZodString;
            tasksCompleted: z.ZodNumber;
            focusHours: z.ZodNumber;
            meetings: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            date: string;
            tasksCompleted: number;
            focusHours: number;
            meetings: number;
        }, {
            date: string;
            tasksCompleted: number;
            focusHours: number;
            meetings: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
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
    }, {
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
    }>;
    fileUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isDeleted: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userID: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    startDate: string;
    endDate: string;
    format: "json" | "pdf" | "csv";
    reportID: string;
    reportType: "custom" | "daily" | "weekly" | "monthly";
    generatedAt: string;
    data: {
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
    };
    fileUrl?: string | null | undefined;
}, {
    userID: string;
    createdAt: string;
    updatedAt: string;
    startDate: string;
    endDate: string;
    reportID: string;
    reportType: "custom" | "daily" | "weekly" | "monthly";
    generatedAt: string;
    data: {
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
    };
    isDeleted?: boolean | undefined;
    format?: "json" | "pdf" | "csv" | undefined;
    fileUrl?: string | null | undefined;
}>;
export declare const ProductivityScoreSchema: z.ZodObject<{
    score: z.ZodNumber;
    tasksCompleted: z.ZodNumber;
    tasksPending: z.ZodNumber;
    meetingsAttended: z.ZodNumber;
    focusHours: z.ZodNumber;
    streakDays: z.ZodNumber;
    bestTimeOfDay: z.ZodString;
    weeklyTrend: z.ZodArray<z.ZodNumber, "many">;
}, "strip", z.ZodTypeAny, {
    tasksCompleted: number;
    tasksPending: number;
    meetingsAttended: number;
    focusHours: number;
    score: number;
    streakDays: number;
    bestTimeOfDay: string;
    weeklyTrend: number[];
}, {
    tasksCompleted: number;
    tasksPending: number;
    meetingsAttended: number;
    focusHours: number;
    score: number;
    streakDays: number;
    bestTimeOfDay: string;
    weeklyTrend: number[];
}>;
export declare const AnalyticsDataSchema: z.ZodObject<{
    tasksCompleted: z.ZodNumber;
    tasksPending: z.ZodNumber;
    tasksOverdue: z.ZodNumber;
    completionRate: z.ZodNumber;
    totalFocusHours: z.ZodNumber;
    meetingsAttended: z.ZodNumber;
    meetingsScheduled: z.ZodNumber;
    appointmentsBooked: z.ZodNumber;
    productivityScore: z.ZodNumber;
    categoryBreakdown: z.ZodRecord<z.ZodString, z.ZodNumber>;
    dailyActivity: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        tasksCompleted: z.ZodNumber;
        focusHours: z.ZodNumber;
        meetings: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        date: string;
        tasksCompleted: number;
        focusHours: number;
        meetings: number;
    }, {
        date: string;
        tasksCompleted: number;
        focusHours: number;
        meetings: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
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
}, {
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
}>;
export type ProductivityReport = z.infer<typeof ProductivityReportSchema>;
export type ProductivityScore = z.infer<typeof ProductivityScoreSchema>;
export type AnalyticsData = z.infer<typeof AnalyticsDataSchema>;
//# sourceMappingURL=analytics.schema.d.ts.map