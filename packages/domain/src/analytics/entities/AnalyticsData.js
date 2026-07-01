"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsData = void 0;
class AnalyticsData {
    constructor(tasksCompleted, tasksPending, tasksOverdue, completionRate, // 0-100
    totalFocusHours, meetingsAttended, meetingsScheduled, appointmentsBooked, productivityScore, // 0-100
    categoryBreakdown, dailyActivity) {
        this.tasksCompleted = tasksCompleted;
        this.tasksPending = tasksPending;
        this.tasksOverdue = tasksOverdue;
        this.completionRate = completionRate;
        this.totalFocusHours = totalFocusHours;
        this.meetingsAttended = meetingsAttended;
        this.meetingsScheduled = meetingsScheduled;
        this.appointmentsBooked = appointmentsBooked;
        this.productivityScore = productivityScore;
        this.categoryBreakdown = categoryBreakdown;
        this.dailyActivity = dailyActivity;
    }
    /**
     * Factory method to create AnalyticsData from a DTO.
     */
    static fromDTO(dto) {
        return new AnalyticsData(dto.tasksCompleted, dto.tasksPending, dto.tasksOverdue, dto.completionRate, dto.totalFocusHours, dto.meetingsAttended, dto.meetingsScheduled, dto.appointmentsBooked, dto.productivityScore, dto.categoryBreakdown, dto.dailyActivity);
    }
    /**
     * Converts this AnalyticsData to a DTO.
     */
    toDTO() {
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
    getGrade() {
        const score = this.productivityScore;
        if (score >= 90)
            return 'A';
        if (score >= 80)
            return 'B';
        if (score >= 70)
            return 'C';
        if (score >= 60)
            return 'D';
        return 'F';
    }
    /**
     * Returns the most productive category.
     */
    getMostProductiveCategory() {
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
    getStreak() {
        let streak = 0;
        const sorted = [...this.dailyActivity].sort((a, b) => a.date.localeCompare(b.date));
        for (let i = sorted.length - 1; i >= 0; i--) {
            if (sorted[i].tasksCompleted > 0) {
                streak++;
            }
            else {
                break;
            }
        }
        return streak;
    }
}
exports.AnalyticsData = AnalyticsData;
//# sourceMappingURL=AnalyticsData.js.map