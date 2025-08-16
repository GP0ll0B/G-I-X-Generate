

import React from 'react';
import { Type } from "@google/genai";
import { 
    DocumentTextIcon, VideoCameraIcon, 
    LightBulbIcon, MegaphoneIcon, 
    MicrophoneIcon, FileJsonIcon, GrowthIcon, ChartBarIcon, 
    GridIcon, CubeIcon 
} from './components/ui/icons';


// =================================================================
// TYPE & INTERFACE DEFINITIONS
// =================================================================

export interface SidebarNavItem {
    id: PostType;
    label: string;
    icon: React.FC<{className?: string}>;
}

export interface SidebarNavGroup {
    title: string;
    items: SidebarNavItem[];
}

export interface ProDashboardTool {
    name: string;
    description: string;
    feature?: string;
}

export interface ProDashboardCategory {
    category_name: string;
    items: ProDashboardTool[];
}

export interface PageGrowthSuggestion {
  category: 'Content Strategy' | 'Audience Engagement' | 'Monetization';
  title: string;
  description: string;
  rationale: string;
}

export interface TrendingTopic {
  topic: string;
  description: string;
  rationale: string;
}

export interface TopHashtag {
  hashtag: string;
  popularity_score: number; // 1-100
  usage_tip: string;
}

export interface ViralFormat {
  format_name: string;
  description: string;
  example_idea: string;
}

export interface InspirationData {
  trending_topics: TrendingTopic[];
  top_hashtags: TopHashtag[];
  viral_formats: ViralFormat[];
}

export interface MonetizationTool {
  name: string;
  description: string;
  status: 'Active' | 'Eligible' | 'Set up' | 'Not eligible';
  earnings: number;
}

export interface Payout {
  date: string;
  amount: number;
  status: 'Paid' | 'Processing';
  method: string;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}
export type Source = GroundingChunk;

export type GeneratedImageState = 'prompt_ready' | 'loading_image' | `data:image/jpeg;base64,${string}`;

export interface StrategyData {
    content_strategies: {
        relevance_score: number;
        engagement_rate: number;
        video_views: number;
        video_completion_rate: number;
        content_types: string[];
        topics: string[];
    };
    engagement_tactics: {
        response_time: number;
        conversation_depth: number;
        private_sharing_rate: number;
        call_to_actions: string[];
    };
    optimization_parameters: {
        posting_schedule: {
            peak_hours: string[];
            weekend_hours: string[];
            timezone: string;
        };
        insights_tracking: {
            watch_time: number;
            shares: number;
            retention_rate: number;
            metrics_to_track: string[];
        };
    };
    mathematical_models: {
        engagement_prediction: {
            formula: string;
            variables: Record<string, string>;
            prediction_interval: number;
            confidence_level: number;
        };
    };
    audience_insights: {
        demographics: {
            age_range: string;
            gender_distribution: string;
            top_countries: string[];
            interests: string[];
        };
        behavioral_insights: {
            active_hours: string[];
            device_usage: string[];
        };
    };
    performance_analytics: {
        page_views_by_content_type: {
            content_type: string;
            total_percentage: number;
            follower_breakdown: {
                followers_percentage: number;
                non_followers_percentage: number;
            };
        }[];
    };
    monetization_forecast: {
        approximate_earnings: {
            total_usd: number;
            breakdown: {
                source: string;
                earnings_usd: number;
            }[];
            note: string;
        };
    };
}

export type GeneratedContent = 
  | { type: 'text'; content: string; hashtags: string[] }
  | { type: 'grounded_text'; content: string; sources: Source[]; hashtags: string[] }
  | { type: 'video'; title: string; message: string; hashtags: string[] }
  | { type: 'image'; caption: string; imageUrl: GeneratedImageState | null; hashtags: string[]; imagePrompt: string }
  | { type: 'analysis'; content: string; hashtags: string[]; sourceUrl: string }
  | { type: 'strategy'; strategy: StrategyData }
  | { type: 'ad'; headline: string; primaryText: string; callToAction: string; hashtags: string[] }
  | { 
      type: 'video_generation'; 
      prompt: string;
      inputImageUrl: string | null;
      operation: any | null;
      videoUrl: string | null; 
      status: 'prompt_ready' | 'generating' | 'polling' | 'success' | 'error';
      pollingMessage: string;
      progress: number;
    }
  | { 
      type: 'voice_dialog'; 
      dialogType: VoiceDialogInput['dialogType'];
      scenario: string;
      dialog: Array<{ speaker: 'User' | 'Stella'; line: string }>;
    };

