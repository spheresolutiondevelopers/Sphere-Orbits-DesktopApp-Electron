import React from 'react';
import { Settings } from '@sphere/domain';
import { useTheme } from '../../../components/ThemeProvider';

interface ThemeToggleProps {
  settings?: Settings | null;
  onUpdate: (updates: Partial<Settings>) => void;
}

export function ThemeToggle({ settings, onUpdate }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="flex items-center gap-4">
      <select
        value={theme}
        onChange={(e) => {
          setTheme(e.target.value as any);
          onUpdate({ theme: e.target.value as any });
        }}
        className="bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sphere-purple"
      >
        <option value="system">System</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
      <span className="text-sm text-gray-400">
        Current: {resolvedTheme.charAt(0).toUpperCase() + resolvedTheme.slice(1)}
      </span>
    </div>
  );
}