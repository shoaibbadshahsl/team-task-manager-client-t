import { Task } from '../../models/Task';
import { ITaskRepository } from '../repositories/TaskRepository';

/**
 * Create a new task using the provided repository.
 *
 * @param taskRepository - repository implementing ITaskRepository
 * @param taskData - task payload (without id)
 */
export async function createTask(
    taskRepository: ITaskRepository,
    taskData: Omit<Task, 'id'>
): Promise<Task> {
    const task: Task = {
        ...(taskData as Task),
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const newTask = await taskRepository.createTask(task);
    return newTask;
}