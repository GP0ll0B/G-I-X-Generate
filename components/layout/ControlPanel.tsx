





import React, { useMemo } from 'react';
import { PostType, GuidedPostInput, AdCreativeInput, VoiceDialogInput } from '../../constants';
import { Tabs } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';
import { ChartBarIcon, FileJsonIcon, MegaphoneIcon, MicrophoneIcon, VideoCameraIcon, GridIcon, GrowthIcon } from '../ui/icons';
import { TopicForm } from '../forms/TopicForm';
import { GuidedPostForm } from '../forms/GuidedPostForm';
import { AdCreativeForm } from '../forms/AdCreativeForm';
import { AnalysisForm } from '../forms/AnalysisForm';
import { VoiceDialogForm } from '../forms/VoiceDialogForm';

interface ControlPanelProps {
  postType: PostType;
  onTabSelect: (type: PostType) => void;
  topic: string;
  setTopic: (topic: string) => void;
  url: string;
  setUrl: (url: string) => void;
  guidedInput: GuidedPostInput;
  setGuidedInput: React.Dispatch<React.SetStateAction<GuidedPostInput>>;
  adCreativeInput: AdCreativeInput;
  setAdCreativeInput: React.Dispatch<React.SetStateAction<AdCreativeInput>>;
  voiceDialogInput: VoiceDialogInput;
  setVoiceDialogInput: React.Dispatch<React.SetStateAction<VoiceDialogInput>>;
  videoInputImage: { data: string; type: string; } | null;
  setVideoInputImage: (image: { data: string; type: string; } | null) => void;
  numVariations: number;
  setNumVariations: (n: number) => void;
  temperature: number;
  setTemperature: (t: number) => void;
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
}

const PostTypeSpecificForm: React.FC<Pick<ControlPanelProps, 'postType' | 'topic' | 'setTopic' | 'url' | 'setUrl' | 'guidedInput' | 'setGuidedInput' | 'adCreativeInput' | 'setAdCreativeInput' | 'voiceDialogInput' | 'setVoiceDialogInput' | 'videoInputImage' | 'setVideoInputImage'>> = ({
  postType, topic, setTopic, url, setUrl, guidedInput, setGuidedInput, adCreativeInput, setAdCreativeInput, voiceDialogInput, setVoiceDialogInput, videoInputImage, setVideoInputImage
}) => {
  switch (postType) {
    case 'text':
    case 'grounded_text':
    case 'image':
    case 'video':
    case 'video_generation':
      return <TopicForm topic={topic} setTopic={setTopic} postType={postType} videoInputImage={videoInputImage} setVideoInputImage={setVideoInputImage} />;
    case 'analysis':
      return <AnalysisForm url={url} setUrl={setUrl} topic={topic} setTopic={setTopic} />;
    case 'guided':
      return <GuidedPostForm guidedInput={guidedInput} setGuidedInput={setGuidedInput} />;
    case 'ad':
      return <AdCreativeForm adCreativeInput={adCreativeInput} setAdCreativeInput={setAdCreativeInput} />;
    case 'voice_dialog':
      return <VoiceDialogForm voiceDialogInput={voiceDialogInput} setVoiceDialogInput={setVoiceDialogInput} />;
    case 'strategy':
    case 'gantt':
    case 'all_tools':
    case 'professional_dashboard':
    case 'skills_dashboard':
    default:
      return null;
  }
};


