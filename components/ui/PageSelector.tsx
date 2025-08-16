import React, { useState, useRef, useEffect } from 'react';
import { FacebookPage } from '../../constants';
import { CheckIcon, ChevronDownIcon } from './icons';

interface PageSelectorProps {
    pages: FacebookPage[];
    selectedPage: FacebookPage | null;
    onSelectPage: (page: FacebookPage | null) => void;
    disabled?: boolean;
}

export const PageSelector: React.FC<PageSelectorProps> = ({ pages, selectedPage, onSelectPage, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    
    const handleSelect = (page: FacebookPage) => {
        onSelectPage(page);
        setIsOpen(false);
    };

    const getPagePictureUrl = (page: FacebookPage | null): string => {
        return page?.picture?.data?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(page?.name || 'P')}&backgroundColor=008080,009688,4caf50&backgroundType=gradient`;
    }

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled || pages.length === 0}
                className="w-full flex items-center justify-between p-2 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                {selectedPage ? (
                    <span className="flex items-center gap-2 overflow-hidden">
                        <img src={getPagePictureUrl(selectedPage)} alt={selectedPage.name} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                        <span className="font-medium text-sm text-left truncate">{selectedPage.name}</span>
                    </span>
                ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">Select a Page...</span>
                )}
                <ChevronDownIcon className={`transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto animate-fade-in-fast">
                    <ul role="listbox">
                        {pages.map(page => (
                            <li
                                key={page.id}
                                onClick={() => handleSelect(page)}
                                className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                                role="option"
                                aria-selected={selectedPage?.id === page.id}
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <img src={getPagePictureUrl(page)} alt={page.name} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                                    <span className="truncate">{page.name}</span>
                                </div>
                                {selectedPage?.id === page.id && <CheckIcon className="text-blue-600 flex-shrink-0" />}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};