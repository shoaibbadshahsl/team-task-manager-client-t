import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Task } from '../../models/Task';
import { getTaskById, updateTask, deleteTask } from '../../services/taskService';

const TaskDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const fetchedTask = await getTaskById(id!);
                setTask(fetchedTask);
            } catch (err) {
                setError('Failed to fetch task details');
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id]);

    const handleUpdate = async () => {
        if (task) {
            await updateTask(task.id, task);
            navigate('/dashboard');
        }
    };

    const handleDelete = async () => {
        if (task) {
            await deleteTask(task.id);
            navigate('/dashboard');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!task) return <div>Task not found</div>;

    return (
        <div>
            <h1>Task Details</h1>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>Assigned to: {task.assignedTo}</p>
            <p>Status: {task.status}</p>
            <button onClick={handleUpdate}>Update Task</button>
            <button onClick={handleDelete}>Delete Task</button>
        </div>
    );
};

export default TaskDetails;