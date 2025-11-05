import { Task } from '../models/Task';
import api from './api';

// Types for create task payload as expected by the backend
export interface CreateTaskPayload {
    title: string;
    description: string;
    status: string; // 'Pending' | 'In Progress' | 'Done'
    assignedTo?: string;
}

export const getTasks = async (): Promise<Task[]> => {
    const res = await api.get<Task[]>('/tasks');
    // normalize dates
    return (res.data || []).map((t: any) => ({
        ...t,
        createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
        updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date(),
    }));
};

export const getTaskById = async (id: string): Promise<Task> => {
    const res = await api.get<Task>(`/tasks/${id}`);
    const t: any = res.data;
    if (!t) throw new Error('Task not found');
    return {
        ...t,
        createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
        updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date(),
    };
};

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
    const res = await api.post<Task>('/tasks', payload);
    const t: any = res.data;
    return {
        ...t,
        createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
        updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date(),
    };
};

export const updateTask = async (id: string, taskData: Partial<Task>): Promise<Task> => {
    if (!id) {
        throw new Error('Task ID is required for updating');
    }
    const res = await api.put<Task>(`/tasks/${id}`, taskData);
    const t: any = res.data;
    return {
        ...t,
        createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
        updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date(),
    };
};

export const deleteTask = async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
};

export const assignTask = async (id: string, userId: string): Promise<Task> => {
    const res = await api.post<Task>(`/tasks/${id}/assign`, { userId });
    const t: any = res.data;
    return {
        ...t,
        createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
        updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date(),
    };
};

// Fetch dashboard aggregated stats
export const getDashboard = async (): Promise<any> => {
    const res = await api.get('/tasks/dashboard');
    return res.data;
};