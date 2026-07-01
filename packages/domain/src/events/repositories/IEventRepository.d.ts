import { Result } from '@sphere/shared';
import { Event } from '../entities/Event';
export interface EventFilters {
    status?: 'planned' | 'ongoing' | 'completed' | 'cancelled';
    categoryID?: string;
    startDateFrom?: string;
    startDateTo?: string;
    search?: string;
}
export interface PaginationOptions {
    limit: number;
    offset: number;
}
export interface PaginatedResult<T> {
    items: T[];
    total: number;
}
export interface IEventRepository {
    getEvents(userID: string, filters?: EventFilters, pagination?: PaginationOptions): Promise<Result<PaginatedResult<Event>, Error>>;
    getEventById(eventID: string, userID: string): Promise<Result<Event, Error>>;
    createEvent(event: Omit<Event, 'eventID' | 'createdAt' | 'updatedAt'>): Promise<Result<Event, Error>>;
    updateEvent(eventID: string, updates: Partial<Event>): Promise<Result<Event, Error>>;
    deleteEvent(eventID: string, userID: string): Promise<Result<void, Error>>;
    getEventsForSync(userID: string): Promise<Result<Event[], Error>>;
    markEventSynced(eventID: string): Promise<Result<void, Error>>;
}
//# sourceMappingURL=IEventRepository.d.ts.map