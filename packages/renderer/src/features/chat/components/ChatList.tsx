import React, { useState, useEffect } from 'react';

interface ChatListProps {
  onSelectConversation: (id: string) => void;
  selectedId: string | null;
}

// Mock conversations
const mockConversations = [
  { id: '1', name: 'Alice Wanjiku', lastMessage: 'Can you share the event details?', timestamp: '12:34', unread: 2, online: true },
  { id: '2', name: 'James Kamau', lastMessage: '✅ Task completed', timestamp: '11:58', unread: 0, online: true },
  { id: '3', name: 'Mary Otieno', lastMessage: '📅 Shared: Q3 Marketing Roadshow', timestamp: '10:22', unread: 5, online: false },
  { id: '4', name: 'Brian Ochieng', lastMessage: 'See you at the sprint review!', timestamp: 'Yesterday', unread: 0, online: true },
];

export function ChatList({ onSelectConversation, selectedId }: ChatListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/5">
        <h2 className="font-semibold text-white">Chats</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {mockConversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelectConversation(conv.id)}
            className={`w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors ${
              selectedId === conv.id ? 'bg-white/5' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-sphere-purple/20 flex items-center justify-center text-white font-semibold">
                {conv.name.charAt(0)}
              </div>
              {conv.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-sphere-darker" />
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex justify-between items-center">
                <span className="font-medium text-white text-sm truncate">{conv.name}</span>
                <span className="text-xs text-gray-400 flex-shrink-0">{conv.timestamp}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 truncate">{conv.lastMessage}</span>
                {conv.unread > 0 && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-sphere-purple text-white text-[10px] flex items-center justify-center flex-shrink-0">
                    {conv.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}