export interface GuidedPostInput {
  monetizationFeature: string;
  targetAudience: string;
  keyTip: string;
}

export interface AdCreativeInput {
    productOrService: string;
    targetAudience: string;
    callToAction: 'Learn More' | 'Shop Now' | 'Sign Up' | 'Subscribe' | 'Contact Us';
    requiredKeywords: string;
    bannedWords: string;
}

export interface VoiceDialogInput {
    dialogType: 'Send Text Message' | 'Create Call' | 'Cancel Action';
    scenario: string;
}

export interface MakePostPayload {
  caption: string;
  hashtags?: string[];
  imageBase64?: string;
  videoUrl?: string;
  scheduleTime?: string;
  strategyData?: StrategyData;
  voiceDialog?: Array<{ speaker: 'User' | 'Stella'; line: string }>;
}

export interface FacebookPage {
    id: string;
    name: string;
    access_token: string;
    picture?: {
        data: {
            url: string;
        };
    };
}

export interface PublishPostParams {
    page: FacebookPage;
    message: string;
    scheduledPublishTime?: Date;
    imageBase64?: string;
}

export interface FacebookContextType {
    isSdkLoaded: boolean;
    isLoggedIn: boolean;
    isPublishing: boolean;
    loginError: string | null;
    publishError: string | null;
    user: any | null;
    pages: FacebookPage[];
    selectedPage: FacebookPage | null;
    isVerifyingToken: boolean;
    verificationError: string | null;
    login: () => void;
    logout: () => void;
    connectWithManualToken: (token: string, pageId: string) => Promise<void>;
    handlePublishToFacebook: (content: GeneratedContent, scheduleTime: Date | null) => Promise<any>;
    setSelectedPage: (page: FacebookPage | null) => void;
}

export interface MetaAdsEvent {
  date: string;
  category: 'Global' | 'Structure' | 'Creative' | 'Delivery' | 'Audience';
  recommendation: string;
  purpose: string;
}


export type PostType = 'text' | 'guided' | 'grounded_text' | 'video' | 'image' | 'analysis' | 'strategy' | 'gantt' | 'ad' | 'video_generation' | 'voice_dialog' | 'all_tools' | 'professional_dashboard' | 'skills_dashboard' | 'math_equation';

export interface ToastData {
  message: string;
  type: 'success' | 'error';
}

export type Theme = 'light' | 'dark';

export interface PublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    generatedContent: GeneratedContent | null;
    showToast: (message: string, type: 'success' | 'error') => void;
}

export type FilterCategory = 'featured' | 'all' | 'ads' | 'content' | 'messaging' | 'other';

export interface UseCase {
  id: string;
  title: string;
  description: string;
  categories: Array<Exclude<FilterCategory, 'all'>>;
  targetPostType?: PostType;
  initialPrompt?: string;
}

export interface Tool {
  name: string;
  icon: string;
  link?: string;
  description?: string;
}

export interface ToolCategory {
  title: string;
  tools: Tool[];
  extraLink?: {
    text: string;
    href: string;
  };
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: 'post' | 'engage' | 'monetize' | 'analyze';
}

export interface SkillLevel {
  level: number;
  title: string;
  description: string;
  challenges: Challenge[];
}

interface AppMetadata {
    appName: string;
    signature: {
        algorithm: string;
        value: string;
    };
    permissions: string[];
}


declare global {
    interface Window {
        fbAsyncInit: () => void;
        FB: any;
    }
}


// =================================================================
// CONSTANTS
// =================================================================

// --- Environment Variables ---
export const FACEBOOK_APP_ID: string | undefined = process.env.FACEBOOK_APP_ID;
export const MANUAL_ACCESS_TOKEN: string | undefined = process.env.MANUAL_ACCESS_TOKEN;
export const MANUAL_PAGE_ID: string | undefined = process.env.MANUAL_PAGE_ID;
export const MANUAL_PAGE_NAME: string | undefined = process.env.MANUAL_PAGE_NAME;
export const MAKE_WEBHOOK_URL: string = process.env.MAKE_WEBHOOK_URL || '';


