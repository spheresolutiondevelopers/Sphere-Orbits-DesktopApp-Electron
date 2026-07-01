"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
class Appointment {
    constructor(appointmentID, userID, title, appointmentType, startDateTime, endDateTime, allDayEvent, isVirtual, status, reminderMinutesBefore, isRecurring, externalSyncStatus, isDeleted, createdAt, updatedAt, description, location, meetingLink, meetingPlatform, recurrencePattern, calendarColor = '#2196F3', externalEventID, notes) {
        this.appointmentID = appointmentID;
        this.userID = userID;
        this.title = title;
        this.appointmentType = appointmentType;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.allDayEvent = allDayEvent;
        this.isVirtual = isVirtual;
        this.status = status;
        this.reminderMinutesBefore = reminderMinutesBefore;
        this.isRecurring = isRecurring;
        this.externalSyncStatus = externalSyncStatus;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.description = description;
        this.location = location;
        this.meetingLink = meetingLink;
        this.meetingPlatform = meetingPlatform;
        this.recurrencePattern = recurrencePattern;
        this.calendarColor = calendarColor;
        this.externalEventID = externalEventID;
        this.notes = notes;
    }
    /**
     * Factory method to create an Appointment from a DTO.
     */
    static fromDTO(dto) {
        return new Appointment(dto.appointmentID, dto.userID, dto.title, dto.appointmentType, dto.startDateTime, dto.endDateTime, dto.allDayEvent, dto.isVirtual, dto.status, dto.reminderMinutesBefore, dto.isRecurring, dto.externalSyncStatus, dto.isDeleted, dto.createdAt, dto.updatedAt, dto.description, dto.location, dto.meetingLink, dto.meetingPlatform, dto.recurrencePattern, dto.calendarColor, dto.externalEventID, dto.notes);
    }
    /**
     * Converts this Appointment to a DTO.
     */
    toDTO() {
        return {
            appointmentID: this.appointmentID,
            userID: this.userID,
            title: this.title,
            description: this.description,
            appointmentType: this.appointmentType,
            startDateTime: this.startDateTime,
            endDateTime: this.endDateTime,
            allDayEvent: this.allDayEvent,
            location: this.location,
            isVirtual: this.isVirtual,
            meetingLink: this.meetingLink,
            meetingPlatform: this.meetingPlatform,
            status: this.status,
            reminderMinutesBefore: this.reminderMinutesBefore,
            isRecurring: this.isRecurring,
            recurrencePattern: this.recurrencePattern,
            calendarColor: this.calendarColor,
            externalEventID: this.externalEventID,
            externalSyncStatus: this.externalSyncStatus,
            notes: this.notes,
            isDeleted: this.isDeleted,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
    /**
     * Updates the appointment. Only defined fields are updated.
     */
    update(updates) {
        Object.assign(this, updates);
        this.updatedAt = new Date().toISOString();
    }
    /**
     * Confirms the appointment.
     */
    confirm() {
        if (this.status === 'scheduled' || this.status === 'rescheduled') {
            this.status = 'confirmed';
            this.updatedAt = new Date().toISOString();
        }
    }
    /**
     * Cancels the appointment.
     */
    cancel() {
        if (this.status !== 'completed' && this.status !== 'cancelled') {
            this.status = 'cancelled';
            this.updatedAt = new Date().toISOString();
        }
    }
    /**
     * Marks the appointment as completed.
     */
    complete() {
        if (this.status === 'confirmed' || this.status === 'scheduled') {
            this.status = 'completed';
            this.updatedAt = new Date().toISOString();
        }
    }
    /**
     * Reschedules the appointment.
     */
    reschedule(newStartDateTime, newEndDateTime) {
        if (this.status === 'completed' || this.status === 'cancelled') {
            throw new Error(`Cannot reschedule a ${this.status} appointment`);
        }
        this.startDateTime = newStartDateTime;
        this.endDateTime = newEndDateTime;
        this.status = 'rescheduled';
        this.updatedAt = new Date().toISOString();
    }
    /**
     * Checks if the appointment is currently ongoing.
     */
    isOngoing(currentDate = new Date().toISOString()) {
        const now = new Date(currentDate);
        const start = new Date(this.startDateTime);
        const end = new Date(this.endDateTime);
        return now >= start && now <= end && this.status !== 'cancelled' && this.status !== 'completed';
    }
    /**
     * Checks if the appointment is in the future.
     */
    isFuture(currentDate = new Date().toISOString()) {
        return new Date(this.startDateTime) > new Date(currentDate) && this.status !== 'cancelled';
    }
    /**
     * Checks if the appointment is in the past.
     */
    isPast(currentDate = new Date().toISOString()) {
        return new Date(this.endDateTime) < new Date(currentDate) || this.status === 'completed';
    }
    /**
     * Validates the appointment times.
     */
    validate() {
        if (this.allDayEvent) {
            // For all-day events, start and end must be on the same day or end is start + 1 day
            const start = new Date(this.startDateTime);
            const end = new Date(this.endDateTime);
            const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
            return diffDays <= 1 && diffDays >= 0;
        }
        return new Date(this.startDateTime) < new Date(this.endDateTime);
    }
}
exports.Appointment = Appointment;
//# sourceMappingURL=Appointment.js.map