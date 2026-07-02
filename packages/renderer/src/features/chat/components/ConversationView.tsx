import React from 'react';
import { Message } from '@sphere/domain';

interface ConversationViewProps {
  messages: Message[];
  currentUserID: string;
}

export function ConversationView({ messages, currentUserID }: ConversationViewProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.length === 0 && (
        <div className="text-center text-gray-400 text-sm py-8">No messages yet</div>
      )}
      {messages.map((msg) => {
        const isOwn = msg.senderUserID === currentUserID;
        return (
          <div key={msg.messageID} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                isOwn
                  ? 'bg-sphere-purple text-white'
                  : 'bg-sphere-panel text-gray-200 border border-white/5'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs opacity-60 mt-1 block">
                {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}