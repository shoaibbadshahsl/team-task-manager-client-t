import { useState, useCallback } from 'react';
import api from '../services/api';
import { useEffect } from 'react';

export function useFetch<T = any>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<T>(url);
      setData(res.data);
    } catch (err: any) {
      setError(err?.message ?? 'Fetch error');
    } finally {
      setLoading(false);
    }
  }, [url]);

  // automatically fetch on mount / when url changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, fetchData };
}

export default useFetch;

// convenience hook used in components that expect tasks
export const useTasks = () => {
  // api.baseURL already includes /api, so request the resource path only
  const { data, loading, error, fetchData } = useFetch<any[]>('/tasks');
  
  // Ensure each task has an ID and required fields
  const tasks = (data ?? []).map(task => {
    if (!task._id) {
      console.error('Task missing ID:', task);
    }
    return {
      id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      assignedTo: task.assignedTo,
      createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
      updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date()
    };
  });
  
  return { tasks, loading, error, fetchTasks: fetchData };
};