import React, { useState } from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useChat } from '../features/chat/hooks/useChat';
import { ChatList } from '../features/chat/components/ChatList';
import { ConversationView } from '../features/chat/components/ConversationView';
import { MessageInput } from '../features/chat/components/MessageInput';

export function ChatPage() {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { messages, sendMessage, isLoading } = useChat(selectedConversationId || '');

  return (
    <div className="flex h-[calc(100vh-10rem)]">
      <div className="w-80 border-r border-white/10 flex-shrink-0 overflow-hidden">
        <ChatList onSelectConversation={setSelectedConversationId} selectedId={selectedConversationId} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedConversationId ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoading ? (
                <div className="text-gray-400">Loading messages...</div>
              ) : (
                messages?.map((msg) => (
                  <div
                    key={msg.messageID}
                    className={`flex ${msg.senderUserID === user?.userID ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        msg.senderUserID === user?.userID
                          ? 'bg-sphere-purple text-white'
                          : 'bg-sphere-panel text-gray-200'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <span className="text-xs opacity-60 mt-1 block">
                        {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <MessageInput onSend={(content) => sendMessage(content)} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}