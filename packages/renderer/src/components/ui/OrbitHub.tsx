import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Planet {
  id: string;
  label: string;
  icon: string;
  color: string;
  path: string;
  description: string;
}

const planets: Planet[] = [
  { id: 'tasks', label: 'Tasks', icon: '✅', color: '#7C6CF8', path: '/tasks', description: '24 total · 18 done · 3 urgent pending' },
  { id: 'meetings', label: 'Meetings', icon: '👥', color: '#2DD4A0', path: '/meetings', description: '4 meetings today' },
  { id: 'calendar', label: 'Calendar', icon: '📅', color: '#FF6B8A', path: '/calendar', description: '3 events this week' },
  { id: 'reminders', label: 'Reminders', icon: '⏰', color: '#FFD166', path: '/reminders', description: '2 reminders active' },
  { id: 'analytics', label: 'Analytics', icon: '📊', color: '#22D3EE', path: '/analytics', description: '92% productivity' },
  { id: 'alerts', label: 'Alerts', icon: '🔔', color: '#F472B6', path: '/alerts', description: '5 unread notifications' },
  { id: 'ai', label: 'AI Assist', icon: '🤖', color: '#C084FC', path: '/ai', description: '3 suggestions ready' },
  { id: 'appointments', label: 'Appointments', icon: '📋', color: '#FB923C', path: '/appointments', description: '5 appointments' },
  { id: 'notes', label: 'Notes', icon: '📝', color: '#34D399', path: '/notes', description: '12 saved notes' },
  { id: 'events', label: 'Events', icon: '🎉', color: '#818CF8', path: '/events', description: '2 upcoming events' },
];

export function OrbitHub() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const radius = Math.min(W, H) * 0.38;

    let rafId: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Draw orbit ring
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * 0.9, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(124,108,248,0.15)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw connecting lines
      planets.forEach((_, i) => {
        const a = angle + (i / planets.length) * Math.PI * 2;
        const x = cx + radius * Math.cos(a);
        const y = cy + radius * 0.9 * Math.sin(a);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'rgba(124,108,248,0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw planets
      planets.forEach((p, i) => {
        const a = angle + (i / planets.length) * Math.PI * 2;
        const x = cx + radius * Math.cos(a);
        const y = cy + radius * 0.9 * Math.sin(a);
        const isSelected = i === selectedIndex;

        // Glow
        const grad = ctx.createRadialGradient(x, y, 0, x, y, isSelected ? 28 : 18);
        grad.addColorStop(0, p.color + '40');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, isSelected ? 28 : 18, 0, Math.PI * 2);
        ctx.fill();

        // Ball
        const grad2 = ctx.createRadialGradient(x - 6, y - 6, 2, x, y, 16);
        grad2.addColorStop(0, '#ffffff30');
        grad2.addColorStop(0.4, p.color);
        grad2.addColorStop(1, p.color + 'aa');
        ctx.fillStyle = grad2;
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Icon
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.fillText(p.icon, x, y);

        // Label
        ctx.font = '9px Inter, sans-serif';
        ctx.fillStyle = isSelected ? 'white' : 'rgba(255,255,255,0.5)';
        ctx.textBaseline = 'top';
        ctx.fillText(p.label, x, y + 20);
      });

      // Update angle
      setAngle((a) => a + 0.002);
      rafId = requestAnimationFrame(draw);
    };

    draw();

    // Click handler
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      let minDist = Infinity;
      let minIdx = -1;

      planets.forEach((_, i) => {
        const a = angle + (i / planets.length) * Math.PI * 2;
        const x = cx + radius * Math.cos(a);
        const y = cy + radius * 0.9 * Math.sin(a);
        const dist = Math.hypot(mx - x, my - y);
        if (dist < 30 && dist < minDist) {
          minDist = dist;
          minIdx = i;
        }
      });

      if (minIdx !== -1) {
        setSelectedIndex(minIdx);
        navigate(planets[minIdx].path);
      }
    };

    canvas.addEventListener('click', handleClick);
    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('click', handleClick);
    };
  }, [angle, navigate, selectedIndex]);

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto">
      <canvas ref={canvasRef} width={400} height={380} className="w-full h-full" />
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <div className="text-xs text-gray-400">
          <span className="font-bold text-white">{planets[selectedIndex].icon}</span>
          {' '}{planets[selectedIndex].label}
          <span className="ml-2 text-gray-500">{planets[selectedIndex].description}</span>
        </div>
      </div>
    </div>
  );
}