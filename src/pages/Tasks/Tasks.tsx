import React from 'react';
import TaskList from '../../components/tasks/TaskList';

const Tasks: React.FC = () => {
    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Tasks</h1>
                <p className="text-gray-600">Manage and track all team tasks</p>
            </div>
            
            <TaskList />
        </div>
    );
};

export default Tasks;