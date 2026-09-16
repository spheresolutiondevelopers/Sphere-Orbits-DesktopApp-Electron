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
    // Ellipse dimensions: wider than tall
    const a = W * 0.42; // horizontal radius
    const b = H * 0.40; // vertical radius

    let rafId: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // ── Orbit ring (dashed) ──
      ctx.beginPath();
      ctx.ellipse(cx, cy, a, b, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(124,108,248,0.2)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 10]);
      ctx.stroke();
      ctx.setLineDash([]);

      // ── Connecting lines from center to each planet ──
      planets.forEach((_, i) => {
        const theta = angle + (i / planets.length) * Math.PI * 2 + Math.PI / 2;
        const x = cx + a * Math.cos(theta);
        const y = cy + b * Math.sin(theta);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'rgba(124,108,248,0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // ── Draw planets ──
      planets.forEach((p, i) => {
        const theta = angle + (i / planets.length) * Math.PI * 2 + Math.PI / 2;
        const x = cx + a * Math.cos(theta);
        const y = cy + b * Math.sin(theta);
        const isSelected = i === selectedIndex;

        // Glow (larger when selected)
        const glowRadius = isSelected ? 32 : 22;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        grad.addColorStop(0, p.color + '40');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Planet ball
        const ballRadius = isSelected ? 20 : 16;
        const grad2 = ctx.createRadialGradient(x - 6, y - 6, 2, x, y, ballRadius);
        grad2.addColorStop(0, '#ffffff40');
        grad2.addColorStop(0.3, p.color);
        grad2.addColorStop(1, p.color + 'aa');
        ctx.fillStyle = grad2;
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Icon (emoji)
        ctx.font = `${isSelected ? 18 : 14}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.fillText(p.icon, x, y);

        // Label below planet
        ctx.font = `${isSelected ? '10px' : '9px'} Inter, sans-serif`;
        ctx.fillStyle = isSelected ? 'white' : 'rgba(255,255,255,0.5)';
        ctx.textBaseline = 'top';
        ctx.fillText(p.label, x, y + ballRadius + 6);
      });

      // ── Center sphere with "SPHERE" text ──
      const centerRadius = 32;
      // Glow
      const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50);
      centerGlow.addColorStop(0, 'rgba(124,108,248,0.12)');
      centerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = centerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 50, 0, Math.PI * 2);
      ctx.fill();

      // Blue sphere
      const grad3 = ctx.createRadialGradient(cx - 10, cy - 10, 2, cx, cy, centerRadius);
      grad3.addColorStop(0, '#4CC9F0');
      grad3.addColorStop(0.4, '#1A6B8A');
      grad3.addColorStop(1, '#0A2A3A');
      ctx.fillStyle = grad3;
      ctx.beginPath();
      ctx.arc(cx, cy, centerRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(76,201,240,0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // "SPHERE" text on sphere
      ctx.font = 'bold 12px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('SPHERE', cx, cy - 1);
      ctx.shadowBlur = 0;

      // Small shine on sphere
      const shine = ctx.createRadialGradient(cx - 12, cy - 12, 0, cx - 8, cy - 8, 16);
      shine.addColorStop(0, 'rgba(255,255,255,0.3)');
      shine.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = shine;
      ctx.beginPath();
      ctx.arc(cx - 8, cy - 8, 16, 0, Math.PI * 2);
      ctx.fill();

      // ── Animate rotation ──
      setAngle((a) => a + 0.003);
      rafId = requestAnimationFrame(draw);
    };

    draw();

    // ── Click handler ──
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      let minDist = Infinity;
      let minIdx = -1;

      planets.forEach((_, i) => {
        const theta = angle + (i / planets.length) * Math.PI * 2 + Math.PI / 2;
        const x = cx + a * Math.cos(theta);
        const y = cy + b * Math.sin(theta);
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

  // ── Description bar below orbit ──
  return (
    <div className="w-full">
      <div className="relative w-full aspect-[4/3] max-w-[500px] mx-auto">
        <canvas ref={canvasRef} width={500} height={375} className="w-full h-full" />
      </div>
      <div className="mt-4 flex items-center justify-center gap-3 px-4 py-2 border border-white/5 rounded-xl bg-transparent hover:border-sphere-purple/30 transition-colors cursor-pointer">
        <span className="text-xl">{planets[selectedIndex].icon}</span>
        <div className="flex-1">
          <div className="text-sm font-bold text-white">{planets[selectedIndex].label}</div>
          <div className="text-xs text-gray-400">{planets[selectedIndex].description}</div>
        </div>
        <span className="text-gray-500 text-sm">→</span>
      </div>
    </div>
  );
}