import React from 'react';
import { Note } from '@sphere/domain';
import { Pencil, Trash2 } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  return (
    <div className="bg-sphere-panel rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors group">
      <div className="flex justify-between items-start">
        {note.title ? (
          <h3 className="font-semibold text-white">{note.title}</h3>
        ) : (
          <span className="text-sm text-gray-400">Untitled</span>
        )}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-300 mt-2 line-clamp-3 whitespace-pre-wrap">
        {note.content}
      </div>

      <div className="mt-3 text-xs text-gray-400">
        {new Date(note.createdAt).toLocaleDateString()} at{' '}
        {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}