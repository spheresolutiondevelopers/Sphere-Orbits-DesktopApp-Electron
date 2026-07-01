/**
 * Date utility functions for consistent formatting and manipulation.
 * All dates are stored as ISO 8601 strings in UTC.
 */
/**
 * Formats a date to a human-readable string.
 * @param date - Date object or ISO string
 * @param locale - Locale string (default: 'en-US')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export declare function formatDate(date: Date | string, locale?: string, options?: Intl.DateTimeFormatOptions): string;
/**
 * Formats a date to YYYY-MM-DD.
 */
export declare function toDateString(date: Date | string): string;
/**
 * Formats a time to HH:mm:ss.
 */
export declare function toTimeString(date: Date | string): string;
/**
 * Checks if a date string is valid.
 */
export declare function isValidDate(date: string): boolean;
/**
 * Returns the current date in ISO format (YYYY-MM-DD).
 */
export declare function today(): string;
/**
 * Returns the current time in ISO format (HH:mm:ss).
 */
export declare function nowTime(): string;
/**
 * Returns the current datetime in ISO 8601 (UTC).
 */
export declare function nowISO(): string;
/**
 * Adds a number of days to a date.
 */
export declare function addDays(date: Date | string, days: number): string;
/**
 * Compares two dates. Returns -1 if a < b, 0 if equal, 1 if a > b.
 */
export declare function compareDates(a: Date | string, b: Date | string): number;
//# sourceMappingURL=date.d.ts.map