import React, { useState } from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useTasks } from '../features/tasks/hooks/useTasks';
import { TaskList } from '../features/tasks/components/TaskList';
import { TaskFilterBar } from '../features/tasks/components/TaskFilterBar';
import { Button } from '../components/ui/Button';

export function TasksPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ status: 'all', priority: 'all' });
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks(user?.userID || '');

  const filteredTasks = tasks?.filter((task) => {
    if (filters.status !== 'all' && task.status !== filters.status) return false;
    if (filters.priority !== 'all' && task.priorityLevel !== filters.priority) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Tasks</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your tasks and to-dos</p>
        </div>
        <Button onClick={() => createTask({ title: 'New Task', userID: user?.userID || '' })}>
          + New Task
        </Button>
      </div>

      <TaskFilterBar filters={filters} onFilterChange={setFilters} />

      {isLoading ? (
        <div className="text-gray-400">Loading tasks...</div>
      ) : (
        <TaskList tasks={filteredTasks || []} onUpdate={updateTask} onDelete={deleteTask} />
      )}
    </div>
  );
}