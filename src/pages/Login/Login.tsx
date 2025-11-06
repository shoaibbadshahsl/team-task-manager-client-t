import React from 'react';
import { useFormik } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import { loginValidationSchema } from '../../utils/validationSchemas';


interface LoginFormValues {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Get the redirect path from location state, default to '/'
    const from = (location.state as any)?.from?.pathname || '/';

    const formik = useFormik<LoginFormValues>({
        initialValues: {
            email: 'user@example.com',
            password: 'StrongP@ssw0rd'
        },
        validationSchema: loginValidationSchema,
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                await login(values.email, values.password);
                // Redirect to the page they tried to visit or home
                navigate(from, { replace: true });
            } catch (err: any) {
                setStatus(err?.message || 'Invalid email or password');
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <AuthLayout 
            title="Sign in to your account"
            linkText="Need an account? Register"
            linkPath="/register"
        >
            {formik.status && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{formik.status}</div>
                </div>
            )}
            <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...formik.getFieldProps('email')}
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    formik.touched.email && formik.errors.email
                                        ? 'border-red-300'
                                        : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Email address"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-sm text-red-600 mt-1">{formik.errors.email}</div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...formik.getFieldProps('password')}
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    formik.touched.password && formik.errors.password
                                        ? 'border-red-300'
                                        : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Password"
                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className="text-sm text-red-600 mt-1">{formik.errors.password}</div>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {formik.isSubmitting ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
        </AuthLayout>
    );
};

export default Login;