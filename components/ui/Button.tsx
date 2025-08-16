import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  const baseClasses = 'flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:cursor-not-allowed transition-all duration-300';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-400 dark:disabled:bg-gray-600',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-800'
  };

  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}
    >
      {children}
    </button>
  );
};
