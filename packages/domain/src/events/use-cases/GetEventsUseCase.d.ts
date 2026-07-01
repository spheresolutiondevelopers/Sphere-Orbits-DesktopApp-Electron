import { type Result } from '@sphere/shared';
import { IEventRepository, EventFilters, PaginationOptions, PaginatedResult } from '../repositories/IEventRepository';
import { Event } from '../entities/Event';
export declare class GetEventsUseCase {
    private readonly eventRepo;
    constructor(eventRepo: IEventRepository);
    execute(userID: string, filters?: EventFilters, pagination?: PaginationOptions): Promise<Result<PaginatedResult<Event>, Error>>;
}
//# sourceMappingURL=GetEventsUseCase.d.ts.map