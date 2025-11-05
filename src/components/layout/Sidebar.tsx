import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar: React.FC = () => {
    const { logout } = useAuth();
    const navLinkClass = ({isActive}: {isActive: boolean}) => 
        `block px-3 py-2 rounded-md ${
            isActive 
                ? 'bg-blue-50 text-blue-600 font-medium' 
                : 'text-gray-700 hover:bg-gray-50'
        }`;

    return (
        <div className="w-56 bg-gray-100 border-r border-gray-200 p-6">
            <h2 className="text-sm font-medium mb-6">Team Task Manager</h2>
            
            {/* Main Navigation */}
            <div className="">
          
                <ul className="space-y-1">
                    <li>
                        <NavLink to="/dashboard" className={navLinkClass}>
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/tasks" className={navLinkClass}>
                            Tasks
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* Settings Navigation */}
            <div>
                <ul className="">
                    <li>
                        <NavLink to="/users" className={navLinkClass}>
                            Users
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings" className={navLinkClass}>
                            Settings
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* Logout Section */}
            <div className="mt-auto pt-6 border-t border-gray-200 mt-6">
                <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50 font-medium"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;