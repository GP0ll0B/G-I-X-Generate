

import React from 'react';
import { GeneratedContent } from '../constants';
import { PostHeader } from './PostHeader';
import { PlatformDetails } from './PlatformDetails';
import { Loader } from './ui/Loader';
import { VideoCameraIcon } from './ui/icons';

interface FacebookGeneratedVideoPostProps {
  post: Extract<GeneratedContent, { type: 'video_generation' }>;
}

export const FacebookGeneratedVideoPost: React.FC<FacebookGeneratedVideoPostProps> = ({ post }) => {
    const { status, prompt, pollingMessage, videoUrl, inputImageUrl } = post;

    const renderContent = () => {
        if (status === 'success' && videoUrl) {
            return (
                <video 
                    src={videoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain bg-black"
                />
            );
        }

        const iconToRender = status === 'error' 
            ? <p className="text-red-500 text-5xl">!</p> 
            : <VideoCameraIcon/>

        return (
            <div className="text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center p-4 h-full">
                <div className="text-5xl mb-4">{iconToRender}</div>
                <p className="font-bold text-lg text-gray-700 dark:text-gray-200">
                    {status === 'error' ? 'Generation Failed' : 'Video Generation in Progress'}
                </p>
                <div className="mt-4 w-full max-w-md">
                    {status !== 'error' && <Loader text={pollingMessage || 'Please wait...'} />}
                </div>
                 <p className={`text-xs mt-2 italic ${status === 'error' ? 'text-red-500' : ''}`}>
                    {status === 'error' ? pollingMessage : 'This process can take several minutes. You can monitor the progress here.'}
                </p>
            </div>
        );
    };

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
            <div className="p-4 sm:p-6">
                <PostHeader />
                <div className="mt-2 text-gray-700 dark:text-gray-300 text-base whitespace-pre-wrap leading-relaxed">
                    <p className="font-semibold">Video Prompt:</p>
                    <p className="italic">"{prompt}"</p>
                </div>
                {inputImageUrl && (
                    <div className="mt-3">
                        <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">Input Image:</p>
                        <img src={inputImageUrl} alt="Input for video generation" className="mt-1 w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                    </div>
                )}
            </div>

            <div className="aspect-video bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center">
                {renderContent()}
            </div>
            
            <PlatformDetails />
        </div>
    );
};