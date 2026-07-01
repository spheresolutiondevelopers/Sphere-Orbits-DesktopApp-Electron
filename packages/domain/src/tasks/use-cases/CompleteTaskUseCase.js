"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaskUseCase = void 0;
const shared_1 = require("@sphere/shared");
class CreateTaskUseCase {
    constructor(taskRepo) {
        this.taskRepo = taskRepo;
    }
    async execute(input) {
        // Validate required fields
        if (!input.userID) {
            return (0, shared_1.err)(new Error('userID is required'));
        }
        if (!input.title || input.title.trim().length === 0) {
            return (0, shared_1.err)(new Error('Title is required'));
        }
        if (input.title.length > 255) {
            return (0, shared_1.err)(new Error('Title cannot exceed 255 characters'));
        }
        // Create a partial task object (without taskID, createdAt, updatedAt)
        const taskData = {
            userID: input.userID,
            title: input.title.trim(),
            description: input.description,
            taskType: input.taskType || 'general',
            priorityLevel: input.priorityLevel || 'medium',
            status: 'pending',
            completionPercentage: 0,
            dueDate: input.dueDate || null,
            dueTime: input.dueTime || null,
            startDate: input.startDate || null,
            startTime: input.startTime || null,
            endDate: input.endDate || null,
            endTime: input.endTime || null,
            locationName: input.locationName || null,
            locationAddress: input.locationAddress || null,
            tags: input.tags || null,
            notes: input.notes || null,
            categoryID: input.categoryID || null,
            estimatedDurationMinutes: input.estimatedDurationMinutes || null,
            actualDurationMinutes: null,
            timeSpentMinutes: 0,
            isRecurring: input.isRecurring || false,
            recurrenceRule: input.recurrenceRule || null,
            parentTaskID: input.parentTaskID || null,
            externalID: input.externalID || null,
            externalSource: input.externalSource || null,
            externalSyncStatus: 'not_synced',
            isDeleted: false,
            latitude: null,
            longitude: null,
        };
        return this.taskRepo.createTask(taskData);
    }
}
exports.CreateTaskUseCase = CreateTaskUseCase;
//# sourceMappingURL=CompleteTaskUseCase.js.map