import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    linkText: string;
    linkPath: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, linkText, linkPath }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h1 className="text-center text-3xl font-extrabold text-gray-900">
                        Team Task Manager
                    </h1>
                    <h2 className="mt-6 text-center text-xl text-gray-900">
                        {title}
                    </h2>
                </div>
                {children}
                <div className="text-center mt-4">
                    <Link 
                        to={linkPath}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        {linkText}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;