"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductivityScoreResponseSchema = exports.GetProductivityScoreRequestSchema = exports.GenerateReportResponseSchema = exports.GenerateReportRequestSchema = void 0;
const zod_1 = require("zod");
exports.GenerateReportRequestSchema = zod_1.z.object({
    type: zod_1.z.enum(['daily', 'weekly', 'monthly', 'custom']),
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime(),
    format: zod_1.z.enum(['json', 'pdf', 'csv']).default('json'),
});
exports.GenerateReportResponseSchema = zod_1.z.object({
    reportUrl: zod_1.z.string().url().optional(), // if generated PDF/CSV
    data: zod_1.z.any().optional(), // for JSON reports
});
exports.GetProductivityScoreRequestSchema = zod_1.z.object({
    date: zod_1.z.string().datetime().optional(), // default today
});
exports.GetProductivityScoreResponseSchema = zod_1.z.object({
    score: zod_1.z.number().min(0).max(100),
    tasksCompleted: zod_1.z.number().int(),
    tasksPending: zod_1.z.number().int(),
    meetingsAttended: zod_1.z.number().int(),
    focusHours: zod_1.z.number(),
});
//# sourceMappingURL=analytics.contract.js.map