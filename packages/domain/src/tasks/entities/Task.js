"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
class Task {
    constructor(taskID, userID, title, taskType, priorityLevel, status, completionPercentage, isRecurring, externalSyncStatus, isDeleted, createdAt, updatedAt, description, dueDate, dueTime, startDate, startTime, endDate, endTime, locationName, locationAddress, latitude, longitude, estimatedDurationMinutes, actualDurationMinutes, timeSpentMinutes = 0, recurrenceRule, parentTaskID, externalID, externalSource, tags, notes, categoryID) {
        this.taskID = taskID;
        this.userID = userID;
        this.title = title;
        this.taskType = taskType;
        this.priorityLevel = priorityLevel;
        this.status = status;
        this.completionPercentage = completionPercentage;
        this.isRecurring = isRecurring;
        this.externalSyncStatus = externalSyncStatus;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.description = description;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.startDate = startDate;
        this.startTime = startTime;
        this.endDate = endDate;
        this.endTime = endTime;
        this.locationName = locationName;
        this.locationAddress = locationAddress;
        this.latitude = latitude;
        this.longitude = longitude;
        this.estimatedDurationMinutes = estimatedDurationMinutes;
        this.actualDurationMinutes = actualDurationMinutes;
        this.timeSpentMinutes = timeSpentMinutes;
        this.recurrenceRule = recurrenceRule;
        this.parentTaskID = parentTaskID;
        this.externalID = externalID;
        this.externalSource = externalSource;
        this.tags = tags;
        this.notes = notes;
        this.categoryID = categoryID;
    }
    /**
     * Factory method to create a Task from a DTO.
     */
    static fromDTO(dto) {
        return new Task(dto.taskID, dto.userID, dto.title, dto.taskType, dto.priorityLevel, dto.status, dto.completionPercentage, dto.isRecurring, dto.externalSyncStatus, dto.isDeleted, dto.createdAt, dto.updatedAt, dto.description, dto.dueDate, dto.dueTime, dto.startDate, dto.startTime, dto.endDate, dto.endTime, dto.locationName, dto.locationAddress, dto.latitude, dto.longitude, dto.estimatedDurationMinutes, dto.actualDurationMinutes, dto.timeSpentMinutes || 0, dto.recurrenceRule, dto.parentTaskID, dto.externalID, dto.externalSource, dto.tags, dto.notes, dto.categoryID);
    }
    /**
     * Converts this Task to a DTO.
     */
    toDTO() {
        return {
            taskID: this.taskID,
            userID: this.userID,
            title: this.title,
            description: this.description,
            taskType: this.taskType,
            priorityLevel: this.priorityLevel,
            status: this.status,
            completionPercentage: this.completionPercentage,
            dueDate: this.dueDate,
            dueTime: this.dueTime,
            startDate: this.startDate,
            startTime: this.startTime,
            endDate: this.endDate,
            endTime: this.endTime,
            locationName: this.locationName,
            locationAddress: this.locationAddress,
            latitude: this.latitude,
            longitude: this.longitude,
            estimatedDurationMinutes: this.estimatedDurationMinutes,
            actualDurationMinutes: this.actualDurationMinutes,
            timeSpentMinutes: this.timeSpentMinutes,
            isRecurring: this.isRecurring,
            recurrenceRule: this.recurrenceRule,
            parentTaskID: this.parentTaskID,
            externalID: this.externalID,
            externalSource: this.externalSource,
            externalSyncStatus: this.externalSyncStatus,
            tags: this.tags,
            notes: this.notes,
            categoryID: this.categoryID,
            isDeleted: this.isDeleted,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
    /**
     * Updates the task. Only defined fields are updated.
     * @param updates - Partial update object
     */
    update(updates) {
        Object.assign(this, updates);
        this.updatedAt = new Date().toISOString();
    }
    /**
     * Marks the task as completed.
     * @param completionPercentage - 0–100, defaults to 100
     */
    complete(completionPercentage = 100) {
        this.completionPercentage = Math.min(100, Math.max(0, completionPercentage));
        if (this.completionPercentage === 100) {
            this.status = 'completed';
        }
        else {
            this.status = 'in_progress';
        }
        this.updatedAt = new Date().toISOString();
    }
    /**
     * Checks if the task is overdue.
     * @param currentDate - ISO date string to compare against (defaults to now)
     * @returns true if dueDate is in the past and task is not completed
     */
    isOverdue(currentDate = new Date().toISOString()) {
        if (this.status === 'completed' || this.status === 'cancelled') {
            return false;
        }
        if (!this.dueDate) {
            return false;
        }
        const due = new Date(this.dueDate);
        const now = new Date(currentDate);
        // If due time is set, use it; otherwise compare only the date
        if (this.dueTime) {
            const [hours, minutes, seconds] = this.dueTime.split(':').map(Number);
            due.setHours(hours || 0, minutes || 0, seconds || 0);
        }
        else {
            due.setHours(23, 59, 59, 999);
        }
        return due.getTime() < now.getTime();
    }
    /**
     * Adds time spent to the task.
     * @param minutes - Minutes to add
     */
    addTimeSpent(minutes) {
        this.timeSpentMinutes = (this.timeSpentMinutes || 0) + minutes;
        this.updatedAt = new Date().toISOString();
    }
}
exports.Task = Task;
//# sourceMappingURL=Task.js.map