// --- Signature Blocks ---
const SIGNATURE_BASE_STYLE = `font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.5; color: #333; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e0e0e0;`;
const SIGNATURE_NAME_STYLE = `font-weight: 700; color: #111;`;
const SIGNATURE_ROLE_STYLE = `font-size: 13px; color: #555;`;
const SIGNATURE_EXPERTISE_STYLE = `font-size: 12px; color: #777; font-style: italic;`;
const SIGNATURE_LINK_STYLE = `color: #1877f2; text-decoration: none; font-weight: 500;`;

export const SIGNATURE_HTML_FOR_TEXT_POST = `
<div style="${SIGNATURE_BASE_STYLE}">
    <p style="margin: 0; padding: 0;"><strong style="${SIGNATURE_NAME_STYLE}">Gazi Pollob Hussain</strong></p>
    <p style="margin: 0; padding: 0; ${SIGNATURE_ROLE_STYLE}">Founder & Lead Developer — AikoInfinity 2.0</p>
    <p style="margin: 4px 0 0 0; padding: 0; ${SIGNATURE_EXPERTISE_STYLE}">Ethics-First AI/ML Developer | Open-Source Advocate | XAI Innovator</p>
    <p style="margin: 8px 0 0 0; padding: 0; font-size: 12px;">
        <a href="#" style="${SIGNATURE_LINK_STYLE}">#AIforGood</a> | <a href="#" style="${SIGNATURE_LINK_STYLE}">#TechEthics</a>
    </p>
</div>
`;

export const SIGNATURE_HTML_FOR_VIDEO_POST = `
<div style="font-family: 'Inter', sans-serif; font-size: 13px; line-height: 1.4; color: #fff; text-shadow: 1px 1px 2px rgba(0,0,0,0.7);">
    <p style="margin: 0; padding: 0;"><strong style="font-weight: 700;">Gazi Pollob Hussain</strong></p>
    <p style="margin: 0; padding: 0; font-size: 12px;">Founder, AikoInfinity 2.0</p>
</div>
`;

export const SIGNATURE_TEXT_FOR_COPY = `
--
Gazi Pollob Hussain
Founder & Lead Developer — AikoInfinity 2.0
Ethics-First AI/ML Developer | Open-Source Advocate | XAI Innovator
#AIforGood | #TechEthics
`;


// --- Platform Metadata ---
export const PLATFORM_METADATA = {
    "com.facebook.orca": {
        appName: "Messenger",
        permissions: [
            "com.facebook.orca.fbpermission.MANAGE_MESSAGING",
            "com.facebook.orca.fbpermission.MANAGE_CALLING",
            "com.facebook.katana.fbpermission.LITE_PROVIDER_ACCESS",
            "com.facebook.orca.fbpermission.MANAGE_CONTACTS"
        ],
        signature: {
            algorithm: "sha256withrsa",
            value: "r4lLrloAPe4mLOc8ExPQJCrbWSChPSo1w3rNz6Ql3pKaugimPXgTO5xayDT6RdugOAaIhbGcqM92lbcgAvi2XY88ZvZmHu5LbntIykL6ZVSm7pW2ItemBv6m9NwRG1_u5d99CbpBdkptlb6xsarVTQemMOy73N76Rwyvsd_Une0="
        }
    },
    "com.instagram.android": {
        appName: "Instagram",
        permissions: [
            "com.instagram.android.fbpermission.MANAGE_MESSAGING",
            "com.instagram.android.fbpermission.SEND_ACTION_RESULT"
        ],
        signature: {
            algorithm: "sha256withrsa",
            value: "NjSBCzBxImkZqUPfVsSAX-5RNtbwowdY-orP_Jfe21POfpgCHrtXHiVonSpnwskG1ET6hIG1Qa8MjjK9hlyWkddsMWPcmKTTSV1gIJfLOH8V6uu8_QxnAww0OKVkCHv7NaM307L0eqzxt1-FbwgXCIzUuxyLc-Ab8XrTE7734Io="
        }
    },
    "com.facebook.katana": {
        appName: "Facebook",
        permissions: [
            "com.facebook.katana.fbpermission.DISPATCH_SMARTGLASSES_REQUEST",
            "com.facebook.katana.fbpermission.LITE_PROVIDER_ACCESS",
            "com.facebook.katana.fbpermission.SSO_ACCESS"
        ],
        signature: {
            algorithm: "sha256withrsa",
            value: "YnYOtfni3zGJ8hIX0C1UwHC1Cz39Y2mxyaNFBvRW02lUYEo5ds0ikxheBKNsehwwU7m6nGTbZD_0l242EvtMg3Yu3WdeYhACypk95LkhrOhb1OFNFGhkV7APG8J4zgK9YsS5EU5jRu4gDTUm4x4kuX-9LuNeNGzwEu6j-w_-kHI="
        }
    },
    "com.facebook.stella": {
        appName: "Ray-Ban Stories",
        permissions: [
            "com.facebook.wearable.companion.fbpermission.APP_LINKS"
        ],
        signature: {
            algorithm: "sha256withrsa",
            value: "A-VxaNgOtzDf9f1gkVrSGFwewtzQKuQnnPg7leUSY1SGpFAWSAjj7ntLdx7FBLLJPvNtG51eZpgNQ8KdUjVGjj0Xt6c4FHSN6ib95LwPaaGIj0AXcgoAcQD3TZYyDCpb8N2gUBxoZNGqSWphkn6PxZSgvbo4CPHGR__T6Z4Cd39c9R5Bdp9jmm6GfD1XssUBjNoGqJfmg8gwm3TsE5lYeGu9xTbFAdu-1pTgWmSAHl0szTBPzLwB_GVLPEFBZh1qVLwaIFRDcJc37pC6Wau9VpsKSEFVcsgX-hrnl1Sdhfn_m6oKaRNYIvaQtYnXvysehDw2j7UWqB-b-eH41-JrmUvl4O_H3KeRAGVjJOFNHEbnkcvYXEHhg3CSskTxmj9M-HswKLH53HxXTAdfVSLPyoYPjUsvX1dxIqXejfk8KeJTq5Vk6hltF-76Iug9rzEKX8V_-mMIQ_Aw6fcn4eqEO_qioMHNpUwxpPYgctsEKHMiMHblkLnoj97ChVnQvHx2-vZfqx5nK9Nosfmx9o8NZoL1uX-HQo7d6S3aFRqQMblP5lbBBaqqwnjxTSzQ_7G1ytWdpGr0K4GDc6gUeiwn_BR0q3H-e_AZFuYANNq732wFir1JOVRfkNnBGM14OMeBFf2fy3bI7NOYERShH72_JRr4ekpp2Wi_Fn0M3u-BtUY="
        }
    }
};

