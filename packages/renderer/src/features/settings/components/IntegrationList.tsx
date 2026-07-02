import React from 'react';
import { Settings } from '@sphere/domain';

interface IntegrationListProps {
  settings?: Settings | null;
  onUpdate: (updates: Partial<Settings>) => void;
}

export function IntegrationList({ settings, onUpdate }: IntegrationListProps) {
  const integrations = [
    { key: 'googleCalendarSync', label: 'Google Calendar', enabled: settings?.googleCalendarSync || false },
    { key: 'outlookCalendarSync', label: 'Outlook Calendar', enabled: settings?.outlookCalendarSync || false },
    { key: 'appleCalendarSync', label: 'Apple Calendar', enabled: settings?.appleCalendarSync || false },
  ];

  return (
    <div className="space-y-3">
      {integrations.map(({ key, label, enabled }) => (
        <div key={key} className="flex items-center justify-between p-3 bg-sphere-darker rounded-lg border border-white/5">
          <span className="text-sm text-white">{label}</span>
          <button
            onClick={() => onUpdate({ [key]: !enabled })}
            className={`relative w-10 h-6 rounded-full transition-colors ${
              enabled ? 'bg-sphere-purple' : 'bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                enabled ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );
}