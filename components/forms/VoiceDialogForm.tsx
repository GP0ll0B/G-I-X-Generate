import React from 'react';
import { VoiceDialogInput } from '../../constants';

interface VoiceDialogFormProps {
    voiceDialogInput: VoiceDialogInput;
    setVoiceDialogInput: React.Dispatch<React.SetStateAction<VoiceDialogInput>>;
}

export const VoiceDialogForm: React.FC<VoiceDialogFormProps> = ({ voiceDialogInput, setVoiceDialogInput }) => {
    const handleInputChange = (field: keyof VoiceDialogInput, value: string) => {
        setVoiceDialogInput(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="dialog-type" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">1. Dialog Type</label>
                <select
                    id="dialog-type"
                    value={voiceDialogInput.dialogType}
                    onChange={(e) => handleInputChange('dialogType', e.target.value)}
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                >
                    <option>Send Text Message</option>
                    <option>Create Call</option>
                    <option>Cancel Action</option>
                </select>
            </div>
            <div>
                <label htmlFor="scenario" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">2. Scenario</label>
                <textarea
                    id="scenario"
                    value={voiceDialogInput.scenario}
                    onChange={(e) => handleInputChange('scenario', e.target.value)}
                    placeholder="e.g., Send a text to my mom saying I'll be late for dinner."
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    rows={3}
                />
            </div>
        </div>
    );
};