// Re-export all modules
// Note: 'calendar' and 'events' both export 'EventDao' which causes ambiguity
// We import them with aliases to avoid conflicts
export * from './auth';
export * from './tasks';
export * from './appointments';

// Calendar exports
export { EventDao as CalendarEventDao } from './calendar';
export { CalendarRepository, GoogleCalendarApi } from './calendar';

// Events exports
export { EventDao as DomainEventDao } from './events';
export { EventRepository } from './events';

export * from './meetings';
export * from './notes';
export * from './chat';
export * from './analytics';
export * from './settings';
export * from './database';