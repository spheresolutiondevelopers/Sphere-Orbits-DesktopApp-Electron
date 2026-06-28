import { Result } from '@sphere/shared';
import { ITaskRepository } from '../repositories/ITaskRepository';
import { Task } from '../entities/Task';

export class CompleteTaskUseCase {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute(taskID: string, userID: string, completionPercentage: number = 100): Promise<Result<Task, Error>> {
    if (!taskID) {
      return Result.err(new Error('taskID is required'));
    }
    if (!userID) {
      return Result.err(new Error('userID is required'));
    }
    if (completionPercentage < 0 || completionPercentage > 100) {
      return Result.err(new Error('completionPercentage must be between 0 and 100'));
    }

    // First, fetch the task to ensure it exists and belongs to the user
    const taskResult = await this.taskRepo.getTaskById(taskID, userID);
    if (taskResult.isFailure()) {
      return taskResult as any;
    }

    const task = taskResult.value;
    task.complete(completionPercentage);
    return this.taskRepo.updateTask(taskID, task);
  }
}