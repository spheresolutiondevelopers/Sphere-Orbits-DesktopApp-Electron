import { ok, err, type Result } from '@sphere/shared';
import { Message, IChatRepository } from '@sphere/domain';
import { DatabaseClient } from '../database/DatabaseClient';
import { MessageDao } from './local/MessageDao';
import { WebSocketClient } from './websocket/WebSocketClient';

export class ChatRepository implements IChatRepository {
  private messageDao: MessageDao;
  private wsClient: WebSocketClient;
  private observers: Map<string, Set<(message: Message) => void>> = new Map();

  constructor(db: DatabaseClient, wsUrl: string) {
    this.messageDao = new MessageDao(db);
    this.wsClient = new WebSocketClient(wsUrl);

    // Listen for incoming WebSocket messages and forward to observers
    this.wsClient.onMessage((data) => {
      if (data.type === 'new_message') {
        const message = Message.fromDTO(data.payload);
        const conversationID = message.conversationID;
        const callbacks = this.observers.get(conversationID);
        if (callbacks) {
          for (const cb of callbacks) {
            cb(message);
          }
        }
        // Also persist the message locally
        this.messageDao.saveMessage(message).catch(console.error);
      }
    });
  }

  setAuthToken(token: string): void {
    this.wsClient.setAuthToken(token);
  }

  connect(): void {
    this.wsClient.connect();
  }

  disconnect(): void {
    this.wsClient.disconnect();
  }

  async sendMessage(
    conversationID: string,
    senderUserID: string,
    content: string
  ): Promise<Result<Message, Error>> {
    try {
      // Validate content
      if (!content || content.trim().length === 0) {
        return err(new Error('Message content cannot be empty'));
      }
      if (content.length > 4000) {
        return err(new Error('Message cannot exceed 4000 characters'));
      }

      // Create message object
      const messageId = randomUUID();
      const now = new Date().toISOString();
      const message = new Message(
        messageId,
        conversationID,
        senderUserID,
        content.trim(),
        now,
        false,
        null
      );

      // Save locally first (optimistic)
      await this.messageDao.saveMessage(message);

      // Send via WebSocket
      await this.wsClient.send({
        type: 'send_message',
        payload: {
          conversationID,
          content: content.trim(),
          senderUserID,
        },
      });

      return ok(message);
    } catch (error: any) {
      return err(error);
    }
  }

  async getMessages(
    conversationID: string,
    limit: number,
    before?: string
  ): Promise<Result<{ messages: Message[]; hasMore: boolean }, Error>> {
    try {
      const result = await this.messageDao.getMessages(conversationID, limit, before);
      return ok(result);
    } catch (error: any) {
      return err(error);
    }
  }

  async observeMessages(
    conversationID: string,
    callback: (message: Message) => void
  ): Promise<Result<() => void, Error>> {
    try {
      if (!this.observers.has(conversationID)) {
        this.observers.set(conversationID, new Set());
      }
      const callbacks = this.observers.get(conversationID)!;
      callbacks.add(callback);

      // Subscribe via WebSocket
      await this.wsClient.subscribe(conversationID);

      // Return cleanup function
      const cleanup = () => {
        const callbacks = this.observers.get(conversationID);
        if (callbacks) {
          callbacks.delete(callback);
          if (callbacks.size === 0) {
            this.observers.delete(conversationID);
            this.wsClient.unsubscribe(conversationID);
          }
        }
      };

      return ok(cleanup);
    } catch (error: any) {
      return err(error);
    }
  }

  async markAsRead(conversationID: string, userID: string): Promise<Result<void, Error>> {
    try {
      await this.messageDao.markAsRead(conversationID, userID);
      // Also notify via WebSocket
      await this.wsClient.send({
        type: 'mark_read',
        payload: { conversationID, userID },
      });
      return ok(undefined);
    } catch (error: any) {
      return err(error);
    }
  }
}