

import React, { useState, useMemo } from 'react';
import { USE_CASES, UseCase, FilterCategory } from '../../constants';
import { UseCaseCard } from '../ui/UseCaseCard';
import { Tabs } from '../ui/Tabs';
import { MegaphoneIconLarge, DocumentTextIcon, ChatBubbleIcon, CubeIcon, GridIcon, ChartBarIcon } from '../ui/icons';

interface UseCaseSelectionProps {
    onSelectUseCase: (useCase: UseCase) => void;
}

const filterCategories: Array<{ value: FilterCategory, label: string }> = [
    { value: 'featured', label: 'Featured' },
    { value: 'all', label: 'All' },
    { value: 'ads', label: 'Ads and monetization' },
    { value: 'content', label: 'Content management' },
    { value: 'messaging', label: 'Business messaging' },
    { value: 'other', label: 'Others' },
];

const getUseCaseIcon = (useCase: UseCase): React.ReactNode => {
    if (useCase.id === 'all-tools') return <GridIcon />;
    if (useCase.id === 'ai-performance-model') return <ChartBarIcon />;

    const primaryCategory = useCase.categories.find(c => c !== 'featured');
    switch (primaryCategory) {
        case 'ads':
            return <MegaphoneIconLarge />;
        case 'content':
            return <DocumentTextIcon />;
        case 'messaging':
            return <ChatBubbleIcon />;
        case 'other':
        default:
            return <CubeIcon />;
    }
};

export const UseCaseSelection: React.FC<UseCaseSelectionProps> = ({ onSelectUseCase }) => {
    const [activeFilter, setActiveFilter] = useState<FilterCategory>('featured');

    const getCount = (category: FilterCategory) => {
        if (category === 'all') return USE_CASES.length;
        return USE_CASES.filter(uc => uc.categories.includes(category)).length;
    };

    const filteredUseCases = useMemo(() => {
        if (activeFilter === 'all') {
            return USE_CASES;
        }
        return USE_CASES.filter(uc => uc.categories.includes(activeFilter));
    }, [activeFilter]);
    
    const tabOptions = filterCategories.map(cat => ({
        value: cat.value,
        label: `${cat.label} (${getCount(cat.value)})`
    }));

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Filter by</h2>
                <Tabs<FilterCategory>
                    options={tabOptions}
                    active={activeFilter}
                    onSelect={setActiveFilter}
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUseCases.map(useCase => (
                    <UseCaseCard 
                        key={useCase.id}
                        useCase={useCase}
                        onSelect={() => onSelectUseCase(useCase)}
                        icon={getUseCaseIcon(useCase)}
                    />
                ))}
            </div>

            <div className="mt-12 text-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Looking for something else?</h3>
                <div 
                    className="mt-4 max-w-2xl mx-auto p-6 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => onSelectUseCase({
                        id: 'legacy-ai',
                        title: 'Enhance Legacy Apps with Google AI',
                        description: 'Use Google AI to generate content and strategies for older apps that rely on legacy permissions or APIs, giving them new life and capabilities.',
                        categories: ['other'],
                        targetPostType: 'text',
                        initialPrompt: "Generate a post announcing our legacy app's new AI-powered features."
                    })}
                >
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Enhance Legacy Apps with Google AI</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Leverage Google AI to modernize and extend your existing applications. Select this option if you are:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 text-left">
                        <li>Migrating an older app that relies on legacy permissions or APIs.</li>
                        <li>Looking for fine-grained control over individual app permissions.</li>
                        <li>Building custom integrations that the new experience doesn’t support.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};