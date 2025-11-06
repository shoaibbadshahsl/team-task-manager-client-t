import React from 'react';
import { useFormik } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import AuthLayout from '../../components/layout/AuthLayout';
import { registerValidationSchema } from '../../utils/validationSchemas';
import useAuth from '../../hooks/useAuth';

interface RegisterFormValues {
    name: string;
    email: string;
    password: string;
}

const Register: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
     const { register } = useAuth();

    const from = (location.state as any)?.from?.pathname || '/';

    const formik = useFormik<RegisterFormValues>({
        initialValues: {
            name: '',
            email: '',
            password: ''
        },
        validationSchema: registerValidationSchema,
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                //  await authService.register(
                //     values.name,
                //     values.email,
                //     values.password
                // );

                await register(
                    values.name,
                    values.email,
                    values.password
                );

                 navigate(from, { replace: true });
                // If registration auto-logged in, redirect to dashboard/home; otherwise go to login
                // const token = localStorage.getItem('token');
                // if (token) {
                //     navigate(from, { replace: true });
                // } else {
                //     navigate('/login');
                // }
            } catch (err: any) {
                setStatus(err?.message || 'Registration failed. Please try again.');
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <AuthLayout
            title="Create your account"
            linkText="Already have an account? Sign in"
            linkPath="/login"
        >
            {formik.status && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{formik.status}</div>
                </div>
            )}
            <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor="name" className="sr-only">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            {...formik.getFieldProps('name')}
                            className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                formik.touched.name && formik.errors.name
                                    ? 'border-red-300'
                                    : 'border-gray-300'
                            } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                            placeholder="Full Name"
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="text-sm text-red-600 mt-1">{formik.errors.name}</div>
                        )}
                    </div>
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
                            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
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
                        {formik.isSubmitting ? 'Creating account...' : 'Create account'}
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Register;