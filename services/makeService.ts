

import { GeneratedContent, MakePostPayload, StrategyData } from '../constants';

export const constructMakePayload = (content: GeneratedContent, scheduleTime: Date | null): MakePostPayload => {
    let caption = '';
    let imageBase64: string | undefined = undefined;
    let hashtags: string[] | undefined = undefined;
    let strategyData: StrategyData | undefined = undefined;
    let videoUrl: string | undefined = undefined;
    let voiceDialog: GeneratedContent extends { type: 'voice_dialog' } ? GeneratedContent['dialog'] : undefined;

    switch (content.type) {
        case 'text':
        case 'grounded_text':
        case 'analysis':
            caption = content.content;
            hashtags = content.hashtags;
            break;
        case 'video':
            caption = `${content.title}\n\n${content.message}`;
            hashtags = content.hashtags;
            break;
        case 'image':
            caption = content.caption;
            hashtags = content.hashtags;
            if (content.imageUrl && content.imageUrl.startsWith('data:image/jpeg;base64,')) {
                imageBase64 = content.imageUrl.split(',')[1];
            }
            break;
        case 'strategy':
            caption = "AI-Generated Content Strategy Plan";
            strategyData = content.strategy;
            break;
        case 'video_generation':
            caption = `Video generated with prompt: "${content.prompt}"`;
            videoUrl = content.videoUrl || undefined;
            break;
        case 'voice_dialog':
            caption = `Voice Dialog for "${content.dialogType}": ${content.scenario}`;
            voiceDialog = content.dialog as any;
            break;
    }

    return {
        caption,
        hashtags,
        imageBase64,
        videoUrl,
        scheduleTime: scheduleTime ? scheduleTime.toISOString() : undefined,
        strategyData,
        voiceDialog,
    };
};

export async function sendToMakeWebhook(webhookUrl: string, payload: MakePostPayload): Promise<void> {
  const makeApiKey: string | undefined = undefined;

  if (!makeApiKey) {
    throw new Error("Make.com API Key is not configured in environment variables (MAKE_API_KEY).");
  }
  
  if (!webhookUrl.trim() || !webhookUrl.startsWith('https://hook.eu2.make.com/')) {
    throw new Error("Invalid Make.com webhook URL specified.");
  }
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-make-apikey': makeApiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const responseText = await response.text();
        if (response.status === 401) {
            throw new Error("Make.com Error (401): The API Key is invalid or missing. Please check your webhook security settings in Make.com and your MAKE_API_KEY environment variable.");
        }
        if (response.status === 410) {
            throw new Error("Make.com Error (410): The webhook is not active. Please ensure the scenario is turned on in your Make.com dashboard.");
        }
        throw new Error(`Failed to send data to Make.com. Status: ${response.status}. Response: ${responseText}`);
    }
    
    const responseText = await response.text();
    if (responseText.trim().toLowerCase() !== 'accepted') {
       console.warn(`Unexpected success response from Make.com: ${responseText}`);
    }
  } catch (error) {
    console.error("Error sending data to Make.com webhook:", error);
    if (error instanceof Error) {
        if (error.message.toLowerCase().includes('failed to fetch')) {
             throw new Error("Network Error: Could not connect to Make.com. Please check your internet connection.");
        }
        throw error;
    }
    throw new Error("An unexpected error occurred while sending data to Make.com.");
  }
}