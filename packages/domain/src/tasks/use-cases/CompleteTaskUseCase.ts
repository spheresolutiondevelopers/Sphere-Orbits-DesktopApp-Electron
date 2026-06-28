import { Result } from '@sphere/shared';
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

export class CreateTaskUseCase {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute(input: CreateTaskInput): Promise<Result<Task, Error>> {
    // Validate required fields
    if (!input.userID) {
      return Result.err(new Error('userID is required'));
    }
    if (!input.title || input.title.trim().length === 0) {
      return Result.err(new Error('Title is required'));
    }
    if (input.title.length > 255) {
      return Result.err(new Error('Title cannot exceed 255 characters'));
    }

    // Create a partial task object (without taskID, createdAt, updatedAt)
    const taskData = {
      userID: input.userID,
      title: input.title.trim(),
      description: input.description,
      taskType: input.taskType || 'general',
      priorityLevel: input.priorityLevel || 'medium',
      status: 'pending' as const,
      completionPercentage: 0,
      dueDate: input.dueDate || null,
      dueTime: input.dueTime || null,
      startDate: input.startDate || null,
      startTime: input.startTime || null,
      endDate: input.endDate || null,
      endTime: input.endTime || null,
      locationName: input.locationName || null,
      locationAddress: input.locationAddress || null,
      tags: input.tags || null,
      notes: input.notes || null,
      categoryID: input.categoryID || null,
      estimatedDurationMinutes: input.estimatedDurationMinutes || null,
      actualDurationMinutes: null,
      timeSpentMinutes: 0,
      isRecurring: input.isRecurring || false,
      recurrenceRule: input.recurrenceRule || null,
      parentTaskID: input.parentTaskID || null,
      externalID: input.externalID || null,
      externalSource: input.externalSource || null,
      externalSyncStatus: 'not_synced' as const,
      isDeleted: false,
      latitude: null,
      longitude: null,
    };

    return this.taskRepo.createTask(taskData as Omit<Task, 'taskID' | 'createdAt' | 'updatedAt'>);
  }
}