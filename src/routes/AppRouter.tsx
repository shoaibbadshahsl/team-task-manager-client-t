import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import Tasks from '../pages/Tasks/Tasks';
import Users from '../pages/Users/Users';
import Settings from '../pages/Settings/Settings';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import TaskDetails from '../pages/TaskDetails/TaskDetails';
import NotFound from '../pages/NotFound';
import PrivateRoute from '../components/auth/PrivateRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import useAuth from '../hooks/useAuth';

const AppRouter: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();

    // Redirect authenticated users away from auth pages
    const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        if (user) {
            return <Navigate to="/dashboard" replace />;
        }
        return <>{children}</>;
    };

    // Handle 404 routes - redirect to login if not authenticated, otherwise show NotFound
    const NotFoundHandler = () => {
        if (!user) {
            return <Navigate to="/login" state={{ from: location }} replace />;
        }
        return <NotFound />;
    };

    return (
        <Routes>
            {/* Root redirect based on auth status */}
            <Route path="/" element={
                user ? (
                    <Navigate to="/dashboard" replace />
                ) : (
                    <Navigate to="/login" replace />
                )
            } />

            {/* Public Routes - Auth Pages */}
            <Route path="/login" element={
                <AuthRoute>
                    <Login />
                </AuthRoute>
            } />
            <Route path="/register" element={
                <AuthRoute>
                    <Register />
                </AuthRoute>
            } />

            {/* Protected Routes - Dashboard Pages */}
            <Route path="/dashboard" element={
                <PrivateRoute>
                    <DashboardLayout>
                        <Dashboard />
                    </DashboardLayout>
                </PrivateRoute>
            } />
            {/* Tasks list page */}
            <Route path="/tasks" element={
                <PrivateRoute>
                    <DashboardLayout>
                        <Tasks />
                    </DashboardLayout>
                </PrivateRoute>
            } />

            {/* Task details page */}
            <Route path="/tasks/:id" element={
                <PrivateRoute>
                    <DashboardLayout>
                        <TaskDetails />
                    </DashboardLayout>
                </PrivateRoute>
            } />

            {/* Users page */}
            <Route path="/users" element={
                <PrivateRoute>
                    <DashboardLayout>
                        <Users />
                    </DashboardLayout>
                </PrivateRoute>
            } />

            {/* Settings page */}
            <Route path="/settings" element={
                <PrivateRoute>
                    <DashboardLayout>
                        <Settings />
                    </DashboardLayout>
                </PrivateRoute>
            } />

            {/* Catch all route - redirect to login if not authenticated */}
            <Route path="*" element={<NotFoundHandler />} />
        </Routes>
    );
};

export default AppRouter;