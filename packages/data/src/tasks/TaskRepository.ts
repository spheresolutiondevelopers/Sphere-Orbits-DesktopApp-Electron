import { Result, TaskSchema } from '@sphere/shared';
import { Task, ITaskRepository, TaskFilters, PaginationOptions, PaginatedResult } from '@sphere/domain';
import { DatabaseClient } from '../database/DatabaseClient';
import { TaskDao } from './local/TaskDao';
import { TaskApi } from './remote/TaskApi';

export class TaskRepository implements ITaskRepository {
  private taskDao: TaskDao;
  private taskApi: TaskApi;

  constructor(db: DatabaseClient, apiBaseURL: string) {
    this.taskDao = new TaskDao(db);
    this.taskApi = new TaskApi(apiBaseURL);
  }

  async getTasks(
    userID: string,
    filters?: TaskFilters,
    pagination?: PaginationOptions
  ): Promise<Result<PaginatedResult<Task>, Error>> {
    try {
      const result = await this.taskDao.getTasks(userID, filters, pagination);
      return Result.ok(result);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async getTaskById(taskID: string, userID: string): Promise<Result<Task, Error>> {
    try {
      const row = await this.taskDao.getTaskById(taskID, userID);
      if (!row) {
        return Result.err(new Error('Task not found'));
      }
      return Result.ok(row);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async createTask(
    task: Omit<Task, 'taskID' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<Task, Error>> {
    try {
      // Validate with Zod
      const validation = TaskSchema.omit({
        taskID: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
        userID: true,
      }).safeParse(task);
      if (!validation.success) {
        return Result.err(new Error(validation.error.message));
      }

      const created = await this.taskDao.createTask(task);
      return Result.ok(created);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async updateTask(taskID: string, updates: Partial<Task>): Promise<Result<Task, Error>> {
    try {
      // Validate partial updates
      const validation = TaskSchema.partial().safeParse(updates);
      if (!validation.success) {
        return Result.err(new Error(validation.error.message));
      }

      const updated = await this.taskDao.updateTask(taskID, updates);
      if (!updated) {
        return Result.err(new Error('Task not found'));
      }
      return Result.ok(updated);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async deleteTask(taskID: string, userID: string): Promise<Result<void, Error>> {
    try {
      await this.taskDao.softDelete(taskID, userID);
      return Result.ok(undefined);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async permanentlyDeleteTask(taskID: string, userID: string): Promise<Result<void, Error>> {
    try {
      await this.taskDao.hardDelete(taskID, userID);
      return Result.ok(undefined);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async getTasksForSync(userID: string): Promise<Result<Task[], Error>> {
    try {
      const tasks = await this.taskDao.getTasksForSync(userID);
      return Result.ok(tasks);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async markTaskSynced(taskID: string): Promise<Result<void, Error>> {
    try {
      await this.taskDao.markSynced(taskID);
      return Result.ok(undefined);
    } catch (error: any) {
      return Result.err(error);
    }
  }
}