import React from 'react';
import useUsers from '../../hooks/useUsers';

const Users: React.FC = () => {
    const { users, loading, error } = useUsers();

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Users</h1>
                <p className="text-gray-600">Manage team members and their roles</p>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
                {loading && <p className="text-gray-600">Loading users...</p>}
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
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td className="px-6 py-4 text-sm text-gray-700">{u.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{u.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{u.updatedAt ? new Date(u.updatedAt).toLocaleString() : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;