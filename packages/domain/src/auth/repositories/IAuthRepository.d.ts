import { Result } from '@sphere/shared';
import { User } from '../entities/User';
export interface IAuthRepository {
    /**
     * Logs in a user with email and password.
     * @param email - User's email
     * @param password - Plain password
     * @returns Result containing { user, token, refreshToken } or error
     */
    login(email: string, password: string): Promise<Result<{
        user: User;
        token: string;
        refreshToken?: string;
    }, Error>>;
    /**
     * Registers a new user.
     * @param email - User's email
     * @param password - Plain password
     * @param username - Desired username
     * @param displayName - Display name
     * @returns Result containing the created User or error
     */
    signup(email: string, password: string, username: string, displayName: string): Promise<Result<User, Error>>;
    /**
     * Logs out the current user (invalidates token locally).
     * @param token - The JWT token to invalidate
     * @returns Result<void> or error
     */
    logout(token: string): Promise<Result<void, Error>>;
    /**
     * Validates a JWT token.
     * @param token - The token to validate
     * @returns Result containing the User if valid, or error
     */
    validateToken(token: string): Promise<Result<User, Error>>;
    /**
     * Refreshes an expired token.
     * @param refreshToken - The refresh token
     * @returns Result containing a new access token and user
     */
    refreshToken(refreshToken: string): Promise<Result<{
        user: User;
        token: string;
    }, Error>>;
    /**
     * Fetches the current user from the server (for initial load).
     * @param token - The access token
     * @returns Result containing User or error
     */
    getCurrentUser(token: string): Promise<Result<User, Error>>;
}
//# sourceMappingURL=IAuthRepository.d.ts.map