// Auth
export * from './auth';

// Tasks
export * from './tasks/entities/Task';
export * from './tasks/repositories/ITaskRepository';
export * from './tasks/use-cases/CreateTaskUseCase';
export * from './tasks/use-cases/GetTasksUseCase';
export * from './tasks/use-cases/CompleteTaskUseCase';

// Calendar
export { GetEventsUseCase as CalendarGetEventsUseCase } from './calendar/use-cases/GetEventsUseCase';
export { SyncCalendarUseCase } from './calendar/use-cases/SyncCalendarUseCase';

// Meetings
export * from './meetings/entities/Meeting';
export * from './meetings/repositories/IMeetingRepository';
export * from './meetings/use-cases/GetMeetingsUseCase';
export * from './meetings/use-cases/JoinMeetingUseCase';

// Appointments
export * from './appointments/entities/Appointment';
export * from './appointments/repositories/IAppointmentRepository';
export * from './appointments/use-cases/BookAppointmentUseCase';
export * from './appointments/use-cases/GetAppointmentsUseCase';

// Events
export { GetEventsUseCase as EventGetEventsUseCase } from './events/use-cases/GetEventsUseCase';
export { CreateEventUseCase } from './events/use-cases/CreateEventUseCase';

// Chat
export * from './chat/entities/Message';
export * from './chat/repositories/IChatRepository';
export * from './chat/use-cases/SendMessageUseCase';
export * from './chat/use-cases/ObserveMessagesUseCase';

// Notes
export * from './notes/entities/Note';
export * from './notes/repositories/INotesRepository';
export * from './notes/use-cases/SaveNoteUseCase';
export * from './notes/use-cases/GetNotesUseCase';

// Analytics
export * from './analytics/entities/AnalyticsData';
export * from './analytics/repositories/IAnalyticsRepository';
export * from './analytics/use-cases/GenerateReportUseCase';
export * from './analytics/use-cases/GetProductivityScoreUseCase';

// Settings
export * from './settings/entities/Settings';
export * from './settings/repositories/ISettingsRepository';
export * from './settings/use-cases/GetSettingsUseCase';
export * from './settings/use-cases/UpdateSettingsUseCase';

// Common types – exported only once
export type { PaginatedResult, PaginationOptions } from './tasks/repositories/ITaskRepository';
// Common types – exported once

// Also export EventFilters from the events module

// Re-export calendar and event types

export type { ICalendarRepository } from './calendar/repositories/ICalendarRepository';

export type { IEventRepository, EventFilters } from './events/repositories/IEventRepository';

// Re-export calendar and event types that are needed by the data package
// Re-export the class (value) so it can be instantiated
export { CalendarEvent } from './calendar/entities/CalendarEvent';
export { Event } from './events/entities/Event';
export { Meeting } from './meetings/entities/Meeting';
export { Appointment } from './appointments/entities/Appointment';
export { Note } from './notes/entities/Note';
export { Task } from './tasks/entities/Task';
export { User } from './auth/entities/User';
export { Settings } from './settings/entities/Settings';

// Also export their types (for type-only usage)
export type { CalendarEvent as CalendarEventType } from './calendar/entities/CalendarEvent';
export type { Event as EventType } from './events/entities/Event';
export type { Meeting as MeetingType } from './meetings/entities/Meeting';
export type { Appointment as AppointmentType } from './appointments/entities/Appointment';
export type { Note as NoteType } from './notes/entities/Note';
export type { Task as TaskType } from './tasks/entities/Task';
export type { User as UserType } from './auth/entities/User';
export type { Settings as SettingsType } from './settings/entities/Settings';