import { useState, useEffect } from 'react';
import { Note } from '@sphere/domain';

export function useNotes(userID: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    if (!userID) return;
    setIsLoading(true);
    try {
      const result = await window.electronAPI.getNotes(userID);
      if (result.success) {
        setNotes(result.data.items || []);
      } else {
        setError(result.error || 'Failed to fetch notes');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async (noteData: any) => {
    try {
      const result = await window.electronAPI.createNote(noteData);
      if (result.success) {
        setNotes((prev) => [result.data, ...prev]);
        return result.data;
      }
      throw new Error(result.error);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateNote = async (noteID: string, updates: Partial<Note>) => {
    try {
      const result = await window.electronAPI.updateNote(noteID, updates);
      if (result.success) {
        setNotes((prev) => prev.map((n) => (n.noteID === noteID ? result.data : n)));
        return result.data;
      }
      throw new Error(result.error);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteNote = async (noteID: string) => {
    try {
      const result = await window.electronAPI.deleteNote(noteID, userID);
      if (result.success) {
        setNotes((prev) => prev.filter((n) => n.noteID !== noteID));
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [userID]);

  return {
    notes,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  };
}