import React from 'react';
import DashboardStats from '../../components/dashboard/DashboardStats';

const Dashboard: React.FC = () => {
    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
                <p className="text-gray-600">Overview of your team's task management</p>
            </div>
            
            {/* Statistics Section */}
            <DashboardStats />
        </div>
    );
};

export default Dashboard;