import React from 'react';

interface AgendaBlockProps {
  time: string;
  title: string;
  subtitle?: string;
  color?: string;
}

export function AgendaBlock({ time, title, subtitle, color = 'sphere-purple' }: AgendaBlockProps) {
  return (
    <div className="flex gap-4 items-start">
      <div className="text-right min-w-[60px]">
        <div className="text-sm font-medium text-gray-400">{time}</div>
      </div>
      <div className="w-px bg-white/10 h-full self-stretch" />
      <div className="flex-1 bg-sphere-darker rounded-lg p-3 border-l-4" style={{ borderColor: `var(--${color})` }}>
        <div className="font-medium text-white text-sm">{title}</div>
        {subtitle && <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>}
      </div>
    </div>
  );
}