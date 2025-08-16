import React from 'react';
import { GuidedPostInput } from '../../constants';

interface GuidedPostFormProps {
    guidedInput: GuidedPostInput;
    setGuidedInput: React.Dispatch<React.SetStateAction<GuidedPostInput>>;
}

export const GuidedPostForm: React.FC<GuidedPostFormProps> = ({ guidedInput, setGuidedInput }) => {
    const handleGuidedInputChange = (field: keyof GuidedPostInput, value: string) => {
        setGuidedInput(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="monetization-feature" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">1. Monetization Feature</label>
                <select
                    id="monetization-feature"
                    value={guidedInput.monetizationFeature}
                    onChange={(e) => handleGuidedInputChange('monetizationFeature', e.target.value)}
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                >
                    <option>Stars</option>
                    <option>Fan Subscriptions</option>
                    <option>In-Stream Ads</option>
                    <option>Branded Content</option>
                    <option>Performance Bonus Program</option>
                </select>
            </div>
            <div>
                <label htmlFor="target-audience" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">2. Target Audience</label>
                    <select
                    id="target-audience"
                    value={guidedInput.targetAudience}
                    onChange={(e) => handleGuidedInputChange('targetAudience', e.target.value)}
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                >
                    <option>General Creators</option>
                    <option>Gaming Creators</option>
                    <option>Artists & Musicians</option>
                    <option>Educators & Coaches</option>
                    <option>Lifestyle & Vloggers</option>
                </select>
            </div>
            <div>
                <label htmlFor="key-tip" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">3. Key Tip or CTA</label>
                <textarea
                    id="key-tip"
                    value={guidedInput.keyTip}
                    onChange={(e) => handleGuidedInputChange('keyTip', e.target.value)}
                    placeholder="e.g., Remind your viewers that Stars can be sent on any post type, not just videos!"
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    rows={3}
                />
            </div>
        </div>
    );
};
