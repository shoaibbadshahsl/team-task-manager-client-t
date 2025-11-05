import React from 'react';
import { SpinnerIcon } from '../../utils/icons';

interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  fullPage = false,
  className = ''
}) => {
  const containerClasses = fullPage 
    ? 'fixed inset-0 bg-white bg-opacity-80 z-50'
    : 'w-full h-full min-h-[200px]';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="pt-16">
        <div className="flex flex-col items-center justify-center">
              <SpinnerIcon 
                  className={`animate-spin w-5 h-5 text-gray-600`}
                />
          <p className="text-sm text-gray-600 font-medium animate-pulse">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;