export const ControlPanel: React.FC<ControlPanelProps> = ({
  postType, onTabSelect, topic, setTopic, url, setUrl,
  guidedInput, setGuidedInput, adCreativeInput, setAdCreativeInput,
  voiceDialogInput, setVoiceDialogInput, videoInputImage, setVideoInputImage,
  numVariations, setNumVariations, temperature, setTemperature,
  onGenerate, isLoading, error
}) => {
  const tabsOptions = useMemo(() => [
    { value: 'text' as PostType, label: 'Text Post' },
    { value: 'guided' as PostType, label: 'Guided Post' },
    { value: 'ad' as PostType, label: 'Ad Campaign', icon: <MegaphoneIcon/> },
    { value: 'grounded_text' as PostType, label: 'Fact-Checked Post' },
    { value: 'image' as PostType, label: 'Image Post' },
    { value: 'video' as PostType, label: 'Video Script' },
    { value: 'video_generation' as PostType, label: 'Generate Video', icon: <VideoCameraIcon/> },
    { value: 'voice_dialog' as PostType, label: 'Voice Dialog', icon: <MicrophoneIcon /> },
    { value: 'analysis' as PostType, label: 'Analysis Post' },
    { value: 'strategy' as PostType, label: 'Strategy Plan', icon: <FileJsonIcon/> },
    { value: 'gantt' as PostType, label: 'Gantt Chart', icon: <ChartBarIcon/> },
    { value: 'professional_dashboard' as PostType, label: 'Page Growth', icon: <GrowthIcon /> },
    { value: 'all_tools' as PostType, label: 'All Tools', icon: <GridIcon /> },
  ], []);

  const showInputs = !['strategy', 'gantt', 'all_tools', 'professional_dashboard', 'skills_dashboard', 'math_equation'].includes(postType);

  return (
    <div className="lg:sticky lg:top-8 self-start">
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 sm:p-6 rounded-xl shadow-lg border border-white/20 dark:border-white/10">
        <div className="flex flex-col gap-4">
          <Tabs<PostType> options={tabsOptions} active={postType} onSelect={onTabSelect} />
          
          {showInputs && (
            <div className="animate-fade-in-fast space-y-4">
               <PostTypeSpecificForm
                postType={postType}
                topic={topic} setTopic={setTopic}
                url={url} setUrl={setUrl}
                guidedInput={guidedInput} setGuidedInput={setGuidedInput}
                adCreativeInput={adCreativeInput} setAdCreativeInput={setAdCreativeInput}
                voiceDialogInput={voiceDialogInput} setVoiceDialogInput={setVoiceDialogInput}
                videoInputImage={videoInputImage} setVideoInputImage={setVideoInputImage}
              />
            </div>
          )}

          { !['gantt', 'all_tools', 'professional_dashboard', 'skills_dashboard', 'math_equation'].includes(postType) &&
            <div className="border-t border-gray-200/50 dark:border-gray-600/50 pt-4 space-y-4">
              <div className="flex items-center justify-between gap-4">
                  <label htmlFor="num-variations" className="font-medium text-sm text-gray-700 dark:text-gray-300">Variations:</label>
                  <input
                      type="number"
                      id="num-variations"
                      value={numVariations}
                      onChange={(e) => setNumVariations(Math.max(1, Math.min(5, parseInt(e.target.value, 10) || 1)))}
                      className="w-20 p-2 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      min="1"
                      max="5"
                      aria-label="Number of variations"
                      disabled={postType === 'video_generation'}
                  />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="temperature" className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        Creativity
                    </label>
                    <span className="text-sm font-mono px-2 py-1 bg-black/5 dark:bg-white/5 rounded-md">
                        {temperature.toFixed(1)}
                    </span>
                </div>
                <input
                    type="range"
                    id="temperature"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    min="0"
                    max="1"
                    step="0.1"
                    aria-label="Creativity temperature"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Focused</span>
                    <span>Creative</span>
                </div>
              </div>

              <Button onClick={onGenerate} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader text={`Generating...`} />
                ) : (
                  `Generate ${postType === 'strategy' ? 'Strategy Plan' : postType === 'ad' ? 'Ad Creative' : postType === 'video_generation' ? 'Video' : postType === 'voice_dialog' ? 'Dialog' : 'Post'}`
                )}
              </Button>
            </div>
          }
          {error && !isLoading && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 px-3 py-2 rounded-md text-sm" role="alert">
              <p><span className="font-bold">Error:</span> {error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};