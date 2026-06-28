import { AnalyticsData as AnalyticsDataDTO } from '@sphere/shared';

export class AnalyticsData {
  constructor(
    public tasksCompleted: number,
    public tasksPending: number,
    public tasksOverdue: number,
    public completionRate: number, // 0-100
    public totalFocusHours: number,
    public meetingsAttended: number,
    public meetingsScheduled: number,
    public appointmentsBooked: number,
    public productivityScore: number, // 0-100
    public categoryBreakdown: Record<string, number>,
    public dailyActivity: {
      date: string; // YYYY-MM-DD
      tasksCompleted: number;
      focusHours: number;
      meetings: number;
    }[]
  ) {}

  /**
   * Factory method to create AnalyticsData from a DTO.
   */
  static fromDTO(dto: AnalyticsDataDTO): AnalyticsData {
    return new AnalyticsData(
      dto.tasksCompleted,
      dto.tasksPending,
      dto.tasksOverdue,
      dto.completionRate,
      dto.totalFocusHours,
      dto.meetingsAttended,
      dto.meetingsScheduled,
      dto.appointmentsBooked,
      dto.productivityScore,
      dto.categoryBreakdown,
      dto.dailyActivity
    );
  }

  /**
   * Converts this AnalyticsData to a DTO.
   */
  toDTO(): AnalyticsDataDTO {
    return {
      tasksCompleted: this.tasksCompleted,
      tasksPending: this.tasksPending,
      tasksOverdue: this.tasksOverdue,
      completionRate: this.completionRate,
      totalFocusHours: this.totalFocusHours,
      meetingsAttended: this.meetingsAttended,
      meetingsScheduled: this.meetingsScheduled,
      appointmentsBooked: this.appointmentsBooked,
      productivityScore: this.productivityScore,
      categoryBreakdown: this.categoryBreakdown,
      dailyActivity: this.dailyActivity,
    };
  }

  /**
   * Returns the overall productivity score as a grade (A-F).
   */
  getGrade(): string {
    const score = this.productivityScore;
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Returns the most productive category.
   */
  getMostProductiveCategory(): string {
    let max = 0;
    let category = 'None';
    for (const [key, value] of Object.entries(this.categoryBreakdown)) {
      if (value > max) {
        max = value;
        category = key;
      }
    }
    return category;
  }

  /**
   * Returns the current streak (consecutive days with tasks completed).
   */
  getStreak(): number {
    let streak = 0;
    const sorted = [...this.dailyActivity].sort((a, b) => a.date.localeCompare(b.date));
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i].tasksCompleted > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }
}