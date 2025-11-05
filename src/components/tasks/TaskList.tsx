import React, { useState } from 'react';
import { Task } from '../../models/Task';
import { useTasks } from '../../hooks/useFetch';
import TaskForm from './TaskForm';
import { deleteTask } from '../../services/taskService';
import ConfirmModal from '../ui/ConfirmModal';
import Modal from '../ui/Modal';
import { icons } from '../../utils/icons';
import LoadingState from '../ui/LoadingState';

const TaskList: React.FC = () => {
    const { tasks, loading, error, fetchTasks } = useTasks();
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deleteCandidate, setDeleteCandidate] = useState<Task | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow border">
                <LoadingState 
                    message="Loading tasks..." 
                    className="p-6"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg p-6 shadow border">
                <div className="text-red-600 bg-red-50 p-4 rounded-md">
                    Error loading tasks: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-6 shadow border">
            <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold">Tasks</div>
                <div>
                    <button onClick={() => setShowForm(s => !s)} className="bg-blue-600 text-white px-3 py-2 rounded-md">+ Add Task</button>
                </div>
            </div>

            <ConfirmModal
                isOpen={!!deleteCandidate}
                title="Delete task"
                description={deleteCandidate ? (
                    <>
                      <p className="text-sm text-gray-700">Are you sure you want to delete the task <span className="font-semibold">{deleteCandidate.title}</span>?</p>
                      <p className="mt-2 text-sm text-gray-500">This action cannot be undone.</p>
                    </>
                ) : undefined}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                loading={deleteLoading}
                error={deleteError}
                onCancel={() => setDeleteCandidate(null)}
                onConfirm={async () => {
                    if (!deleteCandidate) return;
                    setDeleteLoading(true);
                    setDeleteError(null);
                    try {
                        await deleteTask(deleteCandidate.id);
                        setDeleteCandidate(null);
                        try { await fetchTasks(); } catch {}
                    } catch (err: any) {
                        console.error('Failed to delete task', err);
                        setDeleteError(err?.message || 'Failed to delete task');
                    } finally {
                        setDeleteLoading(false);
                    }
                }}
            />

            <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add Task">
                <TaskForm 
                    onTaskCreated={async (task: Task) => {
                        setShowForm(false);
                        try { await fetchTasks(); } catch {}
                    }} 
                />
            </Modal>

            <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Edit Task">
                {editingTask && (
                    <TaskForm 
                        existingTask={editingTask}
                        isEditMode={true}
                        onTaskCreated={async (task: Task) => {
                            setEditingTask(null);
                            try { await fetchTasks(); } catch {}
                        }}
                        onCancel={() => setEditingTask(null)}
                    />
                )}
            </Modal>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {(!tasks || tasks.length === 0) && (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-sm text-gray-500">No tasks available</td>
                            </tr>
                        )}
                        {tasks && tasks.map((task: Task) => {
                            // assignedTo may be a string (user id/name) or an object returned from the API.
                            const assignedRaw: any = (task as any).assignedTo;
                            const assignedDisplay: string =
                                typeof assignedRaw === 'string'
                                    ? assignedRaw
                                    : assignedRaw && typeof assignedRaw === 'object'
                                        ? (assignedRaw.name || assignedRaw.email || String(assignedRaw.id || assignedRaw))
                                        : 'Not Assigned';

                            const assignedInitial = String(assignedDisplay || 'U').charAt(0).toUpperCase();

                            return (
                                <tr key={task.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500">{task.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${task.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' : task.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                                            {task.status === 'Pending' ? 'Pending' : task.status === 'In Progress' ? 'In Progress' : 'Done'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <icons.Avatar name={assignedDisplay} size="sm" className="h-1/2 mr-3" />
                                            <div className="text-sm text-gray-800">{assignedDisplay}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => {
                                                    if (!task.id) {
                                                        console.error('Task has no ID:', task);
                                                        return;
                                                    }
                                                    setEditingTask(task);
                                            }}
                                            className="text-sm text-blue-600 px-3 py-1 rounded-md border mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (!task.id) return console.error('No id to delete', task);
                                                setDeleteCandidate(task);
                                            }}
                                            className="text-sm bg-red-500 text-white px-3 py-1 rounded-md"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskList;