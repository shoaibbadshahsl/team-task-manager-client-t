import { ITaskRepository } from '../repositories/TaskRepository';

/**
 * Delete a task by id.
 *
 * @param taskRepository - repository implementing ITaskRepository
 * @param taskId - id of the task to delete
 */
export async function deleteTask(taskRepository: ITaskRepository, taskId: string): Promise<void> {
    if (!taskId) {
        throw new Error('Task ID is required');
    }
    await taskRepository.deleteTask(taskId);
}