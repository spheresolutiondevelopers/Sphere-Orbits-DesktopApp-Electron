import React, { useState } from 'react';
import { User } from '@sphere/domain';
import { Button } from '../../../components/ui/Button';

interface ProfileFormProps {
  user?: User | null;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [form, setForm] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Update profile
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Display Name</label>
        <input
          type="text"
          value={form.displayName}
          onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          className="w-full bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sphere-purple"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sphere-purple"
          disabled
        />
        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
      </div>
      <Button type="submit">Update Profile</Button>
    </form>
  );
}