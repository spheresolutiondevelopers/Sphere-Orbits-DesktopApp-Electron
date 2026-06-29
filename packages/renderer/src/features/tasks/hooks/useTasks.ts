import { useState, useEffect } from 'react';
import { Task } from '@sphere/domain';

export function useTasks(userID: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    if (!userID) return;
    setIsLoading(true);
    try {
      const result = await window.electronAPI.getTasks(userID);
      if (result.success) {
        setTasks(result.data.items || []);
      } else {
        setError(result.error || 'Failed to fetch tasks');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData: any) => {
    try {
      const result = await window.electronAPI.createTask(taskData);
      if (result.success) {
        setTasks((prev) => [result.data, ...prev]);
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateTask = async (taskID: string, updates: Partial<Task>) => {
    try {
      const result = await window.electronAPI.updateTask(taskID, updates);
      if (result.success) {
        setTasks((prev) => prev.map((t) => (t.taskID === taskID ? result.data : t)));
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTask = async (taskID: string) => {
    try {
      const result = await window.electronAPI.deleteTask(taskID, userID);
      if (result.success) {
        setTasks((prev) => prev.filter((t) => t.taskID !== taskID));
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const completeTask = async (taskID: string, completionPercentage: number = 100) => {
    try {
      const result = await window.electronAPI.completeTask(taskID, completionPercentage);
      if (result.success) {
        setTasks((prev) => prev.map((t) => (t.taskID === taskID ? result.data : t)));
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [userID]);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
  };
}