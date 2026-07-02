import React, { useState } from 'react';
import { Task } from '@sphere/domain';
import { cn } from '../../../utils';

interface TaskItemProps {
  task: Task;
  onUpdate?: (taskID: string, updates: Partial<Task>) => void;
  onDelete?: (taskID: string) => void;
}

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isCompleted, setIsCompleted] = useState(task.status === 'completed');

  const priorityColor = {
    low: 'bg-green-400',
    medium: 'bg-yellow-400',
    high: 'bg-orange-400',
    critical: 'bg-red-400',
  }[task.priorityLevel];

  const statusColor = {
    pending: 'text-yellow-400',
    in_progress: 'text-blue-400',
    completed: 'text-green-400',
    cancelled: 'text-red-400',
    deferred: 'text-gray-400',
  }[task.status];

  const handleToggleComplete = () => {
    const newStatus = isCompleted ? 'pending' : 'completed';
    setIsCompleted(!isCompleted);
    onUpdate?.(task.taskID, { status: newStatus, completionPercentage: isCompleted ? 0 : 100 });
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-sphere-darker rounded-lg border border-white/5 hover:border-white/10 transition-colors">
      <button
        onClick={handleToggleComplete}
        className={cn(
          'w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
          isCompleted
            ? 'bg-sphere-teal border-sphere-teal text-white'
            : 'border-white/20 hover:border-white/40'
        )}
      >
        {isCompleted && <span className="text-xs">✓</span>}
      </button>

      <div className="flex-1 min-w-0">
        <div className={cn('text-sm font-medium', isCompleted && 'line-through text-gray-400')}>
          {task.title}
        </div>
        {task.description && (
          <div className="text-xs text-gray-400 truncate">{task.description}</div>
        )}
        <div className="flex items-center gap-3 mt-1.5 text-xs">
          <span className={cn('font-medium', statusColor)}>{task.status}</span>
          <span className="flex items-center gap-1">
            <span className={cn('w-2 h-2 rounded-full', priorityColor)} />
            {task.priorityLevel}
          </span>
          {task.dueDate && (
            <span className="text-gray-400">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-1">
        <button
          onClick={() => onUpdate?.(task.taskID, {})}
          className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
        >
          <span className="sr-only">Edit</span>✏️
        </button>
        <button
          onClick={() => onDelete?.(task.taskID)}
          className="p-1 rounded hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
        >
          <span className="sr-only">Delete</span>🗑️
        </button>
      </div>
    </div>
  );
}