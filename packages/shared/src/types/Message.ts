export interface Message {
  messageID: string;
  conversationID: string;
  senderUserID: string;
  content: string;
  sentAt: string;
  isRead: boolean;
  readAt?: string | null;
}