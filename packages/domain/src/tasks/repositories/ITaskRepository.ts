import { Result } from '@sphere/shared';
import { Task } from '../entities/Task';

export interface TaskFilters {
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'deferred';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  taskType?: 'general' | 'meeting' | 'reminder' | 'deadline' | 'event';
  dueDateFrom?: string;
  dueDateTo?: string;
  search?: string;
  categoryID?: string;
}

export interface PaginationOptions {
  limit: number;
  offset: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export interface ITaskRepository {
  /**
   * Gets tasks for the current user with optional filters and pagination.
   */
  getTasks(
    userID: string,
    filters?: TaskFilters,
    pagination?: PaginationOptions
  ): Promise<Result<PaginatedResult<Task>, Error>>;

  /**
   * Gets a single task by ID.
   */
  getTaskById(taskID: string, userID: string): Promise<Result<Task, Error>>;

  /**
   * Creates a new task.
   */
  createTask(task: Omit<Task, 'taskID' | 'createdAt' | 'updatedAt'>): Promise<Result<Task, Error>>;

  /**
   * Updates an existing task.
   */
  updateTask(taskID: string, updates: Partial<Task>): Promise<Result<Task, Error>>;

  /**
   * Deletes a task (soft‑delete).
   */
  deleteTask(taskID: string, userID: string): Promise<Result<void, Error>>;

  /**
   * Permanently removes a task (hard‑delete).
   */
  permanentlyDeleteTask(taskID: string, userID: string): Promise<Result<void, Error>>;

  /**
   * Gets all tasks that need to be synced (pending, failed).
   */
  getTasksForSync(userID: string): Promise<Result<Task[], Error>>;

  /**
   * Marks a task as synced.
   */
  markTaskSynced(taskID: string): Promise<Result<void, Error>>;
}