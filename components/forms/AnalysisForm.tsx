import React from 'react';

interface AnalysisFormProps {
    url: string;
    setUrl: (url:string) => void;
    topic: string;
    setTopic: (topic: string) => void;
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({ url, setUrl, topic, setTopic }) => {
    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="url" className="font-semibold text-gray-800 dark:text-gray-200">
                    URL to Analyze
                </label>
                <input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="e.g., https://creators.facebook.com/blog/..."
                    className="w-full mt-1 p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
            </div>
            <div>
                <label htmlFor="topic" className="font-semibold text-gray-800 dark:text-gray-200">
                    Analysis Prompt / Topic
                </label>
                <textarea
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={"e.g., Summarize key takeaways for creators from this article."}
                    className="w-full mt-1 p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    rows={4}
                />
            </div>
        </div>
    );
};
