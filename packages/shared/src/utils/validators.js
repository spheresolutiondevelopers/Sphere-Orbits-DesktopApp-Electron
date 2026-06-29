/**
 * Shared validation utilities used across the app.
 */
/**
 * Validates an email address.
 */
export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
/**
 * Validates a UUID v4.
 */
export function isValidUUID(uuid) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
}
/**
 * Validates a hex color code (e.g., #2196F3).
 */
export function isValidHexColor(color) {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
}
/**
 * Validates a date in YYYY-MM-DD format.
 */
export function isValidDateString(date) {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
}
/**
 * Validates a time in HH:mm:ss format.
 */
export function isValidTimeString(time) {
    return /^\d{2}:\d{2}:\d{2}$/.test(time);
}
/**
 * Validates a URL.
 */
export function isValidURL(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Validates a phone number (basic international format).
 */
export function isValidPhoneNumber(phone) {
    return /^\+?[0-9\s\-()]{7,20}$/.test(phone);
}
/**
 * Validates that a string is not empty or only whitespace.
 */
export function isNonEmpty(value) {
    return value.trim().length > 0;
}
/**
 * Validates a password (minimum 8 characters, at least one letter and one number).
 */
export function isValidPassword(password) {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}
/**
 * Validates a username (alphanumeric, 3-100 chars, underscores allowed).
 */
export function isValidUsername(username) {
    return /^[a-zA-Z0-9_]{3,100}$/.test(username);
}
