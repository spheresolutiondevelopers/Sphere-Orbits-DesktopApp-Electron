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
export function formatDate(
  date: Date | string,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(d);
}

/**
 * Formats a date to YYYY-MM-DD.
 */
export function toDateString(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

/**
 * Formats a time to HH:mm:ss.
 */
export function toTimeString(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[1].split('.')[0];
}

/**
 * Checks if a date string is valid.
 */
export function isValidDate(date: string): boolean {
  const d = new Date(date);
  return !isNaN(d.getTime());
}

/**
 * Returns the current date in ISO format (YYYY-MM-DD).
 */
export function today(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Returns the current time in ISO format (HH:mm:ss).
 */
export function nowTime(): string {
  return new Date().toISOString().split('T')[1].split('.')[0];
}

/**
 * Returns the current datetime in ISO 8601 (UTC).
 */
export function nowISO(): string {
  return new Date().toISOString();
}

/**
 * Adds a number of days to a date.
 */
export function addDays(date: Date | string, days: number): string {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

/**
 * Compares two dates. Returns -1 if a < b, 0 if equal, 1 if a > b.
 */
export function compareDates(a: Date | string, b: Date | string): number {
  const da = typeof a === 'string' ? new Date(a) : a;
  const db = typeof b === 'string' ? new Date(b) : b;
  return da.getTime() - db.getTime();
}