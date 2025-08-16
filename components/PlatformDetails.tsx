import React, { useState } from 'react';
import { PLATFORM_METADATA } from '../constants';
import { ChevronDownIcon, InfoIcon } from './ui/icons';

export const PlatformDetails: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center text-left"
          aria-expanded={isOpen}
        >
            <h3 className="flex items-center gap-2 font-semibold text-lg text-gray-800 dark:text-gray-200">
                <InfoIcon />
                Platform Metadata
            </h3>
            <ChevronDownIcon className={isOpen ? 'rotate-180' : ''} />
        </button>

        {isOpen && (
            <div className="mt-3 bg-black/5 dark:bg-white/5 p-4 text-xs text-gray-600 dark:text-gray-300 rounded-lg animate-fade-in-fast">
                <p className="mb-4 italic">
                    This is a simulation representing the cryptographic signatures and permissions used by official apps to ensure authenticity and functionality.
                </p>
                <div className="space-y-4">
                    {Object.entries(PLATFORM_METADATA).map(([id, data]) => (
                        <div key={id}>
                            <p className="font-semibold text-gray-700 dark:text-gray-200">
                                {data.appName} <span className="font-normal text-gray-500">({id})</span>
                            </p>
                            <div className="pl-2 mt-1 font-mono">
                                <div className="break-all">
                                    <p><span className="text-gray-500">Algorithm:</span> {data.signature.algorithm}</p>
                                    <p><span className="text-gray-500">Signature:</span> {data.signature.value}</p>
                                </div>
                                <div className="mt-2">
                                    <p className="text-gray-500">Permissions:</p>
                                    <ul className="list-disc list-inside pl-2 space-y-0.5">
                                        {(data.permissions || []).map((permission) => (
                                            <li key={permission}>
                                                <span className="text-gray-600 dark:text-gray-400">{permission}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};