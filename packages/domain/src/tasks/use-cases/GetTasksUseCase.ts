import { err, type Result } from '@sphere/shared';
import { ITaskRepository, TaskFilters, PaginationOptions, PaginatedResult } from '../repositories/ITaskRepository';
import { Task } from '../entities/Task';

export class GetTasksUseCase {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute(
    userID: string,
    filters?: TaskFilters,
    pagination?: PaginationOptions
  ): Promise<Result<PaginatedResult<Task>, Error>> {
    if (!userID) {
      return err(new Error('userID is required'));
    }
    return this.taskRepo.getTasks(userID, filters, pagination);
  }
}