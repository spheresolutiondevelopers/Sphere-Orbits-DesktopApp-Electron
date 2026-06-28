import { DatabaseClient } from '../database/DatabaseClient';
import { AnalyticsData } from '@sphere/domain';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class ReportGenerator {
  constructor(private readonly db: DatabaseClient) {}

  /**
   * Generates a report file (PDF or CSV) and returns the file URL.
   */
  async generate(
    userID: string,
    data: AnalyticsData,
    format: 'pdf' | 'csv',
    reportType: string
  ): Promise<string> {
    const reportDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const filename = `report-${userID}-${Date.now()}.${format === 'pdf' ? 'pdf' : 'csv'}`;
    const filePath = path.join(reportDir, filename);

    if (format === 'csv') {
      await this.generateCSV(filePath, data);
    } else {
      await this.generatePDF(filePath, data, reportType);
    }

    // Store report metadata in database
    const stmt = this.db.prepare(`
      INSERT INTO reports (
        id, user_id, type, start_date, end_date, format, file_url, generated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const reportID = uuidv4();
    const now = new Date().toISOString();

    stmt.run(
      reportID,
      userID,
      reportType,
      data.dailyActivity[0]?.date || '',
      data.dailyActivity[data.dailyActivity.length - 1]?.date || '',
      format,
      `/reports/${filename}`,
      now
    );

    return `/reports/${filename}`;
  }

  /**
   * Gets raw analytics data from the database.
   */
  async getRawData(userID: string, startDate: string, endDate: string): Promise<AnalyticsData> {
    const db = this.db.getDB();

    // Get tasks completed and pending
    const taskStats = db
      .prepare(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'pending' OR status = 'in_progress' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN due_date < date('now') AND status != 'completed' THEN 1 ELSE 0 END) as overdue,
          AVG(completion_percentage) as avg_completion
        FROM tasks
        WHERE user_id = ?
          AND created_at >= ?
          AND created_at <= ?
          AND is_deleted = 0
      `)
      .get(userID, startDate, endDate) as any;

    // Get meetings attended and scheduled
    const meetingStats = db
      .prepare(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'ended' OR status = 'completed' THEN 1 ELSE 0 END) as attended
        FROM meetings
        JOIN tasks ON tasks.id = meetings.task_id
        WHERE tasks.user_id = ?
          AND meetings.start_datetime >= ?
          AND meetings.start_datetime <= ?
          AND meetings.is_deleted = 0
      `)
      .get(userID, startDate, endDate) as any;

    // Get appointments booked
    const appointmentStats = db
      .prepare(`
        SELECT COUNT(*) as total
        FROM appointments
        WHERE user_id = ?
          AND start_datetime >= ?
          AND start_datetime <= ?
          AND status != 'cancelled'
          AND is_deleted = 0
      `)
      .get(userID, startDate, endDate) as any;

    // Get daily activity
    const dailyActivity = db
      .prepare(`
        SELECT
          date(created_at) as date,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as tasks_completed,
          SUM(time_spent_minutes) / 60.0 as focus_hours,
          (SELECT COUNT(*)
           FROM meetings m
           JOIN tasks t ON t.id = m.task_id
           WHERE t.user_id = ?
             AND date(m.start_datetime) = date(created_at)
             AND m.is_deleted = 0) as meetings
        FROM tasks
        WHERE user_id = ?
          AND created_at >= ?
          AND created_at <= ?
          AND is_deleted = 0
        GROUP BY date(created_at)
        ORDER BY date(created_at) ASC
      `)
      .all(userID, userID, startDate, endDate) as any[];

    // Get category breakdown
    const categoryBreakdown: Record<string, number> = {};
    const categoryStats = db
      .prepare(`
        SELECT
          COALESCE(category_id, 'uncategorized') as category,
          COUNT(*) as count
        FROM tasks
        WHERE user_id = ?
          AND created_at >= ?
          AND created_at <= ?
          AND status = 'completed'
          AND is_deleted = 0
        GROUP BY category_id
      `)
      .all(userID, startDate, endDate) as any[];

    for (const row of categoryStats) {
      categoryBreakdown[row.category] = row.count;
    }

    const totalTasks = taskStats?.total || 0;
    const completedTasks = taskStats?.completed || 0;
    const pendingTasks = taskStats?.pending || 0;
    const overdueTasks = taskStats?.overdue || 0;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const totalFocusHours = dailyActivity.reduce((sum, day) => sum + (day.focus_hours || 0), 0);
    const meetingsAttended = meetingStats?.attended || 0;
    const meetingsScheduled = meetingStats?.total || 0;
    const appointmentsBooked = appointmentStats?.total || 0;

    // Calculate productivity score
    const score = this.calculateScore(completionRate, totalTasks, pendingTasks, meetingsAttended, meetingsScheduled, totalFocusHours);

    // Format daily activity
    const formattedDaily = dailyActivity.map((day: any) => ({
      date: day.date,
      tasksCompleted: day.tasks_completed || 0,
      focusHours: day.focus_hours || 0,
      meetings: day.meetings || 0,
    }));

    return new AnalyticsData(
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionRate,
      totalFocusHours,
      meetingsAttended,
      meetingsScheduled,
      appointmentsBooked,
      score,
      categoryBreakdown,
      formattedDaily
    );
  }

  private calculateScore(
    completionRate: number,
    totalTasks: number,
    pendingTasks: number,
    meetingsAttended: number,
    meetingsScheduled: number,
    focusHours: number
  ): number {
    const completionWeight = 0.4;
    const tasksWeight = 0.3;
    const meetingsWeight = 0.15;
    const focusWeight = 0.15;

    const completionScore = completionRate;
    const tasksScore = totalTasks > 0 ? (totalTasks / (totalTasks + pendingTasks)) * 100 : 0;
    const meetingsScore = meetingsScheduled > 0 ? (meetingsAttended / meetingsScheduled) * 100 : 0;
    const focusScore = Math.min(100, (focusHours / 8) * 100);

    return Math.round(
      completionScore * completionWeight +
      tasksScore * tasksWeight +
      meetingsScore * meetingsWeight +
      focusScore * focusWeight
    );
  }

  private async generateCSV(filePath: string, data: AnalyticsData): Promise<void> {
    const rows = [
      ['Metric', 'Value'],
      ['Tasks Completed', data.tasksCompleted],
      ['Tasks Pending', data.tasksPending],
      ['Tasks Overdue', data.tasksOverdue],
      ['Completion Rate (%)', data.completionRate.toFixed(2)],
      ['Total Focus Hours', data.totalFocusHours.toFixed(2)],
      ['Meetings Attended', data.meetingsAttended],
      ['Meetings Scheduled', data.meetingsScheduled],
      ['Appointments Booked', data.appointmentsBooked],
      ['Productivity Score', data.productivityScore],
      [],
      ['Category', 'Count'],
    ];

    for (const [category, count] of Object.entries(data.categoryBreakdown)) {
      rows.push([category, count]);
    }

    rows.push([]);
    rows.push(['Date', 'Tasks Completed', 'Focus Hours', 'Meetings']);
    for (const day of data.dailyActivity) {
      rows.push([day.date, day.tasksCompleted, day.focusHours.toFixed(2), day.meetings]);
    }

    const csvContent = rows.map((row) => row.join(',')).join('\n');
    fs.writeFileSync(filePath, csvContent);
  }

  private async generatePDF(filePath: string, data: AnalyticsData, reportType: string): Promise<void> {
    // In a real implementation, we'd use a PDF library like pdfkit or puppeteer.
    // This is a placeholder implementation that creates a simple text file.
    // For production, consider using 'pdfkit' or 'jsPDF'.
    const content = [
      `Sphere Schedule - ${reportType} Report`,
      '='.repeat(50),
      '',
      `Generated: ${new Date().toISOString()}`,
      '',
      'Summary:',
      `  Tasks Completed: ${data.tasksCompleted}`,
      `  Tasks Pending: ${data.tasksPending}`,
      `  Tasks Overdue: ${data.tasksOverdue}`,
      `  Completion Rate: ${data.completionRate.toFixed(2)}%`,
      `  Total Focus Hours: ${data.totalFocusHours.toFixed(2)}`,
      `  Meetings Attended: ${data.meetingsAttended}`,
      `  Meetings Scheduled: ${data.meetingsScheduled}`,
      `  Appointments Booked: ${data.appointmentsBooked}`,
      `  Productivity Score: ${data.productivityScore}`,
      '',
      'Category Breakdown:',
    ];

    for (const [category, count] of Object.entries(data.categoryBreakdown)) {
      content.push(`  ${category}: ${count}`);
    }

    content.push('');
    content.push('Daily Activity:');
    content.push('  Date       | Tasks | Focus Hours | Meetings');
    content.push('  -----------+-------+-------------+--------');
    for (const day of data.dailyActivity) {
      content.push(
        `  ${day.date} | ${String(day.tasksCompleted).padEnd(5)} | ${day.focusHours.toFixed(2).padEnd(11)} | ${day.meetings}`
      );
    }

    fs.writeFileSync(filePath, content.join('\n'));
    // In production, you'd write a PDF file here.
    // For now, we'll just create a text file with the same name.
    // The calling code expects a file at this path.
  }
}