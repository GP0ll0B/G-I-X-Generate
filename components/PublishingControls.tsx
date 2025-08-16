
import React from 'react';
import { FacebookPage } from '../constants';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { SendIcon } from './ui/icons';
import { PageSelector } from './ui/PageSelector';

interface PublishingControlsProps {
    onPublish: () => void;
    isPublishing: boolean;
    buttonText: string;
    isButtonDisabled: boolean;
    publishStatus: 'idle' | 'publishing' | 'success' | 'error';
    error: string | null;
    pages: FacebookPage[];
    selectedPage: FacebookPage | null;
    onSelectPage: (page: FacebookPage | null) => void;
}

export const PublishingControls: React.FC<PublishingControlsProps> = ({
    onPublish,
    isPublishing,
    buttonText,
    isButtonDisabled,
    publishStatus,
    error,
    pages,
    selectedPage,
    onSelectPage,
}) => {
    return (
        <>
            <PageSelector
                pages={pages}
                selectedPage={selectedPage}
                onSelectPage={onSelectPage}
                disabled={pages.length === 0}
            />
            <Button 
                onClick={onPublish} 
                disabled={isButtonDisabled} 
                className={`w-full transition-all ${publishStatus === 'success' ? '!bg-green-600 hover:!bg-green-700' : publishStatus === 'error' ? '!bg-red-600 hover:!bg-red-700' : ''}`}
            >
                {isPublishing ? <Loader text={buttonText} /> : <SendIcon />}
                {buttonText}
            </Button>
            {error && publishStatus === 'error' && <p className="text-xs text-red-600 dark:text-red-400 text-center">{error}</p>}
        </>
    );
};
