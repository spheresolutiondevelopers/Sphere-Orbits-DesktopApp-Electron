import React from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useTasks } from '../features/tasks/hooks/useTasks';
import { useMeetings } from '../features/meetings/hooks/useMeetings';
import { StatCard } from '../components/ui/StatCard';
import { TaskList } from '../features/tasks/components/TaskList';
import { AgendaBlock } from '../components/ui/AgendaBlock';

export function DashboardPage() {
  const { user } = useAuth();
  const { tasks, isLoading: tasksLoading } = useTasks(user?.userID || '');
  const { meetings, isLoading: meetingsLoading } = useMeetings(user?.userID || '');

  const pendingTasks = tasks?.filter((t) => t.status === 'pending' || t.status === 'in_progress') || [];
  const completedTasks = tasks?.filter((t) => t.status === 'completed') || [];
  const urgentTasks = tasks?.filter((t) => t.priorityLevel === 'high' || t.priorityLevel === 'critical') || [];
  const todayMeetings = meetings?.filter((m) => {
    const today = new Date().toISOString().split('T')[0];
    return m.startDateTime.startsWith(today);
  }) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, {user?.displayName || 'User'} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-1">Here's your day at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Tasks"
          value={pendingTasks.length}
          icon="📋"
          color="blue"
          trend={pendingTasks.length > 5 ? 'up' : 'down'}
          trendValue={`${pendingTasks.length} tasks`}
        />
        <StatCard
          title="Completed Today"
          value={completedTasks.length}
          icon="✅"
          color="green"
          trend="up"
          trendValue={`${Math.round((completedTasks.length / (tasks?.length || 1)) * 100)}%`}
        />
        <StatCard
          title="Urgent"
          value={urgentTasks.length}
          icon="🔥"
          color="red"
          trend={urgentTasks.length > 0 ? 'up' : 'neutral'}
          trendValue={urgentTasks.length > 0 ? 'Action needed' : 'All good'}
        />
        <StatCard
          title="Meetings Today"
          value={todayMeetings.length}
          icon="📅"
          color="purple"
          trend="neutral"
          trendValue={`${todayMeetings.length} scheduled`}
        />
      </div>

      {/* Task List & Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-sphere-panel rounded-xl p-4 border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Today's Tasks</h2>
            <button className="text-sm text-sphere-purple hover:underline">View All →</button>
          </div>
          {tasksLoading ? (
            <div className="text-gray-400 text-sm">Loading tasks...</div>
          ) : (
            <TaskList tasks={pendingTasks.slice(0, 5)} />
          )}
        </div>

        <div className="bg-sphere-panel rounded-xl p-4 border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Today's Schedule</h2>
            <button className="text-sm text-sphere-purple hover:underline">Full Calendar →</button>
          </div>
          {meetingsLoading ? (
            <div className="text-gray-400 text-sm">Loading schedule...</div>
          ) : (
            <div className="space-y-3">
              {todayMeetings.slice(0, 4).map((meeting) => (
                <AgendaBlock
                  key={meeting.meetingID}
                  time={new Date(meeting.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  title={meeting.title}
                  subtitle={meeting.meetingPlatform || 'Meeting'}
                  color="sphere-purple"
                />
              ))}
              {todayMeetings.length === 0 && (
                <div className="text-gray-400 text-sm">No meetings scheduled today</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}