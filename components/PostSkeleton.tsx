import React from 'react';
import { PostHeader } from './PostHeader';

export const PostSkeleton: React.FC = () => {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
      <div className="p-4 sm:p-6 animate-pulse">
        <PostHeader />
        <div className="space-y-3 mt-4">
          <div className="h-4 bg-gray-200/50 dark:bg-gray-700/50 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200/50 dark:bg-gray-700/50 rounded w-full"></div>
          <div className="h-4 bg-gray-200/50 dark:bg-gray-700/50 rounded w-4/6"></div>
          <div className="h-4 bg-gray-200/50 dark:bg-gray-700/50 rounded w-1/2"></div>
        </div>
      </div>
      <div className="border-t border-gray-200/50 dark:border-gray-700/50 px-4 py-2">
        <div className="flex justify-around items-center h-10">
            <div className="h-6 w-16 bg-gray-200/50 dark:bg-gray-700/50 rounded"></div>
            <div className="h-6 w-20 bg-gray-200/50 dark:bg-gray-700/50 rounded"></div>
            <div className="h-6 w-16 bg-gray-200/50 dark:bg-gray-700/50 rounded"></div>
            <div className="h-6 w-20 bg-gray-200/50 dark:bg-gray-700/50 rounded"></div>
        </div>
      </div>
    </div>
  );
};