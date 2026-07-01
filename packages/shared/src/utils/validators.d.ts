/**
 * Shared validation utilities used across the app.
 */
/**
 * Validates an email address.
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Validates a UUID v4.
 */
export declare function isValidUUID(uuid: string): boolean;
/**
 * Validates a hex color code (e.g., #2196F3).
 */
export declare function isValidHexColor(color: string): boolean;
/**
 * Validates a date in YYYY-MM-DD format.
 */
export declare function isValidDateString(date: string): boolean;
/**
 * Validates a time in HH:mm:ss format.
 */
export declare function isValidTimeString(time: string): boolean;
/**
 * Validates a URL.
 */
export declare function isValidURL(url: string): boolean;
/**
 * Validates a phone number (basic international format).
 */
export declare function isValidPhoneNumber(phone: string): boolean;
/**
 * Validates that a string is not empty or only whitespace.
 */
export declare function isNonEmpty(value: string): boolean;
/**
 * Validates a password (minimum 8 characters, at least one letter and one number).
 */
export declare function isValidPassword(password: string): boolean;
/**
 * Validates a username (alphanumeric, 3-100 chars, underscores allowed).
 */
export declare function isValidUsername(username: string): boolean;
//# sourceMappingURL=validators.d.ts.map