import React from 'react';
import { GeneratedContent, SIGNATURE_HTML_FOR_VIDEO_POST } from '../constants';
import { Hashtags } from './Hashtags';
import { PlatformDetails } from './PlatformDetails';
import { PostHeader } from './PostHeader';
import { SignatureBlock } from './SignatureBlock';

interface FacebookVideoPostProps {
  post: Extract<GeneratedContent, { type: 'video' }>;
}

export const FacebookVideoPost: React.FC<FacebookVideoPostProps> = ({ post }) => {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
      <div className="relative aspect-square w-full">
        <video 
          src="https://videos.pexels.com/video-files/3129957/3129957-hd_1366_720_25fps.mp4"
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div>
        <div className="relative z-10 flex flex-col justify-between h-full p-4 sm:p-6 text-white">
          <PostHeader variant="video" />
          <div className="flex-grow flex flex-col justify-center items-center text-center -mt-10">
            <h2 className="text-3xl lg:text-4xl font-bold" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>{post.title}</h2>
            <p className="mt-4 text-lg lg:text-xl max-w-xl whitespace-pre-wrap" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>{post.message}</p>
             <Hashtags
                hashtags={post.hashtags}
                containerClassName="mt-4"
                linkClassName="inline-block mr-2 font-semibold text-white/90 hover:underline"
              />
          </div>
          <div className="self-start">
            <SignatureBlock html={SIGNATURE_HTML_FOR_VIDEO_POST} />
          </div>
        </div>
      </div>
       <PlatformDetails />
    </div>
  );
};