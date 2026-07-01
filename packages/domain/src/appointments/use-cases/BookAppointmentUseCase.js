"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookAppointmentUseCase = void 0;
const shared_1 = require("@sphere/shared");
class BookAppointmentUseCase {
    constructor(appointmentRepo) {
        this.appointmentRepo = appointmentRepo;
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
        if (!input.startDateTime) {
            return (0, shared_1.err)(new Error('Start date/time is required'));
        }
        if (!input.endDateTime) {
            return (0, shared_1.err)(new Error('End date/time is required'));
        }
        // Validate that start is before end
        const start = new Date(input.startDateTime);
        const end = new Date(input.endDateTime);
        if (start >= end) {
            return (0, shared_1.err)(new Error('Start time must be before end time'));
        }
        // Check for conflicts
        const conflictResult = await this.appointmentRepo.checkConflicts(input.userID, input.startDateTime, input.endDateTime);
        if (conflictResult.isFailure()) {
            return conflictResult;
        }
        const conflicts = conflictResult.value;
        if (conflicts.length > 0) {
            return (0, shared_1.err)(new Error(`Appointment conflicts with ${conflicts.length} existing appointment(s)`));
        }
        // Create the appointment entity
        const appointmentData = {
            userID: input.userID,
            title: input.title.trim(),
            appointmentType: input.appointmentType || 'general',
            startDateTime: input.startDateTime,
            endDateTime: input.endDateTime,
            allDayEvent: input.allDayEvent || false,
            description: input.description || null,
            location: input.location || null,
            isVirtual: input.isVirtual || false,
            meetingLink: input.meetingLink || null,
            meetingPlatform: input.meetingPlatform || null,
            status: 'scheduled',
            reminderMinutesBefore: input.reminderMinutesBefore || 15,
            isRecurring: input.isRecurring || false,
            recurrencePattern: input.recurrencePattern || null,
            calendarColor: input.calendarColor || '#2196F3',
            notes: input.notes || null,
            externalSyncStatus: 'not_synced',
            isDeleted: false,
        };
        // Use the repository to create the appointment (it will generate IDs and timestamps)
        return this.appointmentRepo.createAppointment(appointmentData);
    }
}
exports.BookAppointmentUseCase = BookAppointmentUseCase;
//# sourceMappingURL=BookAppointmentUseCase.js.map