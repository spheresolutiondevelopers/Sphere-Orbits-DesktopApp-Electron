"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEventUseCase = void 0;
const shared_1 = require("@sphere/shared");
class CreateEventUseCase {
    constructor(eventRepo) {
        this.eventRepo = eventRepo;
    }
    async execute(input) {
        // Validate required fields
        if (!input.userID) {
            return (0, shared_1.err)(new Error('userID is required'));
        }
        if (!input.name || input.name.trim().length === 0) {
            return (0, shared_1.err)(new Error('Event name is required'));
        }
        if (input.name.length > 255) {
            return (0, shared_1.err)(new Error('Event name cannot exceed 255 characters'));
        }
        // Validate that start <= end if both provided
        if (input.startDateTime && input.endDateTime) {
            const start = new Date(input.startDateTime);
            const end = new Date(input.endDateTime);
            if (start >= end) {
                return (0, shared_1.err)(new Error('Start time must be before end time'));
            }
        }
        // Create the event entity
        const eventData = {
            userID: input.userID,
            name: input.name.trim(),
            categoryID: input.categoryID || null,
            taskID: input.taskID || null,
            format: input.format || null,
            planningNotes: input.planningNotes || null,
            startDateTime: input.startDateTime || null,
            endDateTime: input.endDateTime || null,
            status: 'planned',
            isRecurring: input.isRecurring || false,
            recurrencePattern: input.recurrencePattern || null,
            isDeleted: false,
        };
        return this.eventRepo.createEvent(eventData);
    }
}
exports.CreateEventUseCase = CreateEventUseCase;
//# sourceMappingURL=CreateEventUseCase.js.map