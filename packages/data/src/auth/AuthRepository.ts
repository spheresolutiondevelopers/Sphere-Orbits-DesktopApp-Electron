import { ok, err, type Result } from '@sphere/shared';
import { User, IAuthRepository } from '@sphere/domain';
import { TokenStore } from './TokenStore';
import { OAuthClient } from './OAuthClient';
import { DatabaseClient } from '../database/DatabaseClient';
import axios, { AxiosInstance } from 'axios';

export class AuthRepository implements IAuthRepository {
  private apiClient: AxiosInstance;

  constructor(
    private readonly db: DatabaseClient,
    private readonly tokenStore: TokenStore,
    private readonly _oauthClient: OAuthClient,
    baseURL: string
  ) {
    this.apiClient = axios.create({
      baseURL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private setAuthHeader(token: string): void {
    this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async login(email: string, password: string): Promise<Result<{ user: User; token: string; refreshToken?: string }, Error>> {
    try {
      const response = await this.apiClient.post('/auth/login', { email, password });
      const data = response.data;
      const user = User.fromDTO(data.user);
      const token = data.token;
      const refreshToken = data.refreshToken;

      // Store token securely
      await this.tokenStore.saveToken(token);
      if (refreshToken) {
        await this.tokenStore.saveRefreshToken(refreshToken);
      }

      // Cache user in local DB
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO users (
          id, email, username, display_name, first_name, last_name,
          phone_number, avatar_url, account_type, is_active, is_deleted,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        user.userID,
        user.email,
        user.username || null,
        user.displayName,
        user.firstName || null,
        user.lastName || null,
        user.phoneNumber || null,
        user.avatarUrl || null,
        user.accountType,
        user.isActive ? 1 : 0,
        user.isDeleted ? 1 : 0,
        user.createdAt,
        user.updatedAt
      );

      this.setAuthHeader(token);
      return ok({ user, token, refreshToken });
    } catch (error: any) {
      return err(error.response?.data?.message || new Error('Login failed'));
    }
  }

  async signup(email: string, password: string, username: string, displayName: string): Promise<Result<User, Error>> {
    try {
      const response = await this.apiClient.post('/auth/signup', { email, password, username, displayName });
      const data = response.data;
      const user = User.fromDTO(data.user);
      // Store token (auto-login after signup)
      await this.tokenStore.saveToken(data.token);
      if (data.refreshToken) {
        await this.tokenStore.saveRefreshToken(data.refreshToken);
      }
      // Cache user
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO users (
          id, email, username, display_name, first_name, last_name,
          phone_number, avatar_url, account_type, is_active, is_deleted,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        user.userID,
        user.email,
        user.username || null,
        user.displayName,
        user.firstName || null,
        user.lastName || null,
        user.phoneNumber || null,
        user.avatarUrl || null,
        user.accountType,
        user.isActive ? 1 : 0,
        user.isDeleted ? 1 : 0,
        user.createdAt,
        user.updatedAt
      );
      return ok(user);
    } catch (error: any) {
      return err(error.response?.data?.message || new Error('Signup failed'));
    }
  }

  async logout(token: string): Promise<Result<void, Error>> {
    try {
      await this.apiClient.post('/auth/logout', { token });
    } catch (error) {
      // Ignore server error, still clear local tokens
    }
    await this.tokenStore.clearTokens();
    delete this.apiClient.defaults.headers.common['Authorization'];
    return ok(undefined);
  }

  async validateToken(token: string): Promise<Result<User, Error>> {
    try {
      this.setAuthHeader(token);
      const response = await this.apiClient.get('/auth/validate');
      const user = User.fromDTO(response.data.user);
      // Update local cache
      return ok(user);
    } catch (error: any) {
      return err(error.response?.data?.message || new Error('Invalid token'));
    }
  }

  async refreshToken(refreshToken: string): Promise<Result<{ user: User; token: string }, Error>> {
    try {
      const response = await this.apiClient.post('/auth/refresh', { refreshToken });
      const data = response.data;
      const user = User.fromDTO(data.user);
      await this.tokenStore.saveToken(data.token);
      this.setAuthHeader(data.token);
      return ok({ user, token: data.token });
    } catch (error: any) {
      return err(error.response?.data?.message || new Error('Refresh failed'));
    }
  }

  async getCurrentUser(token: string): Promise<Result<User, Error>> {
    return this.validateToken(token);
  }
}