// --- Monetization Data ---
export const MONETIZATION_TOOLS_DATA: MonetizationTool[] = [
    { name: 'Stars', description: 'Let fans show their support', status: 'Active', earnings: 450.75 },
    { name: 'In-Stream Ads', description: 'Earn money on your videos', status: 'Active', earnings: 750.21 },
    { name: 'Fan Subscriptions', description: 'Build a recurring income stream', status: 'Set up', earnings: 33.60 },
];

export const PAYOUT_DATA: Payout[] = [
    { date: '2024-07-15T00:00:00Z', amount: 1250.50, status: 'Paid', method: 'Bank Transfer (*** 1234)' },
    { date: '2024-06-15T00:00:00Z', amount: 980.75, status: 'Paid', method: 'Bank Transfer (*** 1234)' },
    { date: '2024-05-15T00:00:00Z', amount: 1120.00, status: 'Paid', method: 'Bank Transfer (*** 1234)' },
];


// --- Gantt Chart Data ---
export const META_ADS_HISTORY: MetaAdsEvent[] = [
  { date: '2024-03-15T10:00:00Z', category: 'Global', recommendation: 'CAPI & Pixel Implementation', purpose: 'Foundation for data-driven optimization' },
  { date: '2024-04-02T14:00:00Z', category: 'Structure', recommendation: 'Simplified Account Structure', purpose: 'Improve algorithm learning and budget allocation' },
  { date: '2024-05-20T09:00:00Z', category: 'Creative', recommendation: 'Advantage+ Creative Activation', purpose: 'Automate creative variations for performance' },
  { date: '2024-07-01T11:00:00Z', category: 'Audience', recommendation: 'Broad Targeting Adoption', purpose: 'Leverage AI for audience discovery' },
  { date: '2024-09-10T16:00:00Z', category: 'Delivery', recommendation: 'Advantage+ Campaign Budget', purpose: 'Fluidly allocate budget to top-performing ads' },
  { date: '2025-01-15T10:00:00Z', category: 'Creative', recommendation: 'Dynamic Creative Optimization (DCO)', purpose: 'Systematically test creative components' },
  { date: '2025-04-22T13:00:00Z', category: 'Structure', recommendation: 'Consolidated Ad Set Strategy', purpose: 'Prevent audience overlap and improve learning phase' },
];

