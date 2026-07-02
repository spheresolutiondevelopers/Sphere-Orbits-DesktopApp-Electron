import React, { useState } from 'react';

export function NoteFilter() {
  const [search, setSearch] = useState('');

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search notes..."
        className="flex-1 bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-sphere-purple"
      />
    </div>
  );
}