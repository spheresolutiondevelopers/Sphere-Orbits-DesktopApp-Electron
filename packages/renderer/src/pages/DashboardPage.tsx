import React from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useTasks } from '../features/tasks/hooks/useTasks';
import { useMeetings } from '../features/meetings/hooks/useMeetings';
import { useAppointments } from '../features/appointments/hooks/useAppointments';
import { OrbitHub } from '../components/ui/OrbitHub';
import { StatCard } from '../components/ui/StatCard';
import { TaskList } from '../features/tasks/components/TaskList';
import { AgendaBlock } from '../components/ui/AgendaBlock';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tasks, isLoading: tasksLoading } = useTasks(user?.userID || '');
  const { meetings, isLoading: meetingsLoading } = useMeetings(user?.userID || '');
  const { appointments, isLoading: appointmentsLoading } = useAppointments(user?.userID || '');

  const pendingTasks = tasks?.filter((t) => t.status === 'pending' || t.status === 'in_progress') || [];
  const completedTasks = tasks?.filter((t) => t.status === 'completed') || [];
  const urgentTasks = tasks?.filter((t) => t.priorityLevel === 'high' || t.priorityLevel === 'critical') || [];
  const todayMeetings = meetings?.filter((m) => {
    const today = new Date().toISOString().split('T')[0];
    return m.startDateTime.startsWith(today);
  }) || [];
  const todayAppointments = appointments?.filter((a) => {
    const today = new Date().toISOString().split('T')[0];
    return a.startDateTime.startsWith(today);
  }) || [];

  // Get current greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get a random productivity tip
  const tips = [
    '🎯 Focus Mode · Client presentation in 45 min',
    '✅ 18 of 24 tasks completed today · 75% rate',
    '📅 Sprint Planning scheduled for tomorrow 10:00 AM',
    '🔥 3 urgent tasks pending · Review recommended',
    '⏱️ 4h 20m focus time logged this week · Great work!',
    '👥 4 meetings today · Next one in 45 minutes',
  ];
  const [tipIndex, setTipIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Greeting & Ticker */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {getGreeting()}, {user?.displayName || 'User'} 👋
            </h1>
          </div>
          <div className="text-sm text-gray-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 bg-sphere-panel/30 rounded-lg px-4 py-2 border border-white/5">
          <span className="text-sphere-purple text-sm">⚡</span>
          <span className="text-sm text-gray-300 transition-all duration-500">
            {tips[tipIndex]}
          </span>
        </div>
      </div>

      {/* Two-Column Layout: Orbit Hub + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orbit Hub - Takes 2/3 on desktop */}
        <div className="lg:col-span-2 bg-sphere-panel rounded-2xl border border-white/5 p-6">
          <OrbitHub />
        </div>

        {/* Stats Panel - Takes 1/3 on desktop */}
        <div className="bg-gradient-to-br from-sphere-purple/10 via-sphere-panel to-sphere-teal/5 rounded-2xl border border-sphere-purple/20 p-6 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Today at a Glance</h3>

          {/* Tasks Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sphere-purple/20 flex items-center justify-center text-sphere-purple">
                  <span className="text-sm">📋</span>
                </div>
                <span className="text-sm font-medium text-white">Tasks</span>
              </div>
              <span className="text-xl font-bold text-white">{tasks?.length || 0}</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Completed</span>
                <span className="text-sphere-teal font-medium">{completedTasks.length} done</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Urgent</span>
                <span className="text-sphere-coral font-medium">{urgentTasks.length} pending</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">In Progress</span>
                <span className="text-yellow-400 font-medium">{tasks?.filter(t => t.status === 'in_progress').length || 0} active</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-gradient-to-r from-sphere-purple to-sphere-pink rounded-full transition-all duration-500"
                  style={{ width: `${tasks?.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 my-3" />

          {/* Meetings Section */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sphere-teal/20 flex items-center justify-center text-sphere-teal">
                  <span className="text-sm">🎥</span>
                </div>
                <span className="text-sm font-medium text-white">Meetings</span>
              </div>
              <span className="text-xl font-bold text-white">{todayMeetings.length}</span>
            </div>
            <div className="space-y-1.5">
              {todayMeetings.slice(0, 4).map((meeting) => (
                <div key={meeting.meetingID} className="flex justify-between text-sm items-center">
                  <span className="text-gray-300 truncate max-w-[120px]">{meeting.title}</span>
                  <span className="text-gray-400 text-xs">
                    {new Date(meeting.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {todayMeetings.length === 0 && (
                <div className="text-gray-400 text-sm">No meetings today</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Week Strip */}
      <div className="bg-sphere-panel rounded-2xl border border-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">This Week</h3>
          <button
            onClick={() => navigate('/calendar')}
            className="text-sm text-sphere-purple hover:text-sphere-teal transition-colors"
          >
            Full Calendar →
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['MON 23', 'TUE 24', 'WED 25', 'THU 26', 'FRI 27', 'SAT 28', 'SUN 29'].map((day, i) => {
            const isToday = i === 2; // Wednesday is today
            const hasEvents = [0, 1, 2, 3, 4].includes(i);
            return (
              <div
                key={day}
                className={`flex-shrink-0 min-w-[60px] rounded-xl p-3 text-center transition-all cursor-pointer hover:scale-105 ${
                  isToday
                    ? 'bg-gradient-to-br from-sphere-purple to-sphere-pink text-white shadow-lg shadow-sphere-purple/30'
                    : 'bg-sphere-darker/50 border border-white/5 text-gray-400 hover:border-white/20'
                }`}
              >
                <div className={`text-xs font-medium ${isToday ? 'text-white/80' : 'text-gray-500'}`}>
                  {day.split(' ')[0]}
                </div>
                <div className={`text-lg font-bold ${isToday ? 'text-white' : 'text-white'}`}>
                  {day.split(' ')[1]}
                </div>
                {hasEvents && (
                  <div className="flex justify-center gap-1 mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white/70' : 'bg-sphere-purple'}`} />
                    {i === 1 && <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white/70' : 'bg-sphere-teal'}`} />}
                    {i === 2 && <div className="w-1.5 h-1.5 rounded-full bg-white/70" />}
                    {i === 2 && <div className="w-1.5 h-1.5 rounded-full bg-white/70" />}
                    {i === 3 && <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white/70' : 'bg-yellow-400'}`} />}
                    {i === 4 && <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white/70' : 'bg-sphere-purple'}`} />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom: Today's Tasks + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <div className="bg-sphere-panel rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Today's Tasks</h3>
            <button
              onClick={() => navigate('/tasks')}
              className="text-sm text-sphere-purple hover:text-sphere-teal transition-colors"
            >
              View All →
            </button>
          </div>
          {tasksLoading ? (
            <div className="text-gray-400 text-sm">Loading tasks...</div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.slice(0, 4).map((task) => (
                <div key={task.taskID} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    task.status === 'completed'
                      ? 'bg-sphere-teal border-sphere-teal text-white'
                      : 'border-white/20 hover:border-white/40 cursor-pointer'
                  }`}>
                    {task.status === 'completed' && <span className="text-xs">✓</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-white'}`}>
                      {task.title}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs">
                      <span className="text-gray-400">{task.dueDate ? new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No time'}</span>
                      {task.locationName && (
                        <span className="text-gray-500">📍 {task.locationName}</span>
                      )}
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${
                    task.priorityLevel === 'high' || task.priorityLevel === 'critical'
                      ? 'bg-red-400'
                      : task.priorityLevel === 'medium'
                      ? 'bg-yellow-400'
                      : 'bg-green-400'
                  }`} />
                </div>
              ))}
              {pendingTasks.length === 0 && (
                <div className="text-gray-400 text-sm">All tasks completed! 🎉</div>
              )}
            </div>
          )}
        </div>

        {/* Today's Schedule */}
        <div className="bg-sphere-panel rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Today's Schedule</h3>
            <button
              onClick={() => navigate('/calendar')}
              className="text-sm text-sphere-purple hover:text-sphere-teal transition-colors"
            >
              Calendar →
            </button>
          </div>
          {meetingsLoading || appointmentsLoading ? (
            <div className="text-gray-400 text-sm">Loading schedule...</div>
          ) : (
            <div className="space-y-3">
              {todayMeetings.slice(0, 3).map((meeting) => (
                <AgendaBlock
                  key={meeting.meetingID}
                  time={new Date(meeting.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  title={meeting.title}
                  subtitle={meeting.meetingPlatform || 'Meeting'}
                  color="sphere-teal"
                />
              ))}
              {todayAppointments.slice(0, 2).map((appt) => (
                <AgendaBlock
                  key={appt.appointmentID}
                  time={new Date(appt.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  title={appt.title}
                  subtitle={appt.location || 'Appointment'}
                  color="sphere-purple"
                />
              ))}
              {todayMeetings.length === 0 && todayAppointments.length === 0 && (
                <div className="text-gray-400 text-sm">No meetings or appointments scheduled today</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}