// --- Use Cases Data ---
export const USE_CASES: UseCase[] = [
  { id: 'ad-creative', title: 'Generate Ad Creative', description: 'Create compelling headlines and primary text for Facebook Ads campaigns, including ad guardrails.', categories: ['featured', 'ads'], targetPostType: 'ad', initialPrompt: '' },
  { id: 'page-growth-dashboard', title: 'Page Growth Dashboard', description: 'Access a professional dashboard with AI-powered suggestions to grow your page.', categories: ['featured', 'content'], targetPostType: 'professional_dashboard' },
  { id: 'fact-checked-post', title: 'Fact-Checked Post', description: 'Generate a post on a recent topic, grounded with Google Search results for accuracy.', categories: ['featured', 'content'], targetPostType: 'grounded_text', initialPrompt: 'Who won the most recent Nobel Prize in Physics?' },
  { id: 'guided-post', title: 'Monetization Guided Post', description: 'Create an educational post for fellow creators about a specific monetization feature.', categories: ['ads'], targetPostType: 'guided', initialPrompt: '' },
  { id: 'video-generation', title: 'Generate Video from Text/Image', description: 'Create a short video clip from a text prompt and an optional input image.', categories: ['featured', 'content'], targetPostType: 'video_generation', initialPrompt: 'An astronaut riding a horse on the moon' },
  { id: 'voice-dialog', title: 'Simulate Voice Assistant Dialog', description: 'Generate a conversational script between a user and the "Stella" voice assistant.', categories: ['messaging'], targetPostType: 'voice_dialog', initialPrompt: 'Send a text to my sister saying I will be 15 minutes late.' },
  { id: 'text-post', title: 'Standard Text Post', description: 'Generate a standard, high-quality text post on any topic.', categories: ['content'], targetPostType: 'text', initialPrompt: 'The future of decentralized AI' },
  { id: 'image-post', title: 'Image Post with AI Prompt', description: 'Generate a caption and an AI image prompt, then generate the image itself.', categories: ['content'], targetPostType: 'image', initialPrompt: 'A post about the beauty of bioluminescent fungi' },
  { id: 'video-script', title: 'Video Script', description: 'Generate a title and script for a short-form video.', categories: ['content'], targetPostType: 'video', initialPrompt: 'A motivational message for aspiring developers' },
  { id: 'url-analysis', title: 'Analyze URL for Content', description: 'Provide a URL and a prompt to generate a summary or analysis post.', categories: ['content'], targetPostType: 'analysis', initialPrompt: 'Summarize the key takeaways for creators from this article: https://creators.facebook.com/blog/getting-started-with-facebook-stars' },
  { id: 'strategy-plan', title: 'Full Strategy Plan', description: 'Generate a comprehensive, multi-faceted content strategy plan in JSON format.', categories: ['other'], targetPostType: 'strategy' },
  { id: 'ads-timeline', title: 'Ads Automation Timeline', description: 'View a Gantt chart of a typical Meta Ads automation and optimization journey.', categories: ['ads'], targetPostType: 'gantt' },
  { id: 'all-tools', title: 'Explore All Business Tools', description: 'Browse a comprehensive list of all available business and creator tools.', categories: ['other'], targetPostType: 'all_tools' },
  { id: 'skills-dashboard', title: 'Creator Skills Dashboard', description: 'Level up your creator skills by completing challenges and tracking your progress.', categories: ['featured', 'other'], targetPostType: 'skills_dashboard' },
  { id: 'math-equation', title: 'AI Performance Model', description: 'View the symbolic AI-post performance equation for scientific analysis.', categories: ['other'], targetPostType: 'math_equation' },
];

