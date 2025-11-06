import React from 'react';
import { useFormik } from 'formik';
import { Task } from '../../models/Task';
import { useAuth } from '../../hooks/useAuth';
import useUsers from '../../hooks/useUsers';
import { createTask, updateTask, CreateTaskPayload } from '../../services/taskService';
import { taskValidationSchema } from '../../utils/validationSchemas';

interface TaskFormValues {
  title: string;
  description: string;
  assignedTo: string;
  status: 'Pending' | 'In Progress' | 'Done';
}

const AssignedToSelect: React.FC<{ assignedTo: string; setAssignedTo: (v: string) => void }> = ({ assignedTo, setAssignedTo }) => {
  const { users, loading, error } = useUsers();
  return (
    <select
      value={assignedTo}
      onChange={(e) => setAssignedTo(e.target.value)}
      className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
      onBlur={(e) => e.stopPropagation()} // Prevent Formik from marking as touched on selection
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

  // Get initial assignedTo value
  const getInitialAssignedTo = () => {
    if (existingTask?.assignedTo) {
      const a: any = existingTask.assignedTo;
      if (typeof a === 'string') return a;
      if (typeof a === 'object') return a._id || a.id || '';
    }
    return '';
  };

  const formik = useFormik<TaskFormValues>({
    initialValues: {
      title: existingTask?.title || '',
      description: existingTask?.description || '',
      assignedTo: getInitialAssignedTo(),
      status: existingTask?.status || 'Pending' as const,
    },
    validationSchema: taskValidationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const taskDataBase: any = {
          title: values.title.trim(),
          description: values.description.trim(),
          status: values.status,
        };

        // Handle assignedTo field
        if (isEditMode) {
          taskDataBase.assignedTo = values.assignedTo === '' ? null : values.assignedTo;
        } else if (values.assignedTo) {
          taskDataBase.assignedTo = values.assignedTo;
        }

        let result;
        if (isEditMode && existingTask) {
          result = await updateTask(existingTask.id, taskDataBase);
        } else {
          result = await createTask(taskDataBase as CreateTaskPayload);
        }
        
        onTaskCreated(result);
        if (!isEditMode) {
          formik.resetForm();
        }
        if (onCancel && isEditMode) {
          onCancel();
        }
      } catch (err: any) {
        setStatus(err?.message || 'Failed to create task');
      } finally {
        setSubmitting(false);
      }
    },
  });



  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {formik.status && <div className="text-sm text-red-600">{formik.status}</div>}

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
              formik.touched.title && formik.errors.title ? 'border-red-500' : 'border-gray-200'
            }`}
            type="text"
            {...formik.getFieldProps('title')}
            placeholder="Task title"
          />
          {formik.touched.title && formik.errors.title && (
            <div className="mt-1 text-sm text-red-600">{formik.errors.title}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className={`mt-1 block w-full border rounded-md px-3 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 ${
              formik.touched.description && formik.errors.description ? 'border-red-500' : 'border-gray-200'
            }`}
            {...formik.getFieldProps('description')}
            placeholder="Short description of the task"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="mt-1 text-sm text-red-600">{formik.errors.description}</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned To</label>
            {/* show users from API */}
            <AssignedToSelect 
              assignedTo={formik.values.assignedTo} 
              setAssignedTo={(value) => formik.setFieldValue('assignedTo', value)} 
            />
            {formik.touched.assignedTo && formik.errors.assignedTo && (
              <div className="mt-1 text-sm text-red-600">{formik.errors.assignedTo}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                formik.touched.status && formik.errors.status ? 'border-red-500' : 'border-gray-200'
              }`}
              {...formik.getFieldProps('status')}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            {formik.touched.status && formik.errors.status && (
              <div className="mt-1 text-sm text-red-600">{formik.errors.status}</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button 
          type="button" 
          onClick={() => formik.resetForm()} 
          className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60"
        >
          {formik.isSubmitting ? 'Saving...' : existingTask ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;