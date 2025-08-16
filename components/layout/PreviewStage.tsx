



import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GeneratedContent, PostType, SIGNATURE_TEXT_FOR_COPY } from '../../constants';
import { PostSkeleton } from '../PostSkeleton';
import { SparklesIcon } from '../ui/icons';
import { FacebookPost } from '../FacebookPost';
import { FacebookGroundedPost } from '../FacebookGroundedPost';
import { FacebookImagePost } from '../FacebookImagePost';
import { FacebookVideoPost } from '../FacebookVideoPost';
import { FacebookAnalysisPost } from '../FacebookAnalysisPost';
import { FacebookAdPost } from '../FacebookAdPost';
import { ActionBar } from '../ActionBar';
import { FacebookGeneratedVideoPost } from '../FacebookGeneratedVideoPost';
import { FacebookVoiceDialogPost } from '../FacebookVoiceDialogPost';

interface PreviewStageProps {
  isLoading: boolean;
  isGeneratingImage?: boolean;
  postType: PostType;
  contentVariations: GeneratedContent[];
  currentVariationIndex: number;
  setCurrentVariationIndex: (index: number) => void;
  onGenerateImage?: () => void;
  onPromptChange?: (prompt: string) => void;
  onPublish: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const EmptyState: React.FC = () => (
  <div className="text-center text-gray-500 dark:text-gray-400 h-full flex flex-col justify-center items-center p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10">
      <SparklesIcon />
      <p className="text-lg font-semibold mt-4">Your generated content will appear here.</p>
      <p className="text-sm mt-1">Select a post type, fill in the details, and click "Generate".</p>
  </div>
);

export const PreviewStage: React.FC<PreviewStageProps> = ({
  isLoading, isGeneratingImage, postType, contentVariations, currentVariationIndex,
  setCurrentVariationIndex, onGenerateImage, onPromptChange, onPublish, showToast
}) => {
    
    const fadeAnimation = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const postIsReady = !isLoading && contentVariations.length > 0;
    const currentPost = postIsReady ? contentVariations[currentVariationIndex] : null;

    const handleCopy = () => {
        const content = contentVariations[currentVariationIndex];
        if (!content) return;
        
        let textToCopy = '';
        
        if (content.type === 'text' || content.type === 'grounded_text' || content.type === 'analysis') {
          const hashtagsText = content.hashtags?.join(' ') || '';
          textToCopy = `${content.content}\n\n${hashtagsText}\n\n${SIGNATURE_TEXT_FOR_COPY}`;
        } else if (content.type === 'video') {
          const hashtagsText = content.hashtags?.join(' ') || '';
          textToCopy = `${content.title}\n\n${content.message}\n\n${hashtagsText}\n\n${SIGNATURE_TEXT_FOR_COPY}`;
        } else if (content.type === 'image') {
          const hashtagsText = content.hashtags?.join(' ') || '';
          textToCopy = `${content.caption}\n\n${hashtagsText}\n\n${SIGNATURE_TEXT_FOR_COPY}`;
        } else if (content.type === 'ad') {
            const hashtagsText = content.hashtags?.join(' ') || '';
            textToCopy = `Headline: ${content.headline}\n\nPrimary Text: ${content.primaryText}\n\nCTA: ${content.callToAction}\n\nHashtags: ${hashtagsText}`;
        } else if (content.type === 'strategy') {
          textToCopy = JSON.stringify(content.strategy, null, 2);
        } else if (content.type === 'video_generation') {
            textToCopy = `Video Prompt: ${content.prompt}`;
            if (content.videoUrl) {
                textToCopy += `\n\nVideo URL (temporary): ${content.videoUrl}`;
            }
        } else if (content.type === 'voice_dialog') {
            textToCopy = `Voice Dialog: ${content.dialogType}\nScenario: ${content.scenario}\n\n`;
            textToCopy += content.dialog.map(turn => `${turn.speaker}: ${turn.line}`).join('\n');
        }
        
        navigator.clipboard.writeText(textToCopy);
        showToast('Post content copied to clipboard!', 'success');
    };

    const renderPost = (post: GeneratedContent) => {
        switch (post.type) {
            case 'text': return <FacebookPost post={post} />;
            case 'grounded_text': return <FacebookGroundedPost post={post} />;
            case 'ad': return <FacebookAdPost post={post} />;
            case 'image': return (
                <FacebookImagePost 
                    post={post}
                    isGeneratingImage={isGeneratingImage!}
                    onGenerateImage={onGenerateImage!}
                    onPromptChange={onPromptChange!}
                    isPostLoading={isLoading}
                />
            );
            case 'video': return <FacebookVideoPost post={post} />;
            case 'video_generation': return <FacebookGeneratedVideoPost post={post} />;
            case 'voice_dialog': return <FacebookVoiceDialogPost post={post} />;
            case 'analysis': return <FacebookAnalysisPost post={post} />;
            default: return null;
        }
    };
    
    return (
        <div className="relative min-h-[600px] lg:min-h-0 lg:h-full">
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div key="skeleton" {...fadeAnimation as any} className="absolute inset-0">
                        <PostSkeleton />
                    </motion.div>
                ) : contentVariations.length === 0 ? (
                    <motion.div key="empty" {...fadeAnimation as any} className="absolute inset-0">
                         <EmptyState />
                    </motion.div>
                ) : (
                    <motion.div key="content" {...fadeAnimation as any} className="space-y-4">
                        <ActionBar 
                            onPublish={onPublish}
                            onCopy={handleCopy}
                            onPrev={() => setCurrentVariationIndex(currentVariationIndex - 1)} 
                            onNext={() => setCurrentVariationIndex(currentVariationIndex + 1)} 
                            currentIndex={currentVariationIndex}
                            totalVariations={contentVariations.length}
                            disabled={
                                isLoading ||
                                (currentPost?.type === 'image' && (isGeneratingImage || !currentPost.imageUrl?.startsWith('data:'))) ||
                                (currentPost?.type === 'video_generation' && currentPost.status !== 'success')
                            }
                        />
                        {currentPost && renderPost(currentPost)}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};