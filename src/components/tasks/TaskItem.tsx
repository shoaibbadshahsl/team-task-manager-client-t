import React from 'react';
import { Task } from '../../models/Task';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  return (
    <div className="p-4 border rounded-md bg-white">
      <h3 className="text-sm font-medium">{task.title}</h3>
      <p className="text-sm text-gray-500">{task.description}</p>
      <div className="mt-2 flex items-center gap-3">
        <div className="text-xs text-gray-600">Assigned to: {task.assignedTo}</div>
        <div className="text-xs text-gray-600">Status: {task.status}</div>
      </div>
      <div className="mt-3">
        <button onClick={handleEdit} className="text-sm text-gray-600 mr-2">Edit</button>
        <button onClick={handleDelete} className="text-sm text-red-600">Delete</button>
      </div>
    </div>
  );
};

export default TaskItem;