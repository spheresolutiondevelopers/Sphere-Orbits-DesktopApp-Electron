export interface AnalyticsData {
  tasksCompleted: number;
  tasksPending: number;
  tasksOverdue: number;
  completionRate: number; // 0-100
  totalFocusHours: number;
  meetingsAttended: number;
  meetingsScheduled: number;
  appointmentsBooked: number;
  productivityScore: number; // 0-100
  categoryBreakdown: Record<string, number>;
  dailyActivity: {
    date: string; // YYYY-MM-DD
    tasksCompleted: number;
    focusHours: number;
    meetings: number;
  }[];
}