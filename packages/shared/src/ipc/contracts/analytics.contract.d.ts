import { z } from 'zod';
export declare const GenerateReportRequestSchema: z.ZodObject<{
    type: z.ZodEnum<["daily", "weekly", "monthly", "custom"]>;
    startDate: z.ZodString;
    endDate: z.ZodString;
    format: z.ZodDefault<z.ZodEnum<["json", "pdf", "csv"]>>;
}, "strip", z.ZodTypeAny, {
    type: "custom" | "daily" | "weekly" | "monthly";
    startDate: string;
    endDate: string;
    format: "json" | "pdf" | "csv";
}, {
    type: "custom" | "daily" | "weekly" | "monthly";
    startDate: string;
    endDate: string;
    format?: "json" | "pdf" | "csv" | undefined;
}>;
export declare const GenerateReportResponseSchema: z.ZodObject<{
    reportUrl: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    data?: any;
    reportUrl?: string | undefined;
}, {
    data?: any;
    reportUrl?: string | undefined;
}>;
export declare const GetProductivityScoreRequestSchema: z.ZodObject<{
    date: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date?: string | undefined;
}, {
    date?: string | undefined;
}>;
export declare const GetProductivityScoreResponseSchema: z.ZodObject<{
    score: z.ZodNumber;
    tasksCompleted: z.ZodNumber;
    tasksPending: z.ZodNumber;
    meetingsAttended: z.ZodNumber;
    focusHours: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    tasksCompleted: number;
    tasksPending: number;
    meetingsAttended: number;
    focusHours: number;
    score: number;
}, {
    tasksCompleted: number;
    tasksPending: number;
    meetingsAttended: number;
    focusHours: number;
    score: number;
}>;
export type GenerateReportRequest = z.infer<typeof GenerateReportRequestSchema>;
export type GenerateReportResponse = z.infer<typeof GenerateReportResponseSchema>;
export type GetProductivityScoreRequest = z.infer<typeof GetProductivityScoreRequestSchema>;
export type GetProductivityScoreResponse = z.infer<typeof GetProductivityScoreResponseSchema>;
//# sourceMappingURL=analytics.contract.d.ts.map