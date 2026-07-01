import { type Result } from '@sphere/shared';
import { ITaskRepository } from '../repositories/ITaskRepository';
import { Task } from '../entities/Task';
export interface CreateTaskInput {
    userID: string;
    title: string;
    description?: string | null;
    taskType?: 'general' | 'meeting' | 'reminder' | 'deadline' | 'event';
    priorityLevel?: 'low' | 'medium' | 'high' | 'critical';
    dueDate?: string | null;
    dueTime?: string | null;
    startDate?: string | null;
    startTime?: string | null;
    endDate?: string | null;
    endTime?: string | null;
    locationName?: string | null;
    locationAddress?: string | null;
    tags?: string | null;
    notes?: string | null;
    categoryID?: string | null;
    estimatedDurationMinutes?: number | null;
    parentTaskID?: string | null;
    isRecurring?: boolean;
    recurrenceRule?: string | null;
    externalID?: string | null;
    externalSource?: string | null;
}
export declare class CreateTaskUseCase {
    private readonly taskRepo;
    constructor(taskRepo: ITaskRepository);
    execute(input: CreateTaskInput): Promise<Result<Task, Error>>;
}
//# sourceMappingURL=CompleteTaskUseCase.d.ts.map