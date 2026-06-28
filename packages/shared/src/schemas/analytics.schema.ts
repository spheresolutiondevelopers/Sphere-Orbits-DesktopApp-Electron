import { z } from 'zod';

export const ProductivityReportSchema = z.object({
  reportID: z.string().uuid(),
  userID: z.string().uuid(),
  reportType: z.enum(['daily', 'weekly', 'monthly', 'custom']),
  startDate: z.string().datetime({ offset: true }),
  endDate: z.string().datetime({ offset: true }),
  generatedAt: z.string().datetime({ offset: true }),
  format: z.enum(['json', 'pdf', 'csv']).default('json'),
  data: z.object({
    tasksCompleted: z.number().int(),
    tasksPending: z.number().int(),
    tasksOverdue: z.number().int(),
    completionRate: z.number().min(0).max(100),
    totalFocusHours: z.number(),
    meetingsAttended: z.number().int(),
    meetingsScheduled: z.number().int(),
    appointmentsBooked: z.number().int(),
    productivityScore: z.number().min(0).max(100),
    categoryBreakdown: z.record(z.string(), z.number()),
    dailyActivity: z.array(z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      tasksCompleted: z.number().int(),
      focusHours: z.number(),
      meetings: z.number().int(),
    })),
  }),
  fileUrl: z.string().url().optional().nullable(),
  isDeleted: z.boolean().default(false),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export const ProductivityScoreSchema = z.object({
  score: z.number().min(0).max(100),
  tasksCompleted: z.number().int(),
  tasksPending: z.number().int(),
  meetingsAttended: z.number().int(),
  focusHours: z.number(),
  streakDays: z.number().int(),
  bestTimeOfDay: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
  weeklyTrend: z.array(z.number()),
});

export type ProductivityReport = z.infer<typeof ProductivityReportSchema>;
export type ProductivityScore = z.infer<typeof ProductivityScoreSchema>;