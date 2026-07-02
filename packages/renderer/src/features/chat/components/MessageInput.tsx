import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface MessageInputProps {
  onSend: (content: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSend(content.trim());
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-white/5 p-3 bg-sphere-panel/50">
      <div className="flex items-center gap-2">
        <button type="button" className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
          <Paperclip size={18} />
        </button>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-sphere-purple"
        />
        <Button type="submit" size="sm" className="flex-shrink-0">
          <Send size={16} />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </form>
  );
}