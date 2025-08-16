





import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    PostType, GeneratedContent, ToastData, Theme, GuidedPostInput, AdCreativeInput,
    META_ADS_HISTORY, UseCase, VoiceDialogInput, USE_CASES
} from './constants';
import { useContentGenerator } from './hooks/useContentGenerator';

import { Toast } from './components/ui/Toast';
import { MoonIcon, SunIcon } from './components/ui/icons';
import { GanttChart } from './components/GanttChart';
import { ControlPanel } from './components/layout/ControlPanel';
import { PreviewStage } from './components/layout/PreviewStage';
import { Header } from './components/layout/Header';
import { PublishModal } from './components/modals/PublishModal';
import { FacebookStrategyPost } from './components/FacebookStrategyPost';
import { UseCaseSelection } from './components/layout/UseCaseSelection';
import { Footer } from './components/layout/Footer';
import AllToolsView from './components/AllToolsView';
import ProfessionalDashboard from './components/ProfessionalDashboard';
import SkillsDashboard from './components/SkillsDashboard';
import { MathEquationView } from './components/MathEquationView';

// =================================================================
// THEME TOGGLE COMPONENT
// =================================================================
interface ThemeToggleProps {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => (
    <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-200/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
);

type View = 'useCaseSelection' | 'generator';

// =================================================================
// APP COMPONENT
// =-===============================================================
const App: React.FC = () => {
  const fadeAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const [currentView, setCurrentView] = useState<View>('useCaseSelection');
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);

  // Input State
  const [topic, setTopic] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [postType, setPostType] = useState<PostType>('text');
  const [videoInputImage, setVideoInputImage] = useState<{ data: string; type: string; } | null>(null);
  const [guidedInput, setGuidedInput] = useState<GuidedPostInput>({
    monetizationFeature: 'Stars',
    targetAudience: 'General Creators',
    keyTip: ''
  });
  const [adCreativeInput, setAdCreativeInput] = useState<AdCreativeInput>({
      productOrService: '',
      targetAudience: '',
      callToAction: 'Learn More',
      requiredKeywords: '',
      bannedWords: '',
  });
   const [voiceDialogInput, setVoiceDialogInput] = useState<VoiceDialogInput>({
    dialogType: 'Send Text Message',
    scenario: ''
  });
  const [numVariations, setNumVariations] = useState<number>(1);
  const [temperature, setTemperature] = useState<number>(0.7);

