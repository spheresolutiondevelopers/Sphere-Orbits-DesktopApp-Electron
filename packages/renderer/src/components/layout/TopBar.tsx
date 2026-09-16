import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeProvider';
import { Search, Bell, RefreshCw, Moon, Sun, Monitor } from 'lucide-react';

export function TopBar() {
  const navigate = useNavigate();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [search, setSearch] = useState('');

  // ── Cycle theme: dark → light → system → dark ──
  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  // ── Choose icon based on current theme ──
  const getThemeIcon = () => {
    if (theme === 'system') return <Monitor size={18} />;
    if (resolvedTheme === 'dark') return <Sun size={18} />;
    return <Moon size={18} />;
  };

  // ── Label for tooltip ──
  const getThemeLabel = () => {
    if (theme === 'system') return 'System';
    if (resolvedTheme === 'dark') return 'Light';
    return 'Dark';
  };

  return (
    <header className="h-14 border-b border-theme bg-theme-card/80 backdrop-blur-sm flex items-center px-6 gap-4 flex-shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-theme">Sphere</h1>
        <p className="text-xs text-theme-3 -mt-0.5">Desktop</p>
      </div>

      <div className="flex-1 max-w-md mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-3" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks, meetings…"
          className="w-full bg-theme-2 border border-theme rounded-lg pl-9 pr-4 py-1.5 text-sm text-theme placeholder-theme-3 focus:outline-none focus:border-sphere-purple"
        />
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-theme-2 text-theme-3 hover:text-theme transition-colors">
          <Bell size={18} />
        </button>
        <button className="p-2 rounded-lg hover:bg-theme-2 text-theme-3 hover:text-theme transition-colors">
          <RefreshCw size={18} />
        </button>
        <button
          onClick={cycleTheme}
          className="p-2 rounded-lg hover:bg-theme-2 text-theme-3 hover:text-theme transition-colors flex items-center gap-1.5"
          title={`Theme: ${getThemeLabel()}`}
        >
          {getThemeIcon()}
          <span className="text-xs hidden sm:inline">{getThemeLabel()}</span>
        </button>
        <div
          onClick={() => navigate('/settings')}
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-sphere-purple to-sphere-pink flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:opacity-80 transition-opacity"
        >
          F
        </div>
      </div>
    </header>
  );
}