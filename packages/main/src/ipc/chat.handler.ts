import { IpcMain } from 'electron';
import { ChatRepository } from '@sphere/data';
import { IPC_CHANNELS } from '@sphere/shared';

export function registerChatHandlers(ipcMain: IpcMain, chatRepo: ChatRepository): void {
  // Send message
  ipcMain.handle(IPC_CHANNELS.CHAT_SEND, async (_, conversationID: string, senderUserID: string, content: string) => {
    const result = await chatRepo.sendMessage(conversationID, senderUserID, content);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Get messages
  ipcMain.handle(IPC_CHANNELS.CHAT_GET_MESSAGES, async (_, conversationID: string, limit: number, before?: string) => {
    const result = await chatRepo.getMessages(conversationID, limit, before);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Observe messages (WebSocket connection is managed by the renderer)
  ipcMain.handle(IPC_CHANNELS.CHAT_OBSERVE, async (_, conversationID: string) => {
    // This is a no-op on the main process side; the renderer handles WebSocket directly
    // But we'll keep the handler for consistency
    return { success: true, data: { connected: true } };
  });

  // Mark as read
  ipcMain.handle('ipc:chat:markRead', async (_, conversationID: string, userID: string) => {
    const result = await chatRepo.markAsRead(conversationID, userID);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true };
  });
}