"use strict";
/**
 * Date utility functions for consistent formatting and manipulation.
 * All dates are stored as ISO 8601 strings in UTC.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.toDateString = toDateString;
exports.toTimeString = toTimeString;
exports.isValidDate = isValidDate;
exports.today = today;
exports.nowTime = nowTime;
exports.nowISO = nowISO;
exports.addDays = addDays;
exports.compareDates = compareDates;
/**
 * Formats a date to a human-readable string.
 * @param date - Date object or ISO string
 * @param locale - Locale string (default: 'en-US')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
function formatDate(date, locale = 'en-US', options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
}) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, options).format(d);
}
/**
 * Formats a date to YYYY-MM-DD.
 */
function toDateString(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
}
/**
 * Formats a time to HH:mm:ss.
 */
function toTimeString(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[1].split('.')[0];
}
/**
 * Checks if a date string is valid.
 */
function isValidDate(date) {
    const d = new Date(date);
    return !isNaN(d.getTime());
}
/**
 * Returns the current date in ISO format (YYYY-MM-DD).
 */
function today() {
    return new Date().toISOString().split('T')[0];
}
/**
 * Returns the current time in ISO format (HH:mm:ss).
 */
function nowTime() {
    return new Date().toISOString().split('T')[1].split('.')[0];
}
/**
 * Returns the current datetime in ISO 8601 (UTC).
 */
function nowISO() {
    return new Date().toISOString();
}
/**
 * Adds a number of days to a date.
 */
function addDays(date, days) {
    const d = typeof date === 'string' ? new Date(date) : new Date(date);
    d.setDate(d.getDate() + days);
    return d.toISOString();
}
/**
 * Compares two dates. Returns -1 if a < b, 0 if equal, 1 if a > b.
 */
function compareDates(a, b) {
    const da = typeof a === 'string' ? new Date(a) : a;
    const db = typeof b === 'string' ? new Date(b) : b;
    return da.getTime() - db.getTime();
}
//# sourceMappingURL=date.js.map