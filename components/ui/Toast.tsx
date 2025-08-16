import React, { useState, useEffect, useCallback } from 'react';
import { ToastData } from '../../constants';
import { CloseIcon, ErrorIcon, SuccessIcon } from './icons';

interface ToastProps extends ToastData {
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed top-5 right-5 z-50 w-full max-w-sm p-4 rounded-lg shadow-lg flex items-start gap-3
        ${isSuccess ? 'bg-green-50 dark:bg-green-900/80 border border-green-200 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/80 border border-red-200 dark:border-red-700'}
        ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}`}
      role="alert"
    >
      <div className="flex-shrink-0">
        {isSuccess ? <SuccessIcon /> : <ErrorIcon />}
      </div>
      <div className={`flex-grow text-sm font-medium ${isSuccess ? 'text-green-800 dark:text-green-100' : 'text-red-800 dark:text-red-100'}`}>
        {message}
      </div>
      <button 
        onClick={handleClose} 
        aria-label="Close notification"
        className={`p-1 rounded-full -mt-1 -mr-1 ${isSuccess ? 'text-green-600 hover:bg-green-100' : 'text-red-600 hover:bg-red-100'}`}
      >
        <CloseIcon />
      </button>
    </div>
  );
};
