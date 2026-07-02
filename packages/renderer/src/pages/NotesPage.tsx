import React, { useState } from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useNotes } from '../features/notes/hooks/useNotes';
import { NoteCard } from '../features/notes/components/NoteCard';
import { NoteEditor } from '../features/notes/components/NoteEditor';
import { NoteFilter } from '../features/notes/components/NoteFilter';
import { Button } from '../components/ui/Button';

export function NotesPage() {
  const { user } = useAuth();
  const [editingNote, setEditingNote] = useState<any>(null);
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes(user?.userID || '');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Notes</h1>
          <p className="text-sm text-gray-400 mt-1">Capture and organize your thoughts</p>
        </div>
        <Button onClick={() => setEditingNote({})}>+ New Note</Button>
      </div>

      <NoteFilter />

      {editingNote && (
        <div className="bg-sphere-panel rounded-xl p-4 border border-white/10">
          <NoteEditor
            note={editingNote}
            onSave={(note) => {
              if (note.noteID) {
                updateNote(note);
              } else {
                createNote({ ...note, userID: user?.userID || '' });
              }
              setEditingNote(null);
            }}
            onCancel={() => setEditingNote(null)}
          />
        </div>
      )}

      {isLoading ? (
        <div className="text-gray-400">Loading notes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes?.map((note) => (
            <NoteCard
              key={note.noteID}
              note={note}
              onEdit={() => setEditingNote(note)}
              onDelete={() => deleteNote(note.noteID)}
            />
          ))}
          {(!notes || notes.length === 0) && (
            <div className="col-span-3 text-gray-400 text-center py-8">No notes yet. Create your first note!</div>
          )}
        </div>
      )}
    </div>
  );
}