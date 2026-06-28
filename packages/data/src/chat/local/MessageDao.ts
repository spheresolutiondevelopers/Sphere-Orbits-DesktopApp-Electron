import { DatabaseClient } from '../../database/DatabaseClient';
import { Message } from '@sphere/domain';

export class MessageDao {
  constructor(private readonly db: DatabaseClient) {}

  /**
   * Saves a message to the local database.
   */
  async saveMessage(message: Message): Promise<void> {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO messages (
        id, conversation_id, sender_user_id, content, sent_at, is_read, read_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      message.messageID,
      message.conversationID,
      message.senderUserID,
      message.content,
      message.sentAt,
      message.isRead ? 1 : 0,
      message.readAt || null
    );
  }

  /**
   * Gets messages from a conversation with pagination.
   */
  getMessages(
    conversationID: string,
    limit: number,
    before?: string
  ): Promise<{ messages: Message[]; hasMore: boolean }> {
    return this.db.transaction((db) => {
      let sql = `
        SELECT
          id, conversation_id, sender_user_id, content, sent_at, is_read, read_at
        FROM messages
        WHERE conversation_id = ?
      `;
      const params: any[] = [conversationID];

      if (before) {
        sql += ' AND sent_at < ?';
        params.push(before);
      }

      sql += ` ORDER BY sent_at DESC LIMIT ?`;
      params.push(limit + 1); // Fetch one extra to check if there are more

      const stmt = db.prepare(sql);
      const rows = stmt.all(...params) as any[];
      const messages = rows.slice(0, limit).map(this.mapRowToMessage);
      const hasMore = rows.length > limit;

      return { messages, hasMore };
    });
  }

  /**
   * Gets a single message by ID.
   */
  getMessageById(messageID: string): Message | null {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      SELECT id, conversation_id, sender_user_id, content, sent_at, is_read, read_at
      FROM messages
      WHERE id = ?
    `);
    const row = stmt.get(messageID) as any;
    if (!row) return null;
    return this.mapRowToMessage(row);
  }

  /**
   * Marks all messages in a conversation as read for a user.
   */
  markAsRead(conversationID: string, userID: string): void {
    const db = this.db.getDB();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE messages
      SET is_read = 1, read_at = ?
      WHERE conversation_id = ?
        AND sender_user_id != ?
        AND is_read = 0
    `);
    stmt.run(now, conversationID, userID);
  }

  /**
   * Deletes a message.
   */
  deleteMessage(messageID: string): void {
    const db = this.db.getDB();
    const stmt = db.prepare('DELETE FROM messages WHERE id = ?');
    stmt.run(messageID);
  }

  /**
   * Maps a database row to a Message object.
   */
  private mapRowToMessage(row: any): Message {
    return new Message(
      row.id,
      row.conversation_id,
      row.sender_user_id,
      row.content,
      row.sent_at,
      row.is_read === 1,
      row.read_at || null
    );
  }
}