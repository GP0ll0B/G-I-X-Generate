import React from 'react';
import { GeneratedContent, SIGNATURE_HTML_FOR_TEXT_POST } from '../constants';
import { Hashtags } from './Hashtags';
import { PlatformDetails } from './PlatformDetails';
import { PostHeader } from './PostHeader';
import { SignatureBlock } from './SignatureBlock';

interface FacebookAnalysisPostProps {
  post: Extract<GeneratedContent, { type: 'analysis' }>;
}

export const FacebookAnalysisPost: React.FC<FacebookAnalysisPostProps> = ({ post }) => {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
      <div className="p-4 sm:p-6">
        <PostHeader />
        <div className="text-gray-700 dark:text-gray-300 text-base whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>
        <Hashtags hashtags={post.hashtags} />
        <SignatureBlock html={SIGNATURE_HTML_FOR_TEXT_POST} />
      </div>
      <PlatformDetails />
    </div>
  );
};