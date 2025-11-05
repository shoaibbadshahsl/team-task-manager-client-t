import { Task } from '../../models/Task';
import { ITaskRepository } from '../repositories/TaskRepository';

/**
 * Update a task by merging fields onto the existing task.
 *
 * @param taskRepository - repository implementing ITaskRepository
 * @param taskId - id of the task to update
 * @param updatedTask - partial task fields to update
 */
export async function updateTask(
    taskRepository: ITaskRepository,
    taskId: string,
    updatedTask: Partial<Task>
): Promise<Task> {
    const existingTask = await taskRepository.getTaskById(taskId);
    if (!existingTask) {
        throw new Error('Task not found');
    }

    const updated = { ...existingTask, ...updatedTask };
    return taskRepository.updateTask(updated as Task);
}