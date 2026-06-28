import axios, { AxiosInstance } from 'axios';
import { Task } from '@sphere/domain';

export class TaskApi {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL: `${baseURL}/tasks`,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async getTasks(
    userID: string,
    filters?: any,
    pagination?: { limit: number; offset: number }
  ): Promise<{ tasks: Task[]; total: number }> {
    const response = await this.client.get('/', {
      params: { ...filters, ...pagination },
    });
    return response.data;
  }

  async getTaskById(taskID: string): Promise<Task> {
    const response = await this.client.get(`/${taskID}`);
    return response.data;
  }

  async createTask(task: Omit<Task, 'taskID' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const response = await this.client.post('/', task);
    return response.data;
  }

  async updateTask(taskID: string, updates: Partial<Task>): Promise<Task> {
    const response = await this.client.put(`/${taskID}`, updates);
    return response.data;
  }

  async deleteTask(taskID: string): Promise<void> {
    await this.client.delete(`/${taskID}`);
  }

  async completeTask(taskID: string, completionPercentage: number): Promise<Task> {
    const response = await this.client.post(`/${taskID}/complete`, { completionPercentage });
    return response.data;
  }
}