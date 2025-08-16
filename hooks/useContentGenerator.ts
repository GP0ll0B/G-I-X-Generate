





import { useState, useCallback } from 'react';
import { 
    PostType, GeneratedContent, GuidedPostInput, AdCreativeInput, Source, VoiceDialogInput,
    TEXT_SYSTEM_INSTRUCTION, GUIDED_POST_SYSTEM_INSTRUCTION, GROUNDED_SYSTEM_INSTRUCTION,
    VIDEO_SYSTEM_INSTRUCTION, IMAGE_POST_SYSTEM_INSTRUCTION, ANALYSIS_POST_SYSTEM_INSTRUCTION,
    STRATEGY_SYSTEM_INSTRUCTION, STRATEGY_SCHEMA, AD_SYSTEM_INSTRUCTION, VOICE_DIALOG_SYSTEM_INSTRUCTION, VOICE_DIALOG_SCHEMA
} from '../constants';
import { generateContent, generateImage, generateVideos, getVideosOperation } from '../services/geminiService';

interface UseContentGeneratorProps {
    showToast: (message: string, type: 'success' | 'error') => void;
}

export interface GeneratePostsParams {
    postType: PostType;
    topic: string;
    url: string;
    guidedInput: GuidedPostInput;
    adCreativeInput: AdCreativeInput;
    voiceDialogInput: VoiceDialogInput;
    videoInputImage: { data: string; type: string; } | null;
    numVariations: number;
    temperature: number;
}

const generateAndParseSinglePost = async (
    params: Omit<GeneratePostsParams, 'numVariations' | 'videoInputImage'>
): Promise<GeneratedContent> => {
    const { postType, topic, url, guidedInput, adCreativeInput, voiceDialogInput, temperature } = params;
    
    let contents = '';
    const config: {
        systemInstruction: string;
        tools?: any[];
        responseMimeType?: string;
        responseSchema?: any;
        temperature?: number;
    } = { systemInstruction: '', temperature: temperature };

    switch (postType) {
        case 'text':
            contents = `Generate a post about: ${topic}`;
            config.systemInstruction = TEXT_SYSTEM_INSTRUCTION;
            break;
        case 'guided':
            contents = `
                Monetization Feature: "${guidedInput.monetizationFeature}"
                Target Audience: "${guidedInput.targetAudience}"
                Key Tip/CTA: "${guidedInput.keyTip}"
            `;
            config.systemInstruction = GUIDED_POST_SYSTEM_INSTRUCTION;
            break;
        case 'ad':
            contents = `
                Product/Service: "${adCreativeInput.productOrService}"
                Target Audience: "${adCreativeInput.targetAudience}"
                Call to Action: "${adCreativeInput.callToAction}"
            `;
            config.systemInstruction = AD_SYSTEM_INSTRUCTION;
            break;
        case 'grounded_text':
            contents = `Using the available search results, generate a fact-checked post about: ${topic}`;
            config.systemInstruction = GROUNDED_SYSTEM_INSTRUCTION;
            config.tools = [{ googleSearch: {} }];
            break;
        case 'video':
            contents = `Generate a video script about: ${topic}`;
            config.systemInstruction = VIDEO_SYSTEM_INSTRUCTION;
            break;
        case 'image':
            contents = `Generate an image post about: ${topic}`;
            config.systemInstruction = IMAGE_POST_SYSTEM_INSTRUCTION;
            break;
        case 'analysis':
            contents = `Based on the content from the provided URL, generate a post about: "${topic}". The URL to analyze is: ${url}`;
            config.systemInstruction = ANALYSIS_POST_SYSTEM_INSTRUCTION;
            config.tools = [{ googleSearch: {} }];
            break;
        case 'strategy':
            contents = "Generate a full content strategy plan.";
            config.systemInstruction = STRATEGY_SYSTEM_INSTRUCTION;
            config.responseMimeType = "application/json";
            config.responseSchema = STRATEGY_SCHEMA;
            break;
        case 'voice_dialog':
            contents = `Dialog Type: "${voiceDialogInput.dialogType}". Scenario: "${voiceDialogInput.scenario}"`;
            config.systemInstruction = VOICE_DIALOG_SYSTEM_INSTRUCTION;
            config.responseMimeType = "application/json";
            config.responseSchema = VOICE_DIALOG_SCHEMA;
            break;
        case 'gantt':
        case 'video_generation':
        case 'skills_dashboard':
        case 'professional_dashboard':
        case 'all_tools':
           throw new Error("This post type does not use the standard text generation flow.");
    }

    const response = await generateContent("gemini-2.5-flash", contents, config);
    const fullResponse = response.text;
    if (!fullResponse) throw new Error("The AI returned an empty response. Please try again.");

    switch (postType) {
        case 'text':
        case 'guided': {
            const [content, hashtags] = fullResponse.split('###HASHTAGS###');
            return { type: 'text', content: content.trim(), hashtags: (hashtags || '').trim().split(/\s+/).filter(h => h.startsWith('#')) };
        }
        case 'ad': {
            const [headline, rest] = fullResponse.split('###PRIMARYTEXT###');
            const [primaryText, hashtags] = (rest || '').split('###HASHTAGS###');
            return { type: 'ad', headline: headline.trim(), primaryText: primaryText.trim(), callToAction: adCreativeInput.callToAction, hashtags: (hashtags || '').trim().split(/\s+/).filter(h => h.startsWith('#')) };
        }
        case 'grounded_text': {
            const [content, hashtags] = fullResponse.split('###HASHTAGS###');
            const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as Source[] | undefined) || [];
            return { type: 'grounded_text', content: content.trim(), hashtags: (hashtags || '').trim().split(/\s+/).filter(h => h.startsWith('#')), sources };
        }
        case 'analysis': {
              const [content, hashtags] = fullResponse.split('###HASHTAGS###');
              return { type: 'analysis', content: content.trim(), hashtags: (hashtags || '').trim().split(/\s+/).filter(h => h.startsWith('#')), sourceUrl: url };
        }
        case 'video': {
            const [title, rest] = fullResponse.split('###MESSAGE###');
            const [message, hashtags] = (rest || '').split('###HASHTAGS###');
            return { type: 'video', title: title.trim(), message: message.trim(), hashtags: (hashtags || '').trim().split(/\s+/).filter(h => h.startsWith('#')) };
        }
        case 'image': {
            const [caption, rest] = fullResponse.split('###IMAGEPROMPT###');
            const [imagePrompt, hashtags] = (rest || '').split('###HASHTAGS###');
            if (!imagePrompt) throw new Error("The AI failed to generate a valid image prompt.");
            return { type: 'image', caption: caption.trim(), hashtags: (hashtags || '').trim().split(/\s+/).filter(h => h.startsWith('#')), imagePrompt: imagePrompt.trim(), imageUrl: 'prompt_ready' };
        }
        case 'strategy': {
            try {
                return { type: 'strategy', strategy: JSON.parse(fullResponse) };
            } catch(e) {
                console.error("Failed to parse strategy JSON:", e, "Raw response:", fullResponse);
                throw new Error("The AI returned an invalid JSON format for the strategy plan.");
            }
        }
        case 'voice_dialog': {
            try {
                const parsed = JSON.parse(fullResponse);
                return {
                    type: 'voice_dialog',
                    dialogType: voiceDialogInput.dialogType,
                    scenario: voiceDialogInput.scenario,
                    dialog: parsed.dialog,
                };
            } catch (e) {
                console.error("Failed to parse voice dialog JSON:", e, "Raw response:", fullResponse);
                throw new Error("The AI returned an invalid JSON format for the voice dialog.");
            }
        }
    }
};


export const useContentGenerator = ({ showToast }: UseContentGeneratorProps) => {
    const [contentVariations, setContentVariations] = useState<GeneratedContent[]>([]);
    const [currentVariationIndex, setCurrentVariationIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const pollVideoStatus = useCallback((operation: any, index: number) => {
        const intervalId = setInterval(async () => {
            try {
                const updatedOperation = await getVideosOperation(operation);
                
                setContentVariations(prev => {
                    const newVariations = [...prev];
                    const post = newVariations[index];
                    if (post?.type === 'video_generation') {
                         const progress = updatedOperation.metadata?.progressPercentage || post.progress || 0;
                         const message = progress < 100
                            ? `Processing video... (${progress.toFixed(0)}% complete). Please wait.`
                            : 'Finalizing video...';
                         newVariations[index] = { ...post, operation: updatedOperation, pollingMessage: message, progress };
                    }
                    return newVariations;
                });

                if (updatedOperation.done) {
                    clearInterval(intervalId);
                    if (updatedOperation.error) {
                        throw new Error(updatedOperation.error.message);
                    }
                    
                    const downloadLink = updatedOperation.response?.generatedVideos?.[0]?.video?.uri;
                    if (downloadLink) {
                         const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : "";
                         const finalUrl = `${downloadLink}&key=${apiKey}`;
                         setContentVariations(prev => {
                            const newVariations = [...prev];
                            const post = newVariations[index];
                            if (post?.type === 'video_generation') {
                                newVariations[index] = { ...post, status: 'success', videoUrl: finalUrl, pollingMessage: 'Video generation complete!', progress: 100 };
                            }
                            return newVariations;
                        });
                    } else {
                        throw new Error("Video generation finished but no video URL was returned.");
                    }
                }
            } catch (err) {
                clearInterval(intervalId);
                const errorMessage = err instanceof Error ? err.message : 'Failed to poll video status.';
                setError(errorMessage);
                showToast(errorMessage, 'error');
                setContentVariations(prev => {
                    const newVariations = [...prev];
                    const post = newVariations[index];
                    if (post?.type === 'video_generation') {
                        newVariations[index] = { ...post, status: 'error', pollingMessage: `Error: ${errorMessage}` };
                    }
                    return newVariations;
                });
            }
        }, 10000);
    }, [showToast, setError]);

    const handleGeneratePost = useCallback(async (params: GeneratePostsParams) => {
        const { postType, topic, url, guidedInput, adCreativeInput, voiceDialogInput, videoInputImage, numVariations } = params;
        setError(null);
        if (['text', 'grounded_text', 'video', 'image', 'video_generation'].includes(postType) && !topic.trim()) {
          setError('Please enter a topic for your post.'); return;
        }
        if (postType === 'analysis' && (!url.trim() || !topic.trim())) {
          setError('Please enter a URL and a prompt to analyze.'); return;
        }
        if (postType === 'guided' && !guidedInput.keyTip.trim()){
          setError('Please enter a key tip or call-to-action for the guided post.'); return;
        }
        if (postType === 'ad' && (!adCreativeInput.productOrService.trim() || !adCreativeInput.targetAudience.trim())) {
          setError('Please describe your product/service and target audience.'); return;
        }
        if (postType === 'voice_dialog' && !voiceDialogInput.scenario.trim()) {
            setError('Please describe a scenario for the voice dialog.'); return;
        }

        setIsLoading(true);
        setContentVariations([]);
        setCurrentVariationIndex(0);

        try {
            if (postType === 'video_generation') {
                const initialPost: GeneratedContent = {
                    type: 'video_generation',
                    prompt: topic,
                    inputImageUrl: videoInputImage?.data ?? null,
                    operation: null,
                    videoUrl: null,
                    status: 'generating',
                    pollingMessage: 'Initializing video generation...',
                    progress: 0,
                };
                setContentVariations([initialPost]);
                
                const operation = await generateVideos(topic, videoInputImage);

                setContentVariations(prev => {
                    const newVariations = [...prev];
                    const post = newVariations[0];
                    if (post?.type === 'video_generation') {
                        newVariations[0] = { ...post, operation: operation, status: 'polling', pollingMessage: 'Video processing started. This can take several minutes...' };
                    }
                    return newVariations;
                });
                setIsLoading(false);
                pollVideoStatus(operation, 0);

            } else {
                const generationPromises = Array(numVariations).fill(0).map(() => 
                    generateAndParseSinglePost(params)
                );
                let results = await Promise.all(generationPromises);
                
                if (postType === 'ad' && (adCreativeInput.requiredKeywords.trim() || adCreativeInput.bannedWords.trim())) {
                    const required = adCreativeInput.requiredKeywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
                    const banned = adCreativeInput.bannedWords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);

                    const filteredResults = results.filter(variation => {
                        if (variation.type !== 'ad') return true;

                        const adText = `${variation.headline} ${variation.primaryText}`.toLowerCase();

                        const hasAllRequired = required.every(keyword => adText.includes(keyword));
                        const hasNoBanned = banned.every(keyword => !adText.includes(keyword));

                        return hasAllRequired && hasNoBanned;
                    });

                    if (results.length > 0 && filteredResults.length === 0) {
                        throw new Error("No generated ads matched your guardrail criteria. Please adjust your Required Keywords or Banned Words.");
                    }
                    results = filteredResults;
                }

                setContentVariations(results);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            showToast(errorMessage, 'error');
            setContentVariations([]);
        } finally {
            if (postType !== 'video_generation') {
                setIsLoading(false);
            }
        }
    }, [showToast, pollVideoStatus]);

    const handleImagePromptChange = useCallback((newPrompt: string) => {
        setContentVariations(prev => {
            const newVariations = [...prev];
            const post = newVariations[currentVariationIndex];
            if (post?.type === 'image') newVariations[currentVariationIndex] = { ...post, imagePrompt: newPrompt };
            return newVariations;
        });
    }, [currentVariationIndex]);

    const handleFinalImageGeneration = useCallback(async () => {
        const currentPost = contentVariations[currentVariationIndex];
        if (currentPost?.type !== 'image' || !currentPost.imagePrompt) return;

        setIsGeneratingImage(true);
        setError(null);
        setContentVariations(prev => {
            const updated = [...prev];
            const post = updated[currentVariationIndex];
            if (post?.type === 'image') post.imageUrl = 'loading_image';
            return updated;
        });

        try {
            const imageBase64 = await generateImage(currentPost.imagePrompt);
            setContentVariations(prev => {
                const updated = [...prev];
                const post = updated[currentVariationIndex];
                if (post?.type === 'image') post.imageUrl = `data:image/jpeg;base64,${imageBase64}`;
                return updated;
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error generating the image.';
            setError(errorMessage);
            showToast(errorMessage, 'error');
            setContentVariations(prev => {
                const updated = [...prev];
                const post = updated[currentVariationIndex];
                if (post?.type === 'image') post.imageUrl = 'prompt_ready';
                return updated;
            });
        } finally {
            setIsGeneratingImage(false);
        }
    }, [contentVariations, currentVariationIndex, showToast]);

    return {
        contentVariations,
        currentVariationIndex,
        isLoading,
        isGeneratingImage,
        error,
        setError,
        handleGeneratePost,
        handleImagePromptChange,
        handleFinalImageGeneration,
        setCurrentVariationIndex,
        setContentVariations,
    };
};