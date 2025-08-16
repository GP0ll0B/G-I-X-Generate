
import React from 'react';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';

interface ManualTokenInfoProps {
    manualToken: string;
    setManualToken: (token: string) => void;
    manualPageId: string;
    setManualPageId: (id: string) => void;
    onConnect: () => void;
    isConnecting: boolean;
    error: string | null;
}

export const ManualTokenInfo: React.FC<ManualTokenInfoProps> = ({
    manualToken,
    setManualToken,
    manualPageId,
    setManualPageId,
    onConnect,
    isConnecting,
    error,
}) => {
    return (
        <div className="p-3 bg-blue-500/10 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-lg space-y-3">
            <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-300">Connect with an Access Token</h4>
            <input 
                type="password" 
                placeholder="Page Access Token" 
                value={manualToken} 
                onChange={(e) => setManualToken(e.target.value)} 
                className="w-full p-2 text-xs border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
            <input 
                type="text" 
                placeholder="Facebook Page ID" 
                value={manualPageId} 
                onChange={(e) => setManualPageId(e.target.value)} 
                className="w-full p-2 text-xs border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
            <Button 
                onClick={onConnect} 
                disabled={isConnecting || !manualToken || !manualPageId} 
                className="w-full text-sm py-2"
            >
                {isConnecting ? <Loader text="Connecting..." /> : 'Connect with Token'}
            </Button>
            {error && <p className="text-xs text-red-600 dark:text-red-400 text-center">{error}</p>}
        </div>
    );
};
