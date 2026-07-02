import { useState, useEffect, useCallback } from 'react';
import { Message } from '@sphere/domain';

export function useChat(conversationID: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const sendMessage = async (content: string) => {
    try {
      const result = await window.electronAPI.sendMessage(conversationID, content);
      if (result.success) {
        setMessages((prev) => [...prev, result.data]);
        return result.data;
      }
      throw new Error(result.error);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!conversationID) return;
    setIsLoading(true);
    try {
      const result = await window.electronAPI.getMessages(conversationID, 50);
      if (result.success) {
        setMessages(result.data.messages || []);
        setIsConnected(true);
      } else {
        setError(result.error || 'Failed to fetch messages');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [conversationID]);

  const markAsRead = async () => {
    try {
      await window.electronAPI.markMessagesRead(conversationID);
    } catch (err) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchMessages();
    // Observe new messages
    const cleanup = window.electronAPI.observeMessages(conversationID, (message: Message) => {
      setMessages((prev) => [...prev, message]);
      markAsRead();
    });
    return () => {
      if (cleanup && typeof cleanup === 'function') cleanup();
    };
  }, [conversationID, fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    isConnected,
    sendMessage,
    fetchMessages,
    markAsRead,
  };
}