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
    private readonly oauthClient: OAuthClient, // Now usable, not unused
    baseURL: string
  ) {
    this.apiClient = axios.create({
      baseURL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });

    // Register OAuth providers
    this.registerOAuthProviders();
  }

  /**
   * Registers OAuth providers with the OAuth client.
   * This makes the oauthClient usable.
   */
  private registerOAuthProviders(): void {
    // Register Google OAuth provider
    this.oauthClient.registerProvider({
      id: 'google',
      name: 'Google',
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
    });

    // Register Microsoft OAuth provider
    this.oauthClient.registerProvider({
      id: 'microsoft',
      name: 'Microsoft',
      authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      clientId: process.env.MICROSOFT_CLIENT_ID || '',
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
      scopes: ['openid', 'profile', 'email', 'offline_access'],
    });
  }

  private setAuthHeader(token: string): void {
    this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Generates the OAuth authorization URL for a provider.
   * This uses the oauthClient.
   */
  getOAuthAuthUrl(providerId: string, redirectUri: string, state?: string): string {
    return this.oauthClient.getAuthUrl(providerId, redirectUri, state);
  }

  /**
   * Exchanges an OAuth code for an access token.
   * This uses the oauthClient.
   */
  async exchangeOAuthCode(
    providerId: string,
    code: string,
    redirectUri: string
  ): Promise<Result<{ accessToken: string; refreshToken?: string }, Error>> {
    return this.oauthClient.exchangeCode(providerId, code, redirectUri);
  }

  /**
   * OAuth login using the OAuth client.
   * This uses the oauthClient to get tokens and then logs the user in.
   */
  async oauthLogin(
    providerId: string,
    code: string,
    redirectUri: string
  ): Promise<Result<{ user: User; token: string; refreshToken?: string }, Error>> {
    try {
      // Exchange code for tokens using oauthClient
      const tokenResult = await this.oauthClient.exchangeCode(providerId, code, redirectUri);
      if (tokenResult.isFailure()) {
        return err(tokenResult.error);
      }

      const { accessToken, refreshToken } = tokenResult.value;

      // Use the access token to get user info from the API
      this.setAuthHeader(accessToken);
      const response = await this.apiClient.get('/auth/oauth/login', {
        params: { provider: providerId },
      });

      const data = response.data;
      const user = User.fromDTO(data.user);

      // Store tokens
      await this.tokenStore.saveToken(accessToken);
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

      return ok({ user, token: accessToken, refreshToken });
    } catch (error: any) {
      return err(error.response?.data?.message || new Error('OAuth login failed'));
    }
  }

  async login(email: string, password: string): Promise<Result<{ user: User; token: string; refreshToken?: string }, Error>> {
    try {
      const response = await this.apiClient.post('/auth/login', { email, password });
      const data = response.data;
      const user = User.fromDTO(data.user);
      const token = data.token;
      const refreshToken = data.refreshToken;

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
      await this.tokenStore.saveToken(data.token);
      if (data.refreshToken) {
        await this.tokenStore.saveRefreshToken(data.refreshToken);
      }
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