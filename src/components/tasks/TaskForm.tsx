import React, { useState } from 'react';
import { Task } from '../../models/Task';
import { useAuth } from '../../hooks/useAuth';
import useUsers from '../../hooks/useUsers';
import { createTask, updateTask, CreateTaskPayload } from '../../services/taskService';

const AssignedToSelect: React.FC<{ assignedTo: string; setAssignedTo: (v: string) => void }> = ({ assignedTo, setAssignedTo }) => {
  const { users, loading, error } = useUsers();
  return (
    <select
      value={assignedTo}
      onChange={(e) => setAssignedTo(e.target.value)}
      className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
    >
      <option value="">Not assigned</option>
      {loading && <option disabled>Loading users...</option>}
      {error && <option disabled>Error loading users</option>}
      {!loading && users.map(u => (
        <option key={u.id} value={u.id}>{u.name}</option>
      ))}
    </select>
  );
};

interface TaskFormProps {
  existingTask?: Task;
  onTaskCreated: (task: Task) => void;
  onCancel?: () => void;
  isEditMode?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ existingTask, onTaskCreated, onCancel, isEditMode = false }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [assignedTo, setAssignedTo] = useState<string>(() => {
    const a: any = existingTask?.assignedTo;
    if (!a) return user?.id || '';
    if (typeof a === 'string') return a;
    // if assignedTo is an object from API, prefer _id then id
    if (typeof a === 'object') return a._id || a.id || '';
    return user?.id || '';
  });
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Done'>(existingTask?.status || 'Pending');


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAssignedTo(user?.id || '');
    setStatus('Pending');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setLoading(true);
    try {
      const taskDataBase: any = {
        title: title.trim(),
        description: description.trim(),
        status,
      };

      // If we're editing, explicitly send null to remove assignment when "Not assigned" is chosen.
      if (isEditMode) {
        taskDataBase.assignedTo = assignedTo === '' ? null : assignedTo;
      } else {
        // For creation, omit assignedTo when empty so backend can decide default behavior
        if (assignedTo) taskDataBase.assignedTo = assignedTo;
      }

      const taskData = taskDataBase;

      let result;
      if (isEditMode && existingTask) {
        result = await updateTask(existingTask.id, taskData);
      } else {
        result = await createTask(taskData as CreateTaskPayload);
      }
      
      onTaskCreated(result);
      if (!isEditMode) {
        resetForm();
      }
      if (onCancel && isEditMode) {
        onCancel();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Task title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Short description of the task"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned To</label>
            {/* show users from API */}
            <AssignedToSelect assignedTo={assignedTo} setAssignedTo={setAssignedTo} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button type="button" onClick={resetForm} className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50">Reset</button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60"
        >
          {loading ? 'Saving...' : existingTask ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;