import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeProvider';
import { Search, Bell, RefreshCw, Moon, Sun } from 'lucide-react';

export function TopBar() {
  const navigate = useNavigate();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [search, setSearch] = useState('');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark');
  };

  return (
    <header className="h-14 border-b border-white/5 bg-sphere-panel/80 backdrop-blur-sm flex items-center px-6 gap-4 flex-shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-white">Sphere</h1>
        <p className="text-xs text-gray-400 -mt-0.5">Desktop</p>
      </div>

      <div className="flex-1 max-w-md mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks, meetings…"
          className="w-full bg-sphere-darker border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-sphere-purple"
        />
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
          <Bell size={18} />
        </button>
        <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
          <RefreshCw size={18} />
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
        >
          {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
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