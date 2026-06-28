import { Result } from '@sphere/shared';
import { IEventRepository, EventFilters, PaginationOptions, PaginatedResult } from '../repositories/IEventRepository';
import { Event } from '../entities/Event';

export class GetEventsUseCase {
  constructor(private readonly eventRepo: IEventRepository) {}

  async execute(
    userID: string,
    filters?: EventFilters,
    pagination?: PaginationOptions
  ): Promise<Result<PaginatedResult<Event>, Error>> {
    if (!userID) {
      return Result.err(new Error('userID is required'));
    }
    return this.eventRepo.getEvents(userID, filters, pagination);
  }
}