import React, { useState } from 'react';
import useUsers from '../../hooks/useUsers';
import LoadingState from '../../components/ui/LoadingState';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import UserForm from '../../components/users/UserForm';
import { updateUser, deleteUser, UserSummary } from '../../services/userService';

const Users: React.FC = () => {
    const { users, loading, error, refetch } = useUsers();
    const [editingUser, setEditingUser] = useState<UserSummary | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<UserSummary | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const handleEdit = async (data: { name: string; email: string }) => {
        if (!editingUser) return;
        setIsSubmitting(true);
        setActionError(null);
        try {
            await updateUser(editingUser.id, data);
            setEditingUser(null);
            refetch();
        } catch (err: any) {
            setActionError(err.message || 'Failed to update user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsSubmitting(true);
        setActionError(null);
        try {
            await deleteUser(deleteTarget.id);
            setDeleteTarget(null);
            refetch();
        } catch (err: any) {
            setActionError(err.message || 'Failed to delete user');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Users</h1>
                <p className="text-gray-600">Manage team members and their roles</p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
                {loading &&   <LoadingState
                    message="Loading all the users..."
                    className="bg-white rounded-lg shadow-sm"
                />}

                {error && <p className="text-red-600">Error loading users: {error}</p>}

                {!loading && !error && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td className="px-6 py-4 text-sm text-gray-700">{u.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{u.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{u.createdAt ? new Date(u.createdAt).toDateString() : '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{u.updatedAt ? new Date(u.updatedAt).toDateString() : '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 flex space-x-3">
                                            
                                            <button
                                                onClick={() => setEditingUser(u)}
                                                className="text-blue-600 hover:text-blue-800 "
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(u)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit User Modal */}
            <Modal
                isOpen={!!editingUser}
                onClose={() => setEditingUser(null)}
                title="Edit User"
            >
                {editingUser && (
                    <UserForm
                        user={editingUser}
                        onSubmit={handleEdit}
                        onCancel={() => setEditingUser(null)}
                        isSubmitting={isSubmitting}
                    />
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete User"
                loading={isSubmitting}
                error={actionError}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                description={
                    deleteTarget ? (
                        <>
                            <p className="text-sm text-gray-700">
                                Are you sure you want to delete the user <span className="font-semibold">{deleteTarget.name}</span>?
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                                This action cannot be undone.
                            </p>
                        </>
                    ) : undefined
                }
            />
        </div>
    );
};

export default Users;