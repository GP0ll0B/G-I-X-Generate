import React from 'react';
import { GeneratedContent } from '../constants';
import { PostHeader } from './PostHeader';
import { PlatformDetails } from './PlatformDetails';
import { MicrophoneIcon } from './ui/icons';
import { StellaFileExplorer } from './StellaFileExplorer';

interface FacebookVoiceDialogPostProps {
  post: Extract<GeneratedContent, { type: 'voice_dialog' }>;
}

const ChatBubble: React.FC<{ speaker: 'User' | 'Stella', text: string }> = ({ speaker, text }) => {
    const isUser = speaker === 'User';
    return (
        <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm">
                   S
                </div>
            )}
            <div className={`max-w-md p-3 rounded-2xl ${isUser ? 'bg-blue-500 text-white rounded-br-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-lg'}`}>
                <p className="text-sm">{text}</p>
            </div>
             {isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">
                   U
                </div>
            )}
        </div>
    );
};


export const FacebookVoiceDialogPost: React.FC<FacebookVoiceDialogPostProps> = ({ post }) => {
    const { dialogType, scenario, dialog } = post;

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
            <div className="p-4 sm:p-6">
                <PostHeader />
                <div className="mt-4">
                     <h3 className="flex items-center gap-2 font-semibold text-lg text-gray-800 dark:text-gray-200">
                        <MicrophoneIcon />
                        Voice Assistant Dialog
                    </h3>
                    <div className="mt-2 p-3 bg-black/5 dark:bg-white/5 rounded-lg text-sm">
                        <p><span className="font-semibold">Type:</span> {dialogType}</p>
                        <p><span className="font-semibold">Scenario:</span> <span className="italic">"{scenario}"</span></p>
                        <p><span className="font-semibold">Assistant:</span> Stella <span className="text-xs text-gray-500">(es_US)</span></p>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="space-y-4">
                    {dialog.map((turn, index) => (
                        <ChatBubble key={index} speaker={turn.speaker} text={turn.line} />
                    ))}
                </div>
            </div>
            
            <StellaFileExplorer />

            <PlatformDetails />
        </div>
    );
};