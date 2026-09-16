import crypto from 'node:crypto';
import { ok, err, type Result } from '@sphere/shared';
import { User, IAuthRepository } from '@sphere/domain';
import { TokenStore } from './TokenStore';
import { OAuthClient } from './OAuthClient';
import { DatabaseClient } from '../database/DatabaseClient';

// ─── helpers ────────────────────────────────────────────────────────────────

function hashPassword(password: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function generateId(): string {
  return crypto.randomUUID();
}

function sessionExpiresAt(hours = 720): string {
  // 30 days
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

// ─── row → domain ─────────────────────────────────────────────────────────

function rowToUser(row: any): User {
  return User.fromDTO({
    userID: row.id,
    email: row.email,
    username: row.username ?? null,
    displayName: row.display_name ?? row.email.split('@')[0],
    firstName: row.first_name ?? null,
    lastName: row.last_name ?? null,
    phoneNumber: row.phone_number ?? null,
    avatarUrl: row.avatar_url ?? null,
    accountType: row.account_type ?? 'free',
    isActive: row.is_active === 1,
    isDeleted: row.is_deleted === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

// ────────────────────────────────────────────────────────────────────────────

export class AuthRepository implements IAuthRepository {
  constructor(
    private readonly db: DatabaseClient,
    private readonly tokenStore: TokenStore,
    private readonly oauthClient: OAuthClient,
    _baseURL: string // kept for interface compatibility – not used offline
  ) {
    this._registerOAuthProviders();
  }

  private _registerOAuthProviders(): void {
    try {
      this.oauthClient.registerProvider({
        id: 'google',
        name: 'Google',
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        scopes: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
        ],
      });
    } catch {
      // ignore – oauth optional
    }
  }

  // ── Local login (primary, always offline) ──────────────────────────────

  async login(
    email: string,
    password: string
  ): Promise<Result<{ user: User; token: string; refreshToken?: string }, Error>> {
    try {
      const row = this.db
        .prepare('SELECT * FROM users WHERE email = ? AND is_deleted = 0 AND is_active = 1')
        .get(email) as any;

      if (!row) {
        return err(new Error('No account found with that email address.'));
      }

      if (!row.password_hash || !row.password_salt) {
        return err(new Error('Account has no password set. Please contact support.'));
      }

      const hashed = hashPassword(password, row.password_salt);
      if (hashed !== row.password_hash) {
        return err(new Error('Incorrect password.'));
      }

      const token = generateToken();
      const sessionId = generateId();
      const expiresAt = sessionExpiresAt();

      // Persist session in local DB
      this.db
        .prepare(
          'INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)'
        )
        .run(sessionId, row.id, token, expiresAt);

      // Also persist in keytar for backward-compat
      try {
        await this.tokenStore.saveToken(token);
      } catch {
        // keytar optional
      }

      const user = rowToUser(row);
      return ok({ user, token });
    } catch (error: any) {
      return err(new Error(error.message ?? 'Login failed'));
    }
  }

  // ── Signup (local-first) ───────────────────────────────────────────────

  async signup(
    email: string,
    password: string,
    username: string,
    displayName: string
  ): Promise<Result<User, Error>> {
    try {
      const existing = this.db
        .prepare('SELECT id FROM users WHERE email = ? AND is_deleted = 0')
        .get(email);
      if (existing) {
        return err(new Error('An account with that email already exists.'));
      }

      const salt = crypto.randomBytes(16).toString('hex');
      const hash = hashPassword(password, salt);
      const id = generateId();
      const now = new Date().toISOString();

      this.db
        .prepare(
          `INSERT INTO users
            (id, email, username, display_name, password_hash, password_salt,
             account_type, is_active, is_deleted, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, 'free', 1, 0, ?, ?)`
        )
        .run(id, email, username || null, displayName || email.split('@')[0], hash, salt, now, now);

      const row = this.db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
      return ok(rowToUser(row));
    } catch (error: any) {
      return err(new Error(error.message ?? 'Signup failed'));
    }
  }

  // ── Get session (no network needed) ───────────────────────────────────

  async getSession(): Promise<Result<{ user: User; token: string } | null, Error>> {
    try {
      // Find the most recent non-expired session
      const session = this.db
        .prepare(
          `SELECT s.token, u.*
           FROM sessions s
           JOIN users u ON u.id = s.user_id
           WHERE s.expires_at > datetime('now')
             AND u.is_deleted = 0
             AND u.is_active = 1
           ORDER BY s.created_at DESC
           LIMIT 1`
        )
        .get() as any;

      if (!session) return ok(null);

      const user = rowToUser(session);
      return ok({ user, token: session.token });
    } catch (error: any) {
      return err(new Error(error.message ?? 'Failed to read session'));
    }
  }

  // ── Logout ─────────────────────────────────────────────────────────────

  async logout(token: string): Promise<Result<void, Error>> {
    try {
      this.db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
      try {
        await this.tokenStore.clearTokens();
      } catch {
        // keytar optional
      }
      return ok(undefined);
    } catch (error: any) {
      return err(new Error(error.message ?? 'Logout failed'));
    }
  }

  // ── Validate token (local only) ────────────────────────────────────────

  async validateToken(token: string): Promise<Result<User, Error>> {
    try {
      const row = this.db
        .prepare(
          `SELECT u.* FROM sessions s
           JOIN users u ON u.id = s.user_id
           WHERE s.token = ? AND s.expires_at > datetime('now')
             AND u.is_deleted = 0 AND u.is_active = 1`
        )
        .get(token) as any;

      if (!row) return err(new Error('Session expired or invalid.'));
      return ok(rowToUser(row));
    } catch (error: any) {
      return err(new Error(error.message ?? 'Token validation failed'));
    }
  }

  // ── Refresh token (generates new local token) ──────────────────────────

  async refreshToken(oldToken: string): Promise<Result<{ user: User; token: string }, Error>> {
    const validated = await this.validateToken(oldToken);
    if (validated.isFailure()) return err(validated.error);

    const user = validated.value;
    const newToken = generateToken();
    const sessionId = generateId();
    const expiresAt = sessionExpiresAt();

    this.db
      .prepare('DELETE FROM sessions WHERE token = ?')
      .run(oldToken);
    this.db
      .prepare(
        'INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)'
      )
      .run(sessionId, user.userID, newToken, expiresAt);

    try {
      await this.tokenStore.saveToken(newToken);
    } catch {
      // keytar optional
    }

    return ok({ user, token: newToken });
  }

  // ── OAuth (stubs – only used if API is configured) ─────────────────────

  getOAuthAuthUrl(providerId: string, redirectUri: string, state?: string): string {
    return this.oauthClient.getAuthUrl(providerId, redirectUri, state);
  }

  async exchangeOAuthCode(
    providerId: string,
    code: string,
    redirectUri: string
  ): Promise<Result<{ accessToken: string; refreshToken?: string }, Error>> {
    return this.oauthClient.exchangeCode(providerId, code, redirectUri);
  }

  async oauthLogin(
    _providerId: string,
    _code: string,
    _redirectUri: string
  ): Promise<Result<{ user: User; token: string; refreshToken?: string }, Error>> {
    return err(new Error('OAuth login requires API connection.'));
  }

  async getCurrentUser(token: string): Promise<Result<User, Error>> {
    return this.validateToken(token);
  }
}