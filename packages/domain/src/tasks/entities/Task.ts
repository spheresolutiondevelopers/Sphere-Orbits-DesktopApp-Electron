import { Task as TaskDTO } from '@sphere/shared';

export class Task {
  constructor(
    public readonly taskID: string,
    public userID: string,
    public title: string,
    public taskType: 'general' | 'meeting' | 'reminder' | 'deadline' | 'event',
    public priorityLevel: 'low' | 'medium' | 'high' | 'critical',
    public status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'deferred',
    public completionPercentage: number,
    public isRecurring: boolean,
    public externalSyncStatus: 'not_synced' | 'synced' | 'failed',
    public isDeleted: boolean,
    public createdAt: string,
    public updatedAt: string,
    public description?: string | null,
    public dueDate?: string | null,
    public dueTime?: string | null,
    public startDate?: string | null,
    public startTime?: string | null,
    public endDate?: string | null,
    public endTime?: string | null,
    public locationName?: string | null,
    public locationAddress?: string | null,
    public latitude?: number | null,
    public longitude?: number | null,
    public estimatedDurationMinutes?: number | null,
    public actualDurationMinutes?: number | null,
    public timeSpentMinutes: number = 0,
    public recurrenceRule?: string | null,
    public parentTaskID?: string | null,
    public externalID?: string | null,
    public externalSource?: string | null,
    public tags?: string | null,
    public notes?: string | null,
    public categoryID?: string | null
  ) {}

  /**
   * Factory method to create a Task from a DTO.
   */
  static fromDTO(dto: TaskDTO): Task {
    return new Task(
      dto.taskID,
      dto.userID,
      dto.title,
      dto.taskType,
      dto.priorityLevel,
      dto.status,
      dto.completionPercentage,
      dto.isRecurring,
      dto.externalSyncStatus,
      dto.isDeleted,
      dto.createdAt,
      dto.updatedAt,
      dto.description,
      dto.dueDate,
      dto.dueTime,
      dto.startDate,
      dto.startTime,
      dto.endDate,
      dto.endTime,
      dto.locationName,
      dto.locationAddress,
      dto.latitude,
      dto.longitude,
      dto.estimatedDurationMinutes,
      dto.actualDurationMinutes,
      dto.timeSpentMinutes || 0,
      dto.recurrenceRule,
      dto.parentTaskID,
      dto.externalID,
      dto.externalSource,
      dto.tags,
      dto.notes,
      dto.categoryID
    );
  }

  /**
   * Converts this Task to a DTO.
   */
  toDTO(): TaskDTO {
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
  update(updates: Partial<Omit<Task, 'taskID' | 'userID' | 'createdAt'>>): void {
    Object.assign(this, updates);
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Marks the task as completed.
   * @param completionPercentage - 0–100, defaults to 100
   */
  complete(completionPercentage: number = 100): void {
    this.completionPercentage = Math.min(100, Math.max(0, completionPercentage));
    if (this.completionPercentage === 100) {
      this.status = 'completed';
    } else {
      this.status = 'in_progress';
    }
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Checks if the task is overdue.
   * @param currentDate - ISO date string to compare against (defaults to now)
   * @returns true if dueDate is in the past and task is not completed
   */
  isOverdue(currentDate: string = new Date().toISOString()): boolean {
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
    } else {
      due.setHours(23, 59, 59, 999);
    }
    return due.getTime() < now.getTime();
  }

  /**
   * Adds time spent to the task.
   * @param minutes - Minutes to add
   */
  addTimeSpent(minutes: number): void {
    this.timeSpentMinutes = (this.timeSpentMinutes || 0) + minutes;
    this.updatedAt = new Date().toISOString();
  }
}