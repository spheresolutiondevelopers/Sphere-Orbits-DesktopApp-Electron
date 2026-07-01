import { type Result } from '@sphere/shared';
import { ITaskRepository } from '../repositories/ITaskRepository';
import { Task } from '../entities/Task';
export declare class CompleteTaskUseCase {
    private readonly taskRepo;
    constructor(taskRepo: ITaskRepository);
    execute(taskID: string, userID: string, completionPercentage?: number): Promise<Result<Task, Error>>;
}
//# sourceMappingURL=CreateTaskUseCase.d.ts.map