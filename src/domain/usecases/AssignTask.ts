import { Task } from '../../models/Task';
import { ITaskRepository } from '../repositories/TaskRepository';

/**
 * Assign a user to a task.
 *
 * @param taskRepository - repository implementing ITaskRepository
 * @param taskId - id of the task to assign
 * @param userId - id of the user to assign to the task
 */
export async function assignTask(
    taskRepository: ITaskRepository,
    taskId: string,
    userId: string
): Promise<Task> {
    const task = await taskRepository.getTaskById(taskId);
    if (!task) {
        throw new Error('Task not found');
    }

    task.assignedTo = userId;
    return await taskRepository.updateTask(task);
}