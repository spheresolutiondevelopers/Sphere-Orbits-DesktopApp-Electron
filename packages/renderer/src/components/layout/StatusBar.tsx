import React, { useEffect, useState } from 'react';
import { Circle, Cloud, CheckCircle, Video, CalendarDay, Clock } from 'lucide-react';

export function StatusBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="h-8 border-t border-white/5 bg-sphere-panel/60 flex items-center px-4 text-xs text-gray-400 gap-4 flex-shrink-0">
      <div className="flex items-center gap-2">
        <Circle size={8} className="fill-green-400 text-green-400" />
        <span>Online</span>
      </div>
      <span className="w-px h-4 bg-white/5" />
      <div className="flex items-center gap-2">
        <Cloud size={14} />
        <span>Synced</span>
      </div>
      <span className="w-px h-4 bg-white/5" />
      <div className="flex items-center gap-2">
        <CheckCircle size={14} />
        <span>5 tasks pending</span>
      </div>
      <span className="w-px h-4 bg-white/5" />
      <div className="flex items-center gap-2">
        <Video size={14} />
        <span>2 meetings today</span>
      </div>
      <span className="w-px h-4 bg-white/5" />
      <div className="flex items-center gap-2 ml-auto">
        <CalendarDay size={14} />
        <span>{time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
      <span className="w-px h-4 bg-white/5" />
      <div className="flex items-center gap-2">
        <Clock size={14} />
        <span>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </footer>
  );
}