import { IpcMain } from 'electron';
import { AuthRepository } from '@sphere/data';
import { TokenStore } from '@sphere/data/src/auth';
import { LoginRequestSchema, SignupRequestSchema, ValidateTokenRequestSchema } from '@sphere/shared';
import { IPC_CHANNELS } from '@sphere/shared';

export function registerAuthHandlers(
  ipcMain: IpcMain,
  authRepo: AuthRepository,
  tokenStore: TokenStore
): void {
  // Login
  ipcMain.handle(IPC_CHANNELS.AUTH_LOGIN, async (_, email: string, password: string) => {
    const result = await authRepo.login(email, password);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Logout
  ipcMain.handle(IPC_CHANNELS.AUTH_LOGOUT, async (_, token: string) => {
    const result = await authRepo.logout(token);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true };
  });

  // Validate token
  ipcMain.handle(IPC_CHANNELS.AUTH_VALIDATE, async (_, token: string) => {
    const result = await authRepo.validateToken(token);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Signup (additional handler)
  ipcMain.handle('ipc:auth:signup', async (_, input: any) => {
    const validation = SignupRequestSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, error: validation.error.message };
    }
    const { email, password, username, displayName } = validation.data;
    const result = await authRepo.signup(email, password, username, displayName);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Refresh token
  ipcMain.handle('ipc:auth:refresh', async () => {
    const refreshToken = await tokenStore.getRefreshToken();
    if (!refreshToken) {
      return { success: false, error: 'No refresh token available' };
    }
    const result = await authRepo.refreshToken(refreshToken);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Get current user
  ipcMain.handle('ipc:auth:me', async (_, token: string) => {
    const result = await authRepo.getCurrentUser(token);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });
}