import { useState, useEffect } from 'react';
import { Task } from '../models/Task';
import { getTasks, getDashboard } from '../services/taskService';

export function useTaskStats() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [stats, setStats] = useState<any | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Try dashboard endpoint first (may provide aggregated stats)
                const d = await getDashboard();
                setStats(d || null);

                // If dashboard includes a tasks array, use it; otherwise fall back to getTasks
                if (d && Array.isArray(d.tasks)) {
                    setTasks(d.tasks as Task[]);
                } else {
                    const data = await getTasks();
                    setTasks(data);
                }
            } catch (err) {
                // If dashboard fails, fallback to tasks endpoint
                try {
                    const data = await getTasks();
                    setTasks(data);
                } catch (err2) {
                    setError(err2 instanceof Error ? err2 : new Error('Failed to fetch tasks'));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    return { tasks, loading, error, stats };
}