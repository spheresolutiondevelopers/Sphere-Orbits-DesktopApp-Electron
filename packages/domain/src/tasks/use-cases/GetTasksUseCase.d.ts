import { type Result } from '@sphere/shared';
import { ITaskRepository, TaskFilters, PaginationOptions, PaginatedResult } from '../repositories/ITaskRepository';
import { Task } from '../entities/Task';
export declare class GetTasksUseCase {
    private readonly taskRepo;
    constructor(taskRepo: ITaskRepository);
    execute(userID: string, filters?: TaskFilters, pagination?: PaginationOptions): Promise<Result<PaginatedResult<Task>, Error>>;
}
//# sourceMappingURL=GetTasksUseCase.d.ts.map