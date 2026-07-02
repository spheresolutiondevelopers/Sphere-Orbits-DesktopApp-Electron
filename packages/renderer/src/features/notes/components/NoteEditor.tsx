import React, { useState } from 'react';
import { Note } from '@sphere/domain';
import { Button } from '../../../components/ui/Button';

interface NoteEditorProps {
  note?: Partial<Note>;
  onSave: (note: any) => void;
  onCancel: () => void;
}

export function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [form, setForm] = useState({
    title: note?.title || '',
    content: note?.content || '',
  });

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Note title..."
          className="w-full bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white text-lg font-semibold focus:outline-none focus:border-sphere-purple"
        />
      </div>
      <div>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Write your note..."
          className="w-full bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white min-h-[200px] focus:outline-none focus:border-sphere-purple"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave(form)}>Save</Button>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}