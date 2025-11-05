import React from 'react';
import { Task } from '../../models/Task';
import { useTaskStats } from '../../hooks/useTaskStats';

interface StatsCardProps {
    title: string;
    value: number | string;
    bgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, bgColor }) => (
    <div className={`${bgColor} rounded-lg shadow-md p-6 flex flex-col`}>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
);

const DashboardStats: React.FC = () => {
    const { tasks, loading, error, stats } = useTaskStats() as any;

    if (loading) return <div>Loading stats...</div>;
    if (error) return <div>Error loading stats: {error.message}</div>;
    if (!tasks) return <div>No data available</div>;

    // Prefer aggregated stats from API when available
    let totalTasks = 0;
    let completedTasks = 0;
    let inProgressTasks = 0;
    let pendingTasks = 0;
    let uniqueUsers = 0;
    let completionRate = 0;

    if (stats) {
        // flexible mapping for various possible backend shapes
        totalTasks = stats.totalTasks ?? stats.total ?? stats.count ?? 0;
        if (!totalTasks && stats.byStatus) {
            totalTasks = Object.values(stats.byStatus).reduce((s: number, v: any) => s + (Number(v) || 0), 0);
        }

        completedTasks = stats.completedTasks ?? stats.completed ?? stats.byStatus?.done ?? stats.byStatus?.Done ?? 0;
        inProgressTasks = stats.inProgressTasks ?? stats.inProgress ?? stats.byStatus?.inProgress ?? stats.byStatus?.['In Progress'] ?? 0;
        pendingTasks = stats.pendingTasks ?? stats.pending ?? stats.byStatus?.pending ?? stats.byStatus?.Pending ?? 0;

        uniqueUsers = stats.activeUsers ?? stats.activeUsersCount ?? stats.users ?? (stats.uniqueUsers ?? 0);

        completionRate = stats.completionRate ?? (totalTasks > 0 ? Math.round((Number(completedTasks) / totalTasks) * 100) : 0);
    } else {
        // Calculate statistics from tasks list
        totalTasks = tasks.length;
        completedTasks = tasks.filter((task: Task) => task.status === 'Done').length;
        inProgressTasks = tasks.filter((task: Task) => task.status === 'In Progress').length;
        pendingTasks = tasks.filter((task: Task) => task.status === 'Pending').length;
        uniqueUsers = new Set(tasks.map((task: Task) => task.assignedTo)).size;
        completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatsCard
                title="Total Tasks"
                value={totalTasks}
                bgColor="bg-blue-100"
            />
            <StatsCard
                title="Active Users"
                value={uniqueUsers}
                bgColor="bg-green-100"
            />
            <StatsCard
                title="Completion Rate"
                value={`${completionRate}`}
                bgColor="bg-purple-100"
            />
            <StatsCard
                title="Completed Tasks"
                value={completedTasks}
                bgColor="bg-yellow-100"
            />
            <StatsCard
                title="In Progress"
                value={inProgressTasks}
                bgColor="bg-orange-100"
            />
            <StatsCard
                title="Pending Tasks"
                value={pendingTasks}
                bgColor="bg-red-100"
            />
        </div>
    );
};

export default DashboardStats;