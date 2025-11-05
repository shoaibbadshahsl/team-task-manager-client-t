import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { UserSummary } from '../../services/userService';
import { userValidationSchema } from '../../utils/validationSchemas';
import LoadingSpinner from '../ui/LoadingSpinner';

interface UserFormProps {
  user?: UserSummary;
  onSubmit: (data: { name: string; email: string }) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface FormValues {
  name: string;
  email: string;
}

const UserForm: React.FC<UserFormProps> = ({ 
  user, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}) => {
  const initialValues: FormValues = {
    name: user?.name || '',
    email: user?.email || ''
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={userValidationSchema}
      onSubmit={async (values, { setSubmitting, setStatus }) => {
        try {
          await onSubmit({
            name: values.name.trim(),
            email: values.email.trim()
          });
        } catch (error: any) {
          setStatus(error.message || 'An error occurred while saving');
        }
      }}
    >
      {({ isSubmitting: isFormSubmitting, status, errors, touched }) => (
        <Form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.name && touched.name 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            <ErrorMessage
              name="name"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Field
              type="email"
              id="email"
              name="email"
              className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.email && touched.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            <ErrorMessage
              name="email"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

          {status && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {status}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              disabled={isSubmitting || isFormSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isFormSubmitting}
              className="inline-flex items-center px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {(isSubmitting || isFormSubmitting) ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;