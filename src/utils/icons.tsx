import React from 'react';

interface AvatarProps {
    name: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const SpinnerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        {...props}
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        />
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
    </svg>
);

export const AvatarIcon: React.FC<AvatarProps> = ({ name, size = 'sm', className = '' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6 text-xs',
        md: 'w-8 h-8 text-sm',
        lg: 'w-10 h-10 text-base'
    };

    return (
        <div
            className={`
          ${sizeClasses[size]}
          bg-gray-200
          rounded-full
          flex
          items-center
          justify-center
          p-[3px]
          ${className}
        `}
        >
            <svg
                className="text-gray-400"
                fill="grey-100"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={0.1}
                    fill='gray-200'
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
            </svg>
        </div>
    );
};

// Add more icons here as needed
export const icons = {
    spinner: SpinnerIcon,
    Avatar: AvatarIcon
} as const;