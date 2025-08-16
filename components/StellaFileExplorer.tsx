import React from 'react';

const FileIcon: React.FC<{ extension: string }> = ({ extension }) => {
    const colorClasses: { [key: string]: string } = {
        file: 'text-gray-500',
        model: 'text-purple-500',
        txt: 'text-blue-500',
        dict: 'text-green-500',
        pt: 'text-orange-500',
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 flex-shrink-0 ${colorClasses[extension] || 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    );
};

const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
);


const files = {
    "Dialog Policy": [
        { name: "rbc_rules", extension: "file" },
    ],
    "NLU Models": [
        { name: "nlu_model", extension: "model" },
    ],
    "ASR Models": [
        { name: "asr_words.txt", extension: "txt" },
        { name: "asr_sp.model", extension: "model" },
        { name: "asr_sp.dict", extension: "dict" },
        { name: "asr_sid_model.pt", extension: "pt" },
        { name: "asr_pytorchmodel.pt", extension: "pt" },
        { name: "asr_profanity_list.txt", extension: "txt" },
    ],
};

export const StellaFileExplorer: React.FC = () => {
    return (
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Stella (es_US)</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                This is a simulation representing the underlying models and files for the 'Stella' voice assistant.
            </p>
            <div className="space-y-3">
                {Object.entries(files).map(([folderName, folderFiles]) => (
                    <div key={folderName}>
                        <div className="flex items-center">
                            <FolderIcon />
                            <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{folderName}</span>
                        </div>
                        <ul className="pl-7 mt-1 space-y-1">
                            {folderFiles.map((file, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <FileIcon extension={file.extension} />
                                    <span>{file.name}</span>
                                    <span className="ml-1 text-gray-400 dark:text-gray-500">(.{file.extension})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};