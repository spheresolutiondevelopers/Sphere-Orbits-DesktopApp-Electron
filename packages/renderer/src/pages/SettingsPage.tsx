import React from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useSettings } from '../features/settings/hooks/useSettings';
import { ProfileForm } from '../features/settings/components/ProfileForm';
import { ThemeToggle } from '../features/settings/components/ThemeToggle';
import { IntegrationList } from '../features/settings/components/IntegrationList';
import { Button } from '../components/ui/Button';

export function SettingsPage() {
  const { user } = useAuth();
  const { settings, updateSettings, isLoading } = useSettings(user?.userID || '');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your account and preferences</p>
      </div>

      {isLoading ? (
        <div className="text-gray-400">Loading settings...</div>
      ) : (
        <>
          <div className="bg-sphere-panel rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-white mb-4">Profile</h2>
            <ProfileForm user={user} />
          </div>

          <div className="bg-sphere-panel rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-white mb-4">Appearance</h2>
            <ThemeToggle settings={settings} onUpdate={updateSettings} />
          </div>

          <div className="bg-sphere-panel rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-white mb-4">Integrations</h2>
            <IntegrationList settings={settings} onUpdate={updateSettings} />
          </div>

          <div className="bg-sphere-panel rounded-xl p-6 border border-white/5 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-white">Account</h3>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
            <Button variant="danger" size="sm">Sign Out</Button>
          </div>
        </>
      )}
    </div>
  );
}