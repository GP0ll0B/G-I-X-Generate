import React from 'react';
import { Button } from './ui/Button';
import { CopyIcon, SendIcon } from './ui/icons';
import { SIGNATURE_TEXT_FOR_COPY, GeneratedContent } from '../constants';

interface ActionBarProps {
    onPublish: () => void;
    onCopy: () => void;
    onPrev: () => void;
    onNext: () => void;
    currentIndex: number;
    totalVariations: number;
    disabled: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = ({ onPublish, onCopy, onPrev, onNext, currentIndex, totalVariations, disabled }) => {
    return (
        <div className="mt-4 flex flex-wrap justify-between items-center gap-2 p-2 bg-black/5 dark:bg-white/5 rounded-lg">
            {totalVariations > 1 ? (
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Button onClick={onPrev} disabled={disabled || currentIndex === 0} variant="secondary" className="!p-3" aria-label="Previous variation">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </Button>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-24 text-center">
                        Variation {currentIndex + 1}/{totalVariations}
                    </span>
                    <Button onClick={onNext} disabled={disabled || currentIndex >= totalVariations - 1} variant="secondary" className="!p-3" aria-label="Next variation">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Button>
                </div>
            ) : <div />}
             <div className="flex items-center gap-2">
                <Button onClick={onCopy} variant="secondary">
                    <CopyIcon /> Copy
                </Button>
                <Button onClick={onPublish} disabled={disabled}>
                    <SendIcon /> Publish...
                </Button>
             </div>
        </div>
    );
};