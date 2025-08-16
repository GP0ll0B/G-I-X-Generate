import React from 'react';
import { UseCase } from '../../constants';

interface UseCaseCardProps {
    useCase: UseCase;
    onSelect: () => void;
    icon: React.ReactNode;
}

export const UseCaseCard: React.FC<UseCaseCardProps> = ({ useCase, onSelect, icon }) => {
    return (
        <button
            onClick={onSelect}
            className="w-full h-full text-left p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
            <div className="text-blue-500 dark:text-blue-400 mb-3">{icon}</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{useCase.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {useCase.description}
            </p>
        </button>
    );
};