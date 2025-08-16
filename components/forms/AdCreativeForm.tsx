import React from 'react';
import { AdCreativeInput } from '../../constants';

interface AdCreativeFormProps {
    adCreativeInput: AdCreativeInput;
    setAdCreativeInput: React.Dispatch<React.SetStateAction<AdCreativeInput>>;
}

export const AdCreativeForm: React.FC<AdCreativeFormProps> = ({ adCreativeInput, setAdCreativeInput }) => {
    const handleAdInputChange = (field: keyof AdCreativeInput, value: string) => {
        setAdCreativeInput(prev => ({ ...prev, [field]: value } as AdCreativeInput));
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="product-service" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">1. Product or Service</label>
                <textarea
                    id="product-service"
                    value={adCreativeInput.productOrService}
                    onChange={(e) => handleAdInputChange('productOrService', e.target.value)}
                    placeholder="e.g., An online course on ethical AI development"
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    rows={2}
                />
            </div>
            <div>
                <label htmlFor="ad-target-audience" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">2. Target Audience</label>
                <textarea
                    id="ad-target-audience"
                    value={adCreativeInput.targetAudience}
                    onChange={(e) => handleAdInputChange('targetAudience', e.target.value)}
                    placeholder="e.g., Junior developers interested in AI ethics"
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    rows={2}
                />
            </div>
            <div>
                <label htmlFor="ad-cta" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block">3. Call to Action</label>
                    <select
                    id="ad-cta"
                    value={adCreativeInput.callToAction}
                    onChange={(e) => handleAdInputChange('callToAction', e.target.value)}
                    className="w-full p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                >
                    <option>Learn More</option>
                    <option>Shop Now</option>
                    <option>Sign Up</option>
                    <option>Subscribe</option>
                    <option>Contact Us</option>
                </select>
            </div>
            <div className="border-t border-gray-200/50 dark:border-gray-600/50 pt-4 space-y-4">
                <div>
                    <label htmlFor="required-keywords" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block text-sm">Ad Guardrails: Required Keywords (optional)</label>
                    <textarea
                        id="required-keywords"
                        value={adCreativeInput.requiredKeywords}
                        onChange={(e) => handleAdInputChange('requiredKeywords', e.target.value)}
                        placeholder="e.g., sustainable, free shipping, ethical"
                        className="w-full p-2 text-sm border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        rows={2}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Comma-separated words that must appear in the ad.</p>
                    </div>
                    <div>
                    <label htmlFor="banned-words" className="font-semibold text-gray-800 dark:text-gray-200 mb-1 block text-sm">Ad Guardrails: Banned Words (optional)</label>
                    <textarea
                        id="banned-words"
                        value={adCreativeInput.bannedWords}
                        onChange={(e) => handleAdInputChange('bannedWords', e.target.value)}
                        placeholder="e.g., guaranteed, miracle, limited time"
                        className="w-full p-2 text-sm border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        rows={2}
                    />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Comma-separated words that must not appear in the ad.</p>
                    </div>
            </div>
        </div>
    );
};
