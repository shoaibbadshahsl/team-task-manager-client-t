import { Task } from '../../models/Task';

export interface ITaskRepository {
    getAllTasks(): Promise<Task[]>;
    getTaskById(id: string): Promise<Task | null>;
    createTask(task: Task): Promise<Task>;
    updateTask(task: Task): Promise<Task>;
    deleteTask(id: string): Promise<void>;
    assignTask(taskId: string, userId: string): Promise<Task>;
}

/**
 * Factory that creates an in-memory task repository.
 * This replaces the previous class-based implementation with a functional factory
 * that returns an object implementing ITaskRepository.
 */
export function createTaskRepository(): ITaskRepository {
    let tasks: Task[] = [];

    async function getAllTasks(): Promise<Task[]> {
        return tasks;
    }

    async function getTaskById(id: string): Promise<Task | null> {
        return tasks.find(task => task.id === id) || null;
    }

    async function createTask(task: Task): Promise<Task> {
        tasks.push(task);
        return task;
    }

    async function updateTask(updatedTask: Task): Promise<Task> {
        const index = tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
            tasks[index] = updatedTask;
            return updatedTask;
        }
        throw new Error('Task not found');
    }

    async function deleteTask(id: string): Promise<void> {
        tasks = tasks.filter(task => task.id !== id);
    }

    async function assignTask(taskId: string, userId: string): Promise<Task> {
        const task = await getTaskById(taskId);
        if (task) {
            task.assignedTo = userId;
            await updateTask(task);
            return task;
        }
        throw new Error('Task not found');
    }

    return {
        getAllTasks,
        getTaskById,
        createTask,
        updateTask,
        deleteTask,
        assignTask,
    };
}

export default createTaskRepository;