  // App Status State
  const [toast, setToast] = useState<ToastData | null>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);


  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  // Custom hook for content generation logic
  const {
    contentVariations,
    currentVariationIndex,
    isLoading,
    isGeneratingImage,
    error,
    setError,
    handleGeneratePost: generatePosts,
    handleImagePromptChange,
    handleFinalImageGeneration,
    setCurrentVariationIndex,
    setContentVariations
  } = useContentGenerator({ showToast });

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Skills progress management
  useEffect(() => {
      const savedProgress = localStorage.getItem('completedChallenges');
      if (savedProgress) {
          setCompletedChallenges(JSON.parse(savedProgress));
      }
  }, []);

  useEffect(() => {
      localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
  }, [completedChallenges]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const handleUseCaseSelect = (useCase: UseCase) => {
    // Reset all generator state
    setContentVariations([]);
    setCurrentVariationIndex(0);
    setError(null);
    setUrl('');
    setVideoInputImage(null);
    setGuidedInput({ monetizationFeature: 'Stars', targetAudience: 'General Creators', keyTip: '' });
    setAdCreativeInput({ productOrService: '', targetAudience: '', callToAction: 'Learn More', requiredKeywords: '', bannedWords: ''});
    setVoiceDialogInput({ dialogType: 'Send Text Message', scenario: '' });
    setNumVariations(1);

    // Configure generator based on use case
    setSelectedUseCase(useCase);
    setPostType(useCase.targetPostType || 'text');
    setTopic(useCase.initialPrompt || '');
    if (useCase.targetPostType === 'voice_dialog') {
        setVoiceDialogInput(prev => ({ ...prev, scenario: useCase.initialPrompt || ''}))
    }

    // Switch view
    if (useCase.targetPostType) {
        setCurrentView('generator');
    } else {
        showToast('This use case is for informational purposes and does not have a content generator attached.', 'success');
    }
  };

  const handleBackToUseCases = () => {
      setCurrentView('useCaseSelection');
      setSelectedUseCase(null);
      setVideoInputImage(null);
  };
  
  const handleGenerateClick = useCallback(() => {
    generatePosts({
      postType,
      topic,
      url,
      guidedInput,
      adCreativeInput,
      voiceDialogInput,
      videoInputImage,
      numVariations,
      temperature
    });
  }, [
    generatePosts, postType, topic, url, guidedInput,
    adCreativeInput, voiceDialogInput, videoInputImage, numVariations, temperature
  ]);
  
  const handleSelectInspiration = (prompt: string, postType: PostType = 'text') => {
    const targetUseCase = USE_CASES.find(uc => uc.targetPostType === postType);
    if (targetUseCase) {
        handleUseCaseSelect(targetUseCase);
        // Use a timeout to ensure the state update happens after the view switch and state reset
        setTimeout(() => setTopic(prompt), 0); 
    } else {
        // Fallback for post types without a direct use case entry
        setPostType(postType);
        setTopic(prompt);
        setCurrentView('generator');
    }
  };

  const currentPost = contentVariations.length > 0 ? contentVariations[currentVariationIndex] : null;

  const showTwoColumnLayout = currentView === 'generator' && !['strategy', 'gantt', 'all_tools', 'professional_dashboard', 'skills_dashboard', 'math_equation'].includes(postType);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="relative flex-grow">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <AnimatePresence>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </AnimatePresence>
        <AnimatePresence>
            {isPublishModalOpen && (
                <PublishModal
                    isOpen={isPublishModalOpen}
                    onClose={() => setIsPublishModalOpen(false)}
                    generatedContent={currentPost}
                    showToast={showToast}
                />
            )}
        </AnimatePresence>

        <div className="container mx-auto px-4 py-8">
            <Header 
            view={currentView}
            useCaseTitle={selectedUseCase?.title}
            onBack={currentView === 'generator' ? handleBackToUseCases : undefined}
            />
            
            <main className="mt-8">
            <AnimatePresence mode="wait">
                {currentView === 'useCaseSelection' && (
                <motion.div key="selection" {...fadeAnimation as any}>
                    <UseCaseSelection onSelectUseCase={handleUseCaseSelect} />
                </motion.div>
                )}

                {currentView === 'generator' && (
                <motion.div key="generator" {...fadeAnimation as any}>
                    {showTwoColumnLayout ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
                        <ControlPanel
                            postType={postType}
                            onTabSelect={setPostType}
                            topic={topic}
                            setTopic={setTopic}
                            url={url}
                            setUrl={setUrl}
                            guidedInput={guidedInput}
                            setGuidedInput={setGuidedInput}
                            adCreativeInput={adCreativeInput}
                            setAdCreativeInput={setAdCreativeInput}
                            voiceDialogInput={voiceDialogInput}
                            setVoiceDialogInput={setVoiceDialogInput}
                            videoInputImage={videoInputImage}
                            setVideoInputImage={setVideoInputImage}
                            numVariations={numVariations}
                            setNumVariations={setNumVariations}
                            temperature={temperature}
                            setTemperature={setTemperature}
                            onGenerate={handleGenerateClick}
                            isLoading={isLoading}
                            error={error}
                        />
                        <PreviewStage
                            isLoading={isLoading}
                            isGeneratingImage={isGeneratingImage}
                            postType={postType}
                            contentVariations={contentVariations}
                            currentVariationIndex={currentVariationIndex}
                            setCurrentVariationIndex={setCurrentVariationIndex}
                            onGenerateImage={handleFinalImageGeneration}
                            onPromptChange={handleImagePromptChange}
                            onPublish={() => setIsPublishModalOpen(true)}
                            showToast={showToast}
                        />
                    </div>
                    ) : (
                    <div className="animate-fade-in-fast">
                        {postType === 'gantt' && (
                            <div className="max-w-5xl mx-auto">
                            <GanttChart events={META_ADS_HISTORY} />
                            </div>
                        )}
                        {postType === 'all_tools' && (
                            <div className="max-w-7xl mx-auto">
                                <AllToolsView />
                            </div>
                        )}
                         {postType === 'math_equation' && (
                            <div className="max-w-4xl mx-auto">
                                <MathEquationView />
                            </div>
                        )}
                        {postType === 'professional_dashboard' && (
                            <div className="max-w-7xl mx-auto">
                                <ProfessionalDashboard 
                                  onSelectInspiration={handleSelectInspiration}
                                  showToast={showToast}
                                />
                            </div>
                        )}
                        {postType === 'skills_dashboard' && (
                            <div className="max-w-7xl mx-auto">
                                <SkillsDashboard 
                                    completedChallenges={completedChallenges} 
                                    setCompletedChallenges={setCompletedChallenges}
                                    showToast={showToast} 
                                />
                            </div>
                        )}
                        {postType === 'strategy' && (
                            isLoading 
                            ? <div className="max-w-3xl mx-auto"><PreviewStage isLoading={true} postType={postType} contentVariations={[]} currentVariationIndex={currentVariationIndex} setCurrentVariationIndex={setCurrentVariationIndex} onPublish={() => setIsPublishModalOpen(true)} showToast={showToast} /></div>
                            : currentPost?.type === 'strategy' 
                            ? <div className="max-w-4xl mx-auto">
                                <FacebookStrategyPost post={currentPost} onCopy={() => showToast('Strategy JSON copied!', 'success')} onPublish={() => setIsPublishModalOpen(true)} />
                            </div>
                            : <div className="max-w-3xl mx-auto"><PreviewStage isLoading={false} postType={postType} contentVariations={[]} currentVariationIndex={currentVariationIndex} setCurrentVariationIndex={setCurrentVariationIndex} onPublish={() => setIsPublishModalOpen(true)} showToast={showToast} /></div>
                        )}
                    </div>
                    )}
                </motion.div>
                )}
            </AnimatePresence>
            </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;