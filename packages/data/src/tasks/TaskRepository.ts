import { ok, err, type Result, TaskSchema } from '@sphere/shared';
import { Task, ITaskRepository, TaskFilters, PaginationOptions, PaginatedResult } from '@sphere/domain';
import { DatabaseClient } from '../database/DatabaseClient';
import { TaskDao } from './local/TaskDao';
import { TaskApi } from './remote/TaskApi';

export class TaskRepository implements ITaskRepository {
  private taskDao: TaskDao;
  private _taskApi: TaskApi;

  constructor(db: DatabaseClient, apiBaseURL: string) {
    this.taskDao = new TaskDao(db);
    this._taskApi = new TaskApi(apiBaseURL);
  }

  setAuthToken(token: string): void {
    this._taskApi.setAuthToken(token);
  }

  async getTasks(
    userID: string,
    filters?: TaskFilters,
    pagination?: PaginationOptions
  ): Promise<Result<PaginatedResult<Task>, Error>> {
    try {
      const result = await this.taskDao.getTasks(userID, filters, pagination);
      return ok(result);
    } catch (error: any) {
      return err(error);
    }
  }

  async getTaskById(taskID: string, userID: string): Promise<Result<Task, Error>> {
    try {
      const row = await this.taskDao.getTaskById(taskID, userID);
      if (!row) {
        return err(new Error('Task not found'));
      }
      return ok(row);
    } catch (error: any) {
      return err(error);
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
        return err(new Error(validation.error.message));
      }

      const created = await this.taskDao.createTask(task);
      return ok(created);
    } catch (error: any) {
      return err(error);
    }
  }

  async updateTask(taskID: string, updates: Partial<Task>): Promise<Result<Task, Error>> {
    try {
      // Validate partial updates
      const validation = TaskSchema.partial().safeParse(updates);
      if (!validation.success) {
        return err(new Error(validation.error.message));
      }

      const updated = await this.taskDao.updateTask(taskID, updates);
      if (!updated) {
        return err(new Error('Task not found'));
      }
      return ok(updated);
    } catch (error: any) {
      return err(error);
    }
  }

  async deleteTask(taskID: string, userID: string): Promise<Result<void, Error>> {
    try {
      await this.taskDao.softDelete(taskID, userID);
      return ok(undefined);
    } catch (error: any) {
      return err(error);
    }
  }

  async permanentlyDeleteTask(taskID: string, userID: string): Promise<Result<void, Error>> {
    try {
      await this.taskDao.hardDelete(taskID, userID);
      return ok(undefined);
    } catch (error: any) {
      return err(error);
    }
  }

  async getTasksForSync(userID: string): Promise<Result<Task[], Error>> {
    try {
      const tasks = await this.taskDao.getTasksForSync(userID);
      return ok(tasks);
    } catch (error: any) {
      return err(error);
    }
  }

  async markTaskSynced(taskID: string): Promise<Result<void, Error>> {
    try {
      await this.taskDao.markSynced(taskID);
      return ok(undefined);
    } catch (error: any) {
      return err(error);
    }
  }
}