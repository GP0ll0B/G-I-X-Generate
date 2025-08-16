import React from 'react';
import { ALL_TOOLS_DATA } from '../constants';
import { ExternalLinkIcon } from './ui/icons';

const AllToolsView: React.FC = () => {
    return (
        <div className="animate-fade-in-fast">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
                All Business Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {ALL_TOOLS_DATA.map(category => (
                    <div key={category.title} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-md border border-white/20 dark:border-white/10 p-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 border-b border-gray-200/50 dark:border-gray-700/50 pb-2">
                            {category.title}
                        </h3>
                        {category.extraLink && (
                            <a 
                                href={category.extraLink.href} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline mb-3"
                            >
                                {category.extraLink.text}
                            </a>
                        )}
                        <ul className="space-y-2">
                            {category.tools.map(tool => {
                                const content = (
                                    <div className="flex items-center gap-3 w-full">
                                        <img src={tool.icon} alt={`${tool.name} icon`} className="w-5 h-5 flex-shrink-0" />
                                        <div className="flex-grow">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{tool.name}</p>
                                            {tool.description && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{tool.description}</p>
                                            )}
                                        </div>
                                        {tool.link && <ExternalLinkIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />}
                                    </div>
                                );

                                if (tool.link) {
                                    return (
                                        <li key={tool.name}>
                                            <a 
                                                href={tool.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors duration-200"
                                            >
                                                {content}
                                            </a>
                                        </li>
                                    );
                                }

                                return (
                                    <li key={tool.name} className="flex p-2 rounded-lg">
                                        {content}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllToolsView;
