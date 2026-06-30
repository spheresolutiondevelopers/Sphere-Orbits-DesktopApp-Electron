// Use require for keytar (CommonJS module)
const keytar = require('keytar') as {
  setPassword: (service: string, account: string, password: string) => Promise<void>;
  getPassword: (service: string, account: string) => Promise<string | null>;
  deletePassword: (service: string, account: string) => Promise<boolean>;
};

const SERVICE_NAME = 'com.sphere.orbits';

export class TokenStore {
  async saveToken(token: string): Promise<void> {
    await keytar.setPassword(SERVICE_NAME, 'access_token', token);
  }

  async getToken(): Promise<string | null> {
    return await keytar.getPassword(SERVICE_NAME, 'access_token');
  }

  async saveRefreshToken(token: string): Promise<void> {
    await keytar.setPassword(SERVICE_NAME, 'refresh_token', token);
  }

  async getRefreshToken(): Promise<string | null> {
    return await keytar.getPassword(SERVICE_NAME, 'refresh_token');
  }

  async clearTokens(): Promise<void> {
    await keytar.deletePassword(SERVICE_NAME, 'access_token');
    await keytar.deletePassword(SERVICE_NAME, 'refresh_token');
  }
}