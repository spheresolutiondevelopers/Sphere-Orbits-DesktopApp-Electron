import { type Result } from '@sphere/shared';
import { IEventRepository } from '../repositories/IEventRepository';
import { Event } from '../entities/Event';
export interface CreateEventInput {
    userID: string;
    name: string;
    categoryID?: string | null;
    taskID?: string | null;
    format?: string | null;
    planningNotes?: string | null;
    startDateTime?: string | null;
    endDateTime?: string | null;
    isRecurring?: boolean;
    recurrencePattern?: string | null;
}
export declare class CreateEventUseCase {
    private readonly eventRepo;
    constructor(eventRepo: IEventRepository);
    execute(input: CreateEventInput): Promise<Result<Event, Error>>;
}
//# sourceMappingURL=CreateEventUseCase.d.ts.map