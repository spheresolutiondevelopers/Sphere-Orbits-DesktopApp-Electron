import { z } from 'zod';

export const GenerateReportRequestSchema = z.object({
  type: z.enum(['daily', 'weekly', 'monthly', 'custom']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  format: z.enum(['json', 'pdf', 'csv']).default('json'),
});

export const GenerateReportResponseSchema = z.object({
  reportUrl: z.string().url().optional(),  // if generated PDF/CSV
  data: z.any().optional(),               // for JSON reports
});

export const GetProductivityScoreRequestSchema = z.object({
  date: z.string().datetime().optional(), // default today
});

export const GetProductivityScoreResponseSchema = z.object({
  score: z.number().min(0).max(100),
  tasksCompleted: z.number().int(),
  tasksPending: z.number().int(),
  meetingsAttended: z.number().int(),
  focusHours: z.number(),
});

export type GenerateReportRequest = z.infer<typeof GenerateReportRequestSchema>;
export type GenerateReportResponse = z.infer<typeof GenerateReportResponseSchema>;
export type GetProductivityScoreRequest = z.infer<typeof GetProductivityScoreRequestSchema>;
export type GetProductivityScoreResponse = z.infer<typeof GetProductivityScoreResponseSchema>;