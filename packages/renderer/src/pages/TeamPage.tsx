import React from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';

export function TeamPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Team</h1>
        <p className="text-sm text-gray-400 mt-1">Collaborate with your team members</p>
      </div>

      <div className="bg-sphere-panel rounded-xl p-8 border border-white/5 text-center">
        <div className="text-5xl mb-4">👥</div>
        <h3 className="text-lg font-semibold text-white mb-2">Team Collaboration</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          This feature is coming soon. Manage your team, share schedules, and collaborate in real time.
        </p>
      </div>
    </div>
  );
}