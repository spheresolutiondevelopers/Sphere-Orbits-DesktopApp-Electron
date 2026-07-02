import React from 'react';
import { Task } from '@sphere/domain';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onUpdate?: (taskID: string, updates: Partial<Task>) => void;
  onDelete?: (taskID: string) => void;
}

export function TaskList({ tasks, onUpdate, onDelete }: TaskListProps) {
  if (!tasks || tasks.length === 0) {
    return <div className="text-gray-400 text-sm">No tasks found</div>;
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.taskID} task={task} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  );
}