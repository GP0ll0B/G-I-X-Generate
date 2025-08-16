import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full py-6 px-4 mt-auto">
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200/50 dark:border-gray-700/50 pt-6 max-w-7xl mx-auto">
                <p className="mb-2">
                    Copyright &copy; {new Date().getFullYear()} G|I|X Generate. A project by Gazi Pollob Hussain.
                </p>
                <div className="flex justify-center items-center gap-x-3 flex-wrap">
                    <a href="#" className="hover:text-blue-500 hover:underline transition-colors">Privacy</a>
                    <span className="text-gray-400 dark:text-gray-500">·</span>
                    <a href="#" className="hover:text-blue-500 hover:underline transition-colors">Terms</a>
                    <span className="text-gray-400 dark:text-gray-500">·</span>
                    <a href="#" className="hover:text-blue-500 hover:underline transition-colors">Advertising</a>
                    <span className="text-gray-400 dark:text-gray-500">·</span>
                    <a href="#" className="hover:text-blue-500 hover:underline transition-colors">Ad Choices</a>
                    <span className="text-gray-400 dark:text-gray-500">·</span>
                    <a href="#" className="hover:text-blue-500 hover:underline transition-colors">Cookies</a>
                </div>
            </div>
        </footer>
    );
};