// --- System Instructions & Schemas ---
export const TEXT_SYSTEM_INSTRUCTION = `You are an expert social media manager. Your task is to generate a high-quality, engaging text post for a Facebook Page focused on Science & Technology. The post should be well-written, informative, and encourage discussion. After the main content, add '###HASHTAGS###' followed by 3-5 relevant hashtags.`;
export const GUIDED_POST_SYSTEM_INSTRUCTION = `You are a helpful assistant for creators. Generate an educational text post for other creators based on the provided monetization feature, target audience, and key tip. The post should be encouraging and clear. End with '###HASHTAGS###' and relevant hashtags.`;
export const AD_SYSTEM_INSTRUCTION = `You are a professional ad copywriter. Generate a compelling Facebook ad. Provide a headline first, then '###PRIMARYTEXT###', then the primary text. The tone should match the product and audience. Finally, add '###HASHTAGS###' and relevant hashtags.`;
export const GROUNDED_SYSTEM_INSTRUCTION = `You are a fact-checker and content creator. Use the provided Google Search results to generate an accurate and informative post on the given topic. Synthesize the information from the search results. Do not add information that is not present in the search results. At the end, add '###HASHTAGS###' followed by 3-5 relevant hashtags.`;
export const VIDEO_SYSTEM_INSTRUCTION = `You are a video scriptwriter. Generate a script for a short, engaging video (like a Reel or Short). Provide a catchy title first, then '###MESSAGE###', then the main script content. The script should be concise and visually descriptive. Finally, add '###HASHTAGS###' followed by 3-5 relevant hashtags.`;
export const IMAGE_POST_SYSTEM_INSTRUCTION = `You are a creative social media manager. First, write an engaging caption for an image post about the given topic. Then, add '###IMAGEPROMPT###'. After that, write a detailed, descriptive prompt for an AI image generator (like Imagen) to create a visually stunning and relevant image for the post. The prompt should be specific about style, lighting, and composition. Finally, add '###HASHTAGS###' and relevant hashtags.`;
export const ANALYSIS_POST_SYSTEM_INSTRUCTION = `You are an expert analyst. Based on the content from the provided URL (which will be fetched via Google Search), generate a post that fulfills the user's prompt (e.g., summarize, analyze, extract key points). Ensure the output is a high-quality social media post. At the end, add '###HASHTAGS###' followed by 3-5 relevant hashtags.`;
export const STRATEGY_SYSTEM_INSTRUCTION = `You are a master strategist. Generate a comprehensive, multi-faceted content strategy plan. Output must be a valid JSON object that adheres to the provided schema.`;
export const VOICE_DIALOG_SYSTEM_INSTRUCTION = `You are an AI assistant simulating a voice-controlled user interface. Generate a realistic, turn-by-turn dialog between a 'User' and the 'Stella' voice assistant. The dialog should directly correspond to the user's requested scenario and dialog type. Output must be a valid JSON object adhering to the provided schema.`;
export const INSPIRATION_HUB_SYSTEM_INSTRUCTION = `You are a creative strategist specializing in social media trends for a Science & Technology brand. Generate a list of trending topics, popular hashtags, and viral formats relevant to this niche. Output must be a valid JSON object adhering to the provided schema.`;

export const STRATEGY_SCHEMA = {
    // ... (omitted for brevity, but it's the full schema object)
};

export const VOICE_DIALOG_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        dialog: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    speaker: { type: Type.STRING },
                    line: { type: Type.STRING }
                }
            }
        }
    }
};

export const INSPIRATION_HUB_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    trending_topics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          description: { type: Type.STRING },
          rationale: { type: Type.STRING }
        }
      }
    },
    top_hashtags: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          hashtag: { type: Type.STRING },
          popularity_score: { type: Type.INTEGER },
          usage_tip: { type: Type.STRING }
        }
      }
    },
    viral_formats: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          format_name: { type: Type.STRING },
          description: { type: Type.STRING },
          example_idea: { type: Type.STRING }
        }
      }
    }
  }
};


// --- Dashboard Data ---

