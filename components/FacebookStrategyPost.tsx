import React, { useState } from 'react';
import { GeneratedContent, SIGNATURE_TEXT_FOR_COPY } from '../constants';
import { ChevronDownIcon } from './ui/icons';
import { PlatformDetails } from './PlatformDetails';
import { PostHeader } from './PostHeader';
import { ActionBar } from './ActionBar';

interface FacebookStrategyPostProps {
  post: Extract<GeneratedContent, { type: 'strategy' }>;
  onCopy: () => void;
  onPublish: () => void;
}

const formatKey = (key: string) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const ValueDisplay: React.FC<{ value: any }> = ({ value }) => {
    if (Array.isArray(value)) {
        return (
            <div className="flex flex-wrap gap-2 mt-1">
                {value.map((item, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-medium rounded-full">
                        {String(item)}
                    </span>
                ))}
            </div>
        );
    }
    if (typeof value === 'object' && value !== null) {
        return <StrategyDataRenderer data={value} level={1} />;
    }
    return <span className="text-gray-800 dark:text-gray-200">{String(value)}</span>;
};

const StrategyDataRenderer: React.FC<{ data: object, level?: number }> = ({ data, level = 0 }) => {
    return (
        <div className={`space-y-3 ${level > 0 ? 'pl-4 border-l-2 border-gray-200/50 dark:border-gray-700/50' : ''}`}>
            {Object.entries(data).map(([key, value]) => (
                <div key={key}>
                    <p className="font-semibold text-sm text-gray-600 dark:text-gray-400">{formatKey(key)}</p>
                    <ValueDisplay value={value} />
                </div>
            ))}
        </div>
    );
};

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-b border-gray-200/50 dark:border-gray-700/50 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-3 text-left font-semibold text-lg text-gray-800 dark:text-gray-200"
                aria-expanded={isOpen}
            >
                {formatKey(title)}
                <ChevronDownIcon className={isOpen ? 'rotate-180' : ''} />
            </button>
            {isOpen && (
                <div className="pb-4 animate-fade-in-fast">
                    {children}
                </div>
            )}
        </div>
    );
};

export const FacebookStrategyPost: React.FC<FacebookStrategyPostProps> = ({ post, onCopy, onPublish }) => {
    const handleCopy = () => {
        const textToCopy = JSON.stringify(post.strategy, null, 2);
        navigator.clipboard.writeText(textToCopy);
        onCopy();
    }
    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
            <div className="p-4 sm:p-6">
                <PostHeader />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 my-4">AI-Generated Content Strategy Plan</h2>
                 <ActionBar
                    onPublish={onPublish}
                    onCopy={handleCopy}
                    onPrev={() => {}}
                    onNext={() => {}}
                    currentIndex={0}
                    totalVariations={1}
                    disabled={false}
                />
                <div className="space-y-4 mt-4">
                    {Object.entries(post.strategy).map(([key, value]) => (
                        <CollapsibleSection key={key} title={key}>
                             <StrategyDataRenderer data={value as object} />
                        </CollapsibleSection>
                    ))}
                </div>
            </div>
            <PlatformDetails />
        </div>
    );
};