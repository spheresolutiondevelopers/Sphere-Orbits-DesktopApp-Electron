"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsDataSchema = exports.ProductivityScoreSchema = exports.ProductivityReportSchema = void 0;
const zod_1 = require("zod");
exports.ProductivityReportSchema = zod_1.z.object({
    reportID: zod_1.z.string().uuid(),
    userID: zod_1.z.string().uuid(),
    reportType: zod_1.z.enum(['daily', 'weekly', 'monthly', 'custom']),
    startDate: zod_1.z.string().datetime({ offset: true }),
    endDate: zod_1.z.string().datetime({ offset: true }),
    generatedAt: zod_1.z.string().datetime({ offset: true }),
    format: zod_1.z.enum(['json', 'pdf', 'csv']).default('json'),
    data: zod_1.z.object({
        tasksCompleted: zod_1.z.number().int(),
        tasksPending: zod_1.z.number().int(),
        tasksOverdue: zod_1.z.number().int(),
        completionRate: zod_1.z.number().min(0).max(100),
        totalFocusHours: zod_1.z.number(),
        meetingsAttended: zod_1.z.number().int(),
        meetingsScheduled: zod_1.z.number().int(),
        appointmentsBooked: zod_1.z.number().int(),
        productivityScore: zod_1.z.number().min(0).max(100),
        categoryBreakdown: zod_1.z.record(zod_1.z.string(), zod_1.z.number()),
        dailyActivity: zod_1.z.array(zod_1.z.object({
            date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            tasksCompleted: zod_1.z.number().int(),
            focusHours: zod_1.z.number(),
            meetings: zod_1.z.number().int(),
        })),
    }),
    fileUrl: zod_1.z.string().url().optional().nullable(),
    isDeleted: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.string().datetime({ offset: true }),
    updatedAt: zod_1.z.string().datetime({ offset: true }),
});
exports.ProductivityScoreSchema = zod_1.z.object({
    score: zod_1.z.number().min(0).max(100),
    tasksCompleted: zod_1.z.number().int(),
    tasksPending: zod_1.z.number().int(),
    meetingsAttended: zod_1.z.number().int(),
    focusHours: zod_1.z.number(),
    streakDays: zod_1.z.number().int(),
    bestTimeOfDay: zod_1.z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
    weeklyTrend: zod_1.z.array(zod_1.z.number()),
});
// 👇 Add this new schema
exports.AnalyticsDataSchema = zod_1.z.object({
    tasksCompleted: zod_1.z.number().int(),
    tasksPending: zod_1.z.number().int(),
    tasksOverdue: zod_1.z.number().int(),
    completionRate: zod_1.z.number().min(0).max(100),
    totalFocusHours: zod_1.z.number(),
    meetingsAttended: zod_1.z.number().int(),
    meetingsScheduled: zod_1.z.number().int(),
    appointmentsBooked: zod_1.z.number().int(),
    productivityScore: zod_1.z.number().min(0).max(100),
    categoryBreakdown: zod_1.z.record(zod_1.z.string(), zod_1.z.number()),
    dailyActivity: zod_1.z.array(zod_1.z.object({
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        tasksCompleted: zod_1.z.number().int(),
        focusHours: zod_1.z.number(),
        meetings: zod_1.z.number().int(),
    })),
});
//# sourceMappingURL=analytics.schema.js.map