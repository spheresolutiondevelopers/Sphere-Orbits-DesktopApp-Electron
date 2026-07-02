import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  CheckSquare, 
  Calendar, 
  Video, 
  Clock, 
  CalendarDays,
  ChartLine, 
  Users, 
  MessageSquare, 
  StickyNote, 
  Settings, 
  LogOut 
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks', badge: '5' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/meetings', icon: Video, label: 'Meetings', badge: '2' },
  { path: '/appointments', icon: Clock, label: 'Appointments' },
  { path: '/events', icon: CalendarDays, label: 'Events', badge: '8' },
  { path: '/analytics', icon: ChartLine, label: 'Analytics' },
  { path: '/team', icon: Users, label: 'Team' },
  { path: '/chat', icon: MessageSquare, label: 'Chat', badge: '3' },
  { path: '/notes', icon: StickyNote, label: 'Notes' },
];

export function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-14 bg-sphere-panel border-r border-white/5 flex flex-col items-center py-4 gap-2">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sphere-purple to-sphere-pink flex items-center justify-center text-white font-bold text-sm mb-4">
        S
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                isActive ? 'bg-sphere-purple/20 text-sphere-purple' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon size={20} />
            {item.badge && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[8px] font-bold bg-sphere-purple text-white rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
            <span className="sr-only">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => navigate('/settings')}
        className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        <Settings size={20} />
        <span className="sr-only">Settings</span>
      </button>

      <button
        onClick={() => {/* handle logout */}}
        className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
      >
        <LogOut size={20} />
        <span className="sr-only">Logout</span>
      </button>
    </aside>
  );
}