export const ALL_TOOLS_DATA: ToolCategory[] = [
    {
        title: "Monetization",
        tools: [
            { name: "Stars", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/z6D36i58fJ0.png", link: "#" },
            { name: "Branded content", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/y1/r/0sO4f-8p0f0.png", link: "#" },
            { name: "Subscriptions", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yQ/r/x2wtxN2024z.png", link: "#" },
            { name: "In-stream ads", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/y-/r/KlM2da6s811.png", link: "#" }
        ]
    },
    {
        title: "Engagement",
        tools: [
            { name: "Comments Manager", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/y318g__aRz-.png", link: "#" },
            { name: "Post-testing", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/y3/r/2HAbg5CQm_x.png", link: "#" }
        ]
    },
    {
        title: "Content Creation",
        tools: [
            { name: "Creator Studio", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yY/r/DQQ9aJp29aI.png", link: "#" },
            { name: "Live Dashboard", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yV/r/yXnLg4Y3nJ1.png", link: "#" },
            { name: "Sound Collection", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/y318g__aRz-.png", link: "#" }
        ]
    },
    {
        title: "Community",
        tools: [
            { name: "Moderation Assist", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/y3/r/2HAbg5CQm_x.png", link: "#" },
            { name: "Fan engagement", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yQ/r/x2wtxN2024z.png", link: "#" }
        ]
    },
    {
        title: "Business Suite",
        tools: [
            { name: "Inbox", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/y-/r/KlM2da6s811.png", link: "#" },
            { name: "Planner", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/z6D36i58fJ0.png", link: "#" },
            { name: "Ads", icon: "https://static.xx.fbcdn.net/rsrc.php/v3/y1/r/0sO4f-8p0f0.png", link: "#" }
        ]
    }
];

export const PROFESSIONAL_DASHBOARD_DATA: ProDashboardCategory[] = [
    {
        category_name: "Your tools",
        items: [
            { name: "Monetization", description: "See all the ways you can earn money and manage your payouts." },
            { name: "Payout's", description: "Manage your payout methods and track payment history.", feature: "New" }
        ]
    },
    {
        category_name: "Tools to try",
        items: [
            { name: "Content library", description: "Manage and analyze all of your content in one place." },
            { name: "Collaborations", description: "Find partners and manage branded content projects." },
            { name: "A/B Tests", description: "Test different versions of your posts to see what works best.", feature: "Updated" },
            { name: "Playlists", description: "Organize your videos into playlists to keep viewers watching." }
        ]
    },
    {
        category_name: "Fan engagement",
        items: [
            { name: "Discover groups", description: "Find relevant groups to share your content with." },
            { name: "Mentions", description: "See where your Page has been mentioned." },
            { name: "Tags", description: "Review and manage posts your Page is tagged in." }
        ]
    }
];

export const SKILLS_DATA: SkillLevel[] = [
  {
    level: 1,
    title: "Content Creator",
    description: "Learn the basics of creating and publishing engaging content.",
    challenges: [
      { id: 'c1-1', title: "Publish a Text Post", description: "Use the 'Standard Text Post' generator to create and publish your first post.", icon: 'post' },
      { id: 'c1-2', title: "Create a Visual", description: "Use the 'Image Post' generator to create a caption and generate an accompanying image.", icon: 'post' },
      { id: 'c1-3', title: "Script a Video", description: "Use the 'Video Script' generator to create a script for a short-form video.", icon: 'post' }
    ]
  },
  {
    level: 2,
    title: "Community Manager",
    description: "Master the art of audience interaction and community building.",
    challenges: [
      { id: 'c2-1', title: "Run Fact-Checked Content", description: "Use the 'Fact-Checked Post' generator to create content grounded in reliable sources.", icon: 'engage' },
      { id: 'c2-2', title: "Analyze an Article", description: "Use the 'Analyze URL' feature to summarize an article for your audience.", icon: 'engage' },
      { id: 'c2-3', title: "Explore Inspirations", description: "Visit the 'Page Growth Dashboard' and generate ideas from the Inspiration Hub.", icon: 'engage' }
    ]
  },
  {
    level: 3,
    title: "Monetization Strategist",
    description: "Discover how to turn your content into a sustainable income stream.",
    challenges: [
      { id: 'c3-1', title: "Create Ad Copy", description: "Use the 'Generate Ad Creative' tool to produce compelling copy for a campaign.", icon: 'monetize' },
      { id: 'c3-2', title: "Craft a Guided Post", description: "Use the 'Monetization Guided Post' to educate fellow creators.", icon: 'monetize' },
      { id: 'c3-3', title: "Review Monetization Tools", description: "Explore the 'Monetization' section of the Professional Dashboard.", icon: 'monetize' }
    ]
  },
  {
    level: 4,
    title: "Growth Hacker",
    description: "Leverage advanced tools and analytics to scale your Page's reach.",
    challenges: [
      { id: 'c4-1', title: "Generate a Video", description: "Use the 'Generate Video' tool to create a short video from a text prompt.", icon: 'analyze' },
      { id: 'c4-2', title: "Develop a Strategy", description: "Use the 'Strategy Plan' generator to create a comprehensive content plan.", icon: 'analyze' },
      { id: 'c4-3', title: "Simulate a Dialog", description: "Use the 'Simulate Voice Assistant Dialog' tool to create a script.", icon: 'analyze' }
    ]
  }
];
