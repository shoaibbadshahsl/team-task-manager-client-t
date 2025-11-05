import React from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-7">
                <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;