import React, { useState } from 'react';
import { GeneratedContent, SIGNATURE_HTML_FOR_TEXT_POST, Source } from '../constants';
import { ChevronDownIcon, LinkIcon } from './ui/icons';
import { Hashtags } from './Hashtags';
import { PlatformDetails } from './PlatformDetails';
import { PostHeader } from './PostHeader';
import { SignatureBlock } from './SignatureBlock';

interface FacebookGroundedPostProps {
  post: Extract<GeneratedContent, { type: 'grounded_text' }>;
}

const Sources: React.FC<{ sources: Source[] }> = ({ sources }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (sources.length === 0) {
        return null;
    }

    return (
        <div className="border-t border-gray-200/50 dark:border-gray-700/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-3 text-sm text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none"
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-2 font-medium">
                    <LinkIcon />
                    Fact-Checked Sources
                </span>
                <span className={isOpen ? 'rotate-180' : ''}>
                    <ChevronDownIcon />
                </span>
            </button>
            {isOpen && (
                <div className="bg-black/5 dark:bg-white/5 p-4 text-xs text-gray-600 dark:text-gray-300">
                    <ul className="space-y-3">
                        {sources.map((source, index) => (
                            <li key={source.web.uri + index} className="flex items-start gap-3">
                                <span className="text-gray-400 dark:text-gray-500 mt-0.5">{index + 1}.</span>
                                <a 
                                    href={source.web.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="group"
                                >
                                    <p className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {source.web.title || "Untitled Source"}
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400 text-[11px] break-all group-hover:underline">
                                        {source.web.uri}
                                    </p>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export const FacebookGroundedPost: React.FC<FacebookGroundedPostProps> = ({ post }) => {
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
      <Sources sources={post.sources} />
      <PlatformDetails />
    </div>
  );
};