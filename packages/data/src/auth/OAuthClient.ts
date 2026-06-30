import { ok, err, type Result } from '@sphere/shared';
import axios from 'axios';

export interface OAuthProvider {
  id: string;
  name: string;
  authUrl: string;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  scopes: string[];
}

export class OAuthClient {
  private providers: Map<string, OAuthProvider> = new Map();

  registerProvider(provider: OAuthProvider): void {
    this.providers.set(provider.id, provider);
  }

  getAuthUrl(providerId: string, redirectUri: string, state?: string): string {
    const provider = this.providers.get(providerId);
    if (!provider) throw new Error(`Provider ${providerId} not found`);
    const url = new URL(provider.authUrl);
    url.searchParams.append('client_id', provider.clientId);
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', provider.scopes.join(' '));
    if (state) url.searchParams.append('state', state);
    return url.toString();
  }

  async exchangeCode(
    providerId: string,
    code: string,
    redirectUri: string
  ): Promise<Result<{ accessToken: string; refreshToken?: string }, Error>> {
    const provider = this.providers.get(providerId);
    if (!provider) return err(new Error(`Provider ${providerId} not found`));
    try {
      const response = await axios.post(provider.tokenUrl, {
        client_id: provider.clientId,
        client_secret: provider.clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      });
      const data = response.data;
      return ok({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });
    } catch (error: any) {
      return err(error.response?.data?.message || new Error('OAuth exchange failed'));
    }
  }
}