

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    PROFESSIONAL_DASHBOARD_DATA, ProDashboardTool, PostType,
    INSPIRATION_HUB_SYSTEM_INSTRUCTION, INSPIRATION_HUB_SCHEMA, InspirationData,
    TrendingTopic, TopHashtag, ViralFormat,
} from '../constants';
import { generateContent } from '../services/geminiService';
import { Tabs } from './ui/Tabs';
import {
    DiscoverIcon, MentionsIcon, TagsIcon, GoLiveIcon, DollarSignIcon, PayoutsIcon,
    PlaylistsIcon, ABTestsIcon, ContentLibraryIcon, CollaborationsIcon,
    LightBulbIcon, ErrorIcon, TrendingUpIcon, HashtagIcon, CubeIcon, CopyIcon, CheckIcon
} from './ui/icons';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import MonetizationDashboard from './MonetizationDashboard';


interface ProfessionalDashboardProps {
    onSelectInspiration: (prompt: string, postType?: PostType) => void;
    showToast: (message: string, type: 'success' | 'error') => void;
}

const iconMap: Record<string, React.FC<{className?: string}>> = {
    'Discover groups': DiscoverIcon,
    'Mentions': MentionsIcon,
    'Tags': TagsIcon,
    'Go Live': GoLiveIcon,
    'Monetization': DollarSignIcon,
    'Payouts': PayoutsIcon,
    'Playlists': PlaylistsIcon,
    'A/B Tests': ABTestsIcon,
    'Content library': ContentLibraryIcon,
    'Collaborations': CollaborationsIcon,
};

const ToolCard: React.FC<{ tool: ProDashboardTool }> = ({ tool }) => {
    const IconComponent = iconMap[tool.name] || CubeIcon;
    return (
        <div className="flex items-start gap-4 p-4 bg-white/50 dark:bg-gray-800/60 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/50 dark:hover:border-blue-400/50 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5">
            <div className="flex-shrink-0 text-blue-500 dark:text-blue-400 mt-1">
                <IconComponent className="h-6 w-6" />
            </div>
            <div>
                <p className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    {tool.name}
                    {tool.feature && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tool.feature === 'New' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'}`}>
                            {tool.feature}
                        </span>
                    )}
                </p>
                {tool.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tool.description}</p>}
            </div>
        </div>
    );
};

// --- Inspiration Card Components ---

const TrendingTopicCard: React.FC<{ item: TrendingTopic, onSelect: (prompt: string) => void }> = ({ item, onSelect }) => (
    <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg space-y-2">
        <h4 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2"><TrendingUpIcon className="h-5 w-5 text-green-500"/>{item.topic}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">{item.rationale}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
        <Button onClick={() => onSelect(item.topic)} variant="secondary" className="w-full !py-1.5 !text-sm mt-2">
            Use Topic
        </Button>
    </div>
);

const TopHashtagCard: React.FC<{ item: TopHashtag, showToast: ProfessionalDashboardProps['showToast'] }> = ({ item, showToast }) => {
    const [copied, setCopied] = useState(false);
    const popularityColor = item.popularity_score > 75 ? 'bg-green-500' : item.popularity_score > 50 ? 'bg-yellow-500' : 'bg-orange-500';

    const handleCopy = () => {
        navigator.clipboard.writeText(item.hashtag);
        setCopied(true);
        showToast(`Copied ${item.hashtag} to clipboard!`, 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg space-y-2">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2"><HashtagIcon className="h-5 w-5 text-blue-500"/>{item.hashtag}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.usage_tip}</p>
                </div>
                <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 flex-shrink-0">
                    {copied ? <CheckIcon className="h-5 w-5 text-green-500"/> : <CopyIcon />}
                </button>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div className={`${popularityColor} h-1.5 rounded-full`} style={{ width: `${item.popularity_score}%` }}></div>
            </div>
        </div>
    );
};

const ViralFormatCard: React.FC<{ item: ViralFormat, onSelect: (prompt: string) => void }> = ({ item, onSelect }) => (
     <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg space-y-2">
        <h4 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2"><CubeIcon className="h-5 w-5 text-purple-500"/>{item.format_name}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
        <div className="text-xs text-gray-500 dark:text-gray-400 p-2 bg-black/5 dark:bg-white/5 rounded">
            <span className="font-semibold">Example:</span> <span className="italic">"{item.example_idea}"</span>
        </div>
        <Button onClick={() => onSelect(item.example_idea)} variant="secondary" className="w-full !py-1.5 !text-sm mt-2">
            Use This Idea
        </Button>
    </div>
);

