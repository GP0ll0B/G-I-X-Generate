import React from 'react';
import { GeneratedContent, SIGNATURE_HTML_FOR_TEXT_POST } from '../constants';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { SparklesIcon } from './ui/icons';
import { PostHeader } from './PostHeader';
import { Hashtags } from './Hashtags';
import { SignatureBlock } from './SignatureBlock';
import { PlatformDetails } from './PlatformDetails';

interface FacebookImagePostProps {
  post: Extract<GeneratedContent, { type: 'image' }>;
  isGeneratingImage: boolean;
  onGenerateImage: () => void;
  onPromptChange: (newPrompt: string) => void;
  isPostLoading: boolean;
}

export const FacebookImagePost: React.FC<FacebookImagePostProps> = ({ 
  post, isGeneratingImage, onGenerateImage, onPromptChange, isPostLoading
}) => {

  const isFinalImage = post.imageUrl && post.imageUrl.startsWith('data:');

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
      <div className="p-4 sm:p-6">
        <PostHeader />
        <div className="text-gray-700 dark:text-gray-300 text-base whitespace-pre-wrap leading-relaxed mb-4">
          {post.caption}
        </div>
      </div>
      
      {!isFinalImage && (
        <div className="p-4 sm:p-6 border-y border-white/20 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <label htmlFor="image-prompt" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Editable Image Prompt
          </label>
          <textarea
            id="image-prompt"
            value={post.imagePrompt}
            onChange={(e) => onPromptChange(e.target.value)}
            rows={3}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-700/50"
            disabled={isGeneratingImage}
          />
          <Button 
            onClick={onGenerateImage}
            disabled={isGeneratingImage || !post.imagePrompt.trim()}
            className="w-full mt-3"
          >
            {isGeneratingImage ? <Loader text="Generating Image..." /> : 'Generate Image'}
          </Button>
        </div>
      )}

      <div className="aspect-square bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center">
        {isGeneratingImage ? (
          <div className="text-center text-gray-500 flex flex-col items-center">
            <Loader text="Generating image..." />
          </div>
        ) : isFinalImage ? (
          <img src={post.imageUrl} alt={post.imagePrompt} className="w-full h-full object-cover" />
        ) : (
            <div className="text-center text-gray-500 flex flex-col items-center p-4">
                <SparklesIcon />
                <p className="mt-2 font-medium">Image will appear here</p>
                <p className="text-sm">Click "Generate Image" to create the visual</p>
            </div>
        )}
      </div>
      
      <div className="p-4 sm:p-6">
        <Hashtags hashtags={post.hashtags} />
        <SignatureBlock html={SIGNATURE_HTML_FOR_TEXT_POST} />
      </div>
      <PlatformDetails />
    </div>
  );
};