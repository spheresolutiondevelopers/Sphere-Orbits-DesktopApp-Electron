import { Task as TaskDTO } from '@sphere/shared';
export declare class Task {
    readonly taskID: string;
    userID: string;
    title: string;
    taskType: 'general' | 'meeting' | 'reminder' | 'deadline' | 'event';
    priorityLevel: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'deferred';
    completionPercentage: number;
    isRecurring: boolean;
    externalSyncStatus: 'not_synced' | 'synced' | 'failed';
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    description?: string | null | undefined;
    dueDate?: string | null | undefined;
    dueTime?: string | null | undefined;
    startDate?: string | null | undefined;
    startTime?: string | null | undefined;
    endDate?: string | null | undefined;
    endTime?: string | null | undefined;
    locationName?: string | null | undefined;
    locationAddress?: string | null | undefined;
    latitude?: number | null | undefined;
    longitude?: number | null | undefined;
    estimatedDurationMinutes?: number | null | undefined;
    actualDurationMinutes?: number | null | undefined;
    timeSpentMinutes: number;
    recurrenceRule?: string | null | undefined;
    parentTaskID?: string | null | undefined;
    externalID?: string | null | undefined;
    externalSource?: string | null | undefined;
    tags?: string | null | undefined;
    notes?: string | null | undefined;
    categoryID?: string | null | undefined;
    constructor(taskID: string, userID: string, title: string, taskType: 'general' | 'meeting' | 'reminder' | 'deadline' | 'event', priorityLevel: 'low' | 'medium' | 'high' | 'critical', status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'deferred', completionPercentage: number, isRecurring: boolean, externalSyncStatus: 'not_synced' | 'synced' | 'failed', isDeleted: boolean, createdAt: string, updatedAt: string, description?: string | null | undefined, dueDate?: string | null | undefined, dueTime?: string | null | undefined, startDate?: string | null | undefined, startTime?: string | null | undefined, endDate?: string | null | undefined, endTime?: string | null | undefined, locationName?: string | null | undefined, locationAddress?: string | null | undefined, latitude?: number | null | undefined, longitude?: number | null | undefined, estimatedDurationMinutes?: number | null | undefined, actualDurationMinutes?: number | null | undefined, timeSpentMinutes?: number, recurrenceRule?: string | null | undefined, parentTaskID?: string | null | undefined, externalID?: string | null | undefined, externalSource?: string | null | undefined, tags?: string | null | undefined, notes?: string | null | undefined, categoryID?: string | null | undefined);
    /**
     * Factory method to create a Task from a DTO.
     */
    static fromDTO(dto: TaskDTO): Task;
    /**
     * Converts this Task to a DTO.
     */
    toDTO(): TaskDTO;
    /**
     * Updates the task. Only defined fields are updated.
     * @param updates - Partial update object
     */
    update(updates: Partial<Omit<Task, 'taskID' | 'userID' | 'createdAt'>>): void;
    /**
     * Marks the task as completed.
     * @param completionPercentage - 0–100, defaults to 100
     */
    complete(completionPercentage?: number): void;
    /**
     * Checks if the task is overdue.
     * @param currentDate - ISO date string to compare against (defaults to now)
     * @returns true if dueDate is in the past and task is not completed
     */
    isOverdue(currentDate?: string): boolean;
    /**
     * Adds time spent to the task.
     * @param minutes - Minutes to add
     */
    addTimeSpent(minutes: number): void;
}
//# sourceMappingURL=Task.d.ts.map