import React from 'react';
import { GeneratedContent } from '../constants';
import { Button } from './ui/Button';
import { Hashtags } from './Hashtags';
import { PlatformDetails } from './PlatformDetails';
import { PostHeader } from './PostHeader';

interface FacebookAdPostProps {
  post: Extract<GeneratedContent, { type: 'ad' }>;
}

export const FacebookAdPost: React.FC<FacebookAdPostProps> = ({ post }) => {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
      <div className="p-4 sm:p-6">
        <PostHeader />
         <div className="text-gray-500 dark:text-gray-400 text-xs font-semibold mt-1 mb-2">
            Sponsored
        </div>
        <div className="text-gray-700 dark:text-gray-300 text-base whitespace-pre-wrap leading-relaxed">
          {post.primaryText}
        </div>
      </div>
      
      <div className="aspect-video bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center">
         <div className="text-center text-gray-500 flex flex-col items-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 font-medium">Ad Creative</p>
            <p className="text-sm">Image or video appears here</p>
        </div>
      </div>

       <div className="flex justify-between items-center p-3 bg-black/5 dark:bg-white/5 border-y border-white/20 dark:border-white/10">
            <div className="flex-grow pr-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">aikoinfinity.com</p>
                <p className="font-bold text-gray-800 dark:text-gray-200 leading-tight">{post.headline}</p>
            </div>
            <Button variant="secondary" className="!px-6 !py-2.5 flex-shrink-0">
                {post.callToAction}
            </Button>
       </div>
      
      <div className="p-4 sm:p-6">
        <Hashtags hashtags={post.hashtags} />
      </div>
      <PlatformDetails />
    </div>
  );
};