const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ onSelectInspiration, showToast }) => {
    const [activeInspirationTab, setActiveInspirationTab] = useState<'topics' | 'hashtags' | 'formats'>('topics');
    const [inspirationData, setInspirationData] = useState<InspirationData | null>(null);
    const [isLoadingInspirations, setIsLoadingInspirations] = useState(false);
    const [inspirationError, setInspirationError] = useState<string | null>(null);
    const [view, setView] = useState<'main' | 'monetization'>('main');
    
    const handleGenerateInspirations = useCallback(async () => {
        setIsLoadingInspirations(true);
        setInspirationError(null);
        setInspirationData(null);
        try {
            const response = await generateContent('gemini-2.5-flash', 'Generate content inspiration for a Science & Tech brand.', {
                systemInstruction: INSPIRATION_HUB_SYSTEM_INSTRUCTION,
                responseMimeType: 'application/json',
                responseSchema: INSPIRATION_HUB_SCHEMA,
                temperature: 0.8
            });
            
            const jsonText = response.text.trim();
            const parsedData = JSON.parse(jsonText);
            setInspirationData(parsedData);

        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to generate inspirations.";
            console.error("Inspiration Hub Error:", msg);
            setInspirationError("Sorry, we couldn't fetch inspirations at the moment. Please try again later.");
            showToast(msg, 'error');
        } finally {
            setIsLoadingInspirations(false);
        }
    }, [showToast]);

    const fadeAnimation = {
        key: view,
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 }
    };

    return (
        <AnimatePresence mode="wait">
             {view === 'monetization' ? (
                <motion.div {...fadeAnimation}>
                    <MonetizationDashboard onBack={() => setView('main')} />
                </motion.div>
            ) : (
                <motion.div {...fadeAnimation}>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                           Growth & Insights Engine
                        </h2>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                            Your central hub for content strategy, audience engagement, and monetization tools.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* --- LEFT COLUMN: TOOLS --- */}
                        <div className="space-y-6">
                            {PROFESSIONAL_DASHBOARD_DATA.map(category => (
                                <div key={category.category_name}>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b-2 border-gray-200/50 dark:border-gray-700/50">{category.category_name}</h3>
                                    <div className="space-y-3">
                                        {category.items.map(tool => {
                                             const card = <ToolCard key={tool.name} tool={tool} />;
                                             if (tool.name === 'Monetization') {
                                                 return (
                                                     <div key={tool.name} onClick={() => setView('monetization')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setView('monetization')}>
                                                         {card}
                                                     </div>
                                                 )
                                             }
                                             return card;
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* --- RIGHT COLUMN: INSPIRATION HUB --- */}
                         <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-white/10 lg:sticky lg:top-8 self-start">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200 flex items-center gap-2"><LightBulbIcon className="h-6 w-6 text-yellow-500"/>Inspiration Hub</h3>
         fzFzaapaaaap                           <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Generate fresh ideas for your next post.</p>
                                </div>
                                <Button onClick={handleGenerateInspirations} disabled={isLoadingInspirations} className="flex-shrink-0">
                                    {isLoadingInspirations ? <Loader text="Generating..." /> : 'Get Ideas'}
                🤙🤙                </Button>
                            </div>

                            <div className="mt-4 border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
                                {isLoadingInspirations ? (
                                    <div className="flex justify-center items-center h-48"><Loader text="Finding the latest trends..." /></div>
                                ) : inspirationError ? (
                                    <div className="flex flex-col justify-center items-center h-48 text-center text-red-600 dark:text-red-400">
                                        <ErrorIcon className="h-8 w-8 mb-2" />
                                        <p className="font-semibold">Error</p>
                                        <p className="text-sm">{inspirationError}</p>
                                    </div>
                                ) : inspirationData ? (
                                    <div>
                                        <Tabs
                                            options={[
                                                { value: 'topics', label: 'Trending Topics' },
                                                { value: 'hashtags', label: 'Top Hashtags' },
                                                { value: 'formats', label: 'Viral Formats' },
                                            ]}
                                            active={activeInspirationTab}
                                            onSelect={(tab) => setActiveInspirationTab(tab as any)}
                                             />
                                        <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                                            {activeInspirationTab === 'topics' && inspirationData.trending_topics.map(item => <TrendingTopicCard key={item.topic} item={item} onSelect={onSelectInspiration}/>)}
                                            {activeInspirationTab === 'hashtags' && inspirationData.top_hashtags.map(item => <TopHashtagCard key={item.hashtag} item={item} showToast={showToast} />)}
                                            {activeInspirationTab === 'formats' && inspirationData.viral_formats.map(item => <ViralFormatCard key={item.format_name} item={item} onSelect={onSelectInspiration}/>)}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col justify-center items-center h-48 text-center text-gray-500 dark:text-gray-400">
                                        <LightBulbIcon className="h-10 w-10 mb-2"/>
                                        <p className="font-semibold">Ready for inspiration?</p>
                                        <p className="text-sm">Click "Get Ideas" to discover trending content.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProfessionalDashboard;