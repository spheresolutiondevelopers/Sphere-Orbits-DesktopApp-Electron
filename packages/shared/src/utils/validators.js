"use strict";
/**
 * Shared validation utilities used across the app.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = isValidEmail;
exports.isValidUUID = isValidUUID;
exports.isValidHexColor = isValidHexColor;
exports.isValidDateString = isValidDateString;
exports.isValidTimeString = isValidTimeString;
exports.isValidURL = isValidURL;
exports.isValidPhoneNumber = isValidPhoneNumber;
exports.isNonEmpty = isNonEmpty;
exports.isValidPassword = isValidPassword;
exports.isValidUsername = isValidUsername;
/**
 * Validates an email address.
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
/**
 * Validates a UUID v4.
 */
function isValidUUID(uuid) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
}
/**
 * Validates a hex color code (e.g., #2196F3).
 */
function isValidHexColor(color) {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
}
/**
 * Validates a date in YYYY-MM-DD format.
 */
function isValidDateString(date) {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
}
/**
 * Validates a time in HH:mm:ss format.
 */
function isValidTimeString(time) {
    return /^\d{2}:\d{2}:\d{2}$/.test(time);
}
/**
 * Validates a URL.
 */
function isValidURL(url) {
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
function isValidPhoneNumber(phone) {
    return /^\+?[0-9\s\-()]{7,20}$/.test(phone);
}
/**
 * Validates that a string is not empty or only whitespace.
 */
function isNonEmpty(value) {
    return value.trim().length > 0;
}
/**
 * Validates a password (minimum 8 characters, at least one letter and one number).
 */
function isValidPassword(password) {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}
/**
 * Validates a username (alphanumeric, 3-100 chars, underscores allowed).
 */
function isValidUsername(username) {
    return /^[a-zA-Z0-9_]{3,100}$/.test(username);
}
//# sourceMappingURL=validators.js.map