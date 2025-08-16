import React from 'react';
import { ArrowLeftIcon } from '../ui/icons';

interface HeaderProps {
    view: 'useCaseSelection' | 'generator';
    useCaseTitle?: string;
    onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ view, useCaseTitle, onBack }) => {
    const isSelectionView = view === 'useCaseSelection';

    return (
        <header className="text-center relative">
            {view === 'generator' && onBack && (
                 <button 
                    onClick={onBack} 
                    className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    <ArrowLeftIcon />
                    <span>Back to Use Cases</span>
                </button>
            )}

            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
                G|I|X Generate
            </h1>

            {isSelectionView ? (
                 <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto italic">
                    “AikoInfinity’s state-of-the-art facilities house the world’s most advanced AI technologies, driving innovation at the frontier of intelligence.”
                </p>
            ) : (
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    Now generating content for: <span className="font-semibold text-gray-800 dark:text-gray-200">{useCaseTitle || '...'}</span>
                </p>
            )}
        </header>
    );
};