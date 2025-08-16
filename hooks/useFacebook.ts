import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { FacebookPage, GeneratedContent, PublishPostParams, FacebookContextType, MANUAL_ACCESS_TOKEN, MANUAL_PAGE_ID, FACEBOOK_APP_ID, MANUAL_PAGE_NAME, SIGNATURE_TEXT_FOR_COPY } from '../constants';
import { initFacebookSdk, getLoginStatus, login, logout, getUserPages, verifyManualToken, publishPost, getPageDetails } from '../services/facebookService';

const FacebookContext = createContext<FacebookContextType | undefined>(undefined);

export const useFacebook = () => {
    const context = useContext(FacebookContext);
    if (!context) {
        throw new Error('useFacebook must be used within a FacebookProvider');
    }
    return context;
};

export const FacebookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSdkLoaded, setIsSdkLoaded] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any | null>(null);
    const [pages, setPages] = useState<FacebookPage[]>([]);
    const [selectedPage, setSelectedPage] = useState<FacebookPage | null>(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [publishError, setPublishError] = useState<string | null>(null);
    const [isVerifyingToken, setIsVerifyingToken] = useState(false);
    const [verificationError, setVerificationError] = useState<string | null>(null);

    const handleLoginSuccess = useCallback(async (response: any) => {
        setIsLoggedIn(true);
        setUser(response.authResponse);
        setLoginError(null);
        try {
            const userPages = await getUserPages();
            setPages(userPages);
            if (userPages.length > 0) {
                setSelectedPage(userPages[0]);
            }
        } catch (error: any) {
            console.error("Failed to get user pages:", error);
            const errorMessage = error?.message || "Failed to fetch your Facebook Pages. Please check your permissions.";
            
            if (error?.type === 'OAuthException' || error?.code === 190 || (error?.message && error.message.includes('Session has expired'))) {
                setLoginError("Your Facebook session has expired. Please log in again.");
                setIsLoggedIn(false);
                setUser(null);
                setPages([]);
                setSelectedPage(null);
            } else {
                setLoginError(errorMessage);
            }
        }
    }, []);

    useEffect(() => {
        const initialize = async () => {
            if (MANUAL_ACCESS_TOKEN && MANUAL_PAGE_ID) {
                console.log("Using manual Facebook Access Token and Page ID from environment variables.");
                try {
                    const details = await getPageDetails(MANUAL_PAGE_ID, MANUAL_ACCESS_TOKEN);
                    const manualPage: FacebookPage = {
                        id: MANUAL_PAGE_ID,
                        name: details.name,
                        access_token: MANUAL_ACCESS_TOKEN,
                        picture: details.picture,
                    };
                    setPages([manualPage]);
                    setSelectedPage(manualPage);
                    setIsLoggedIn(true);
                } catch (error) {
                    console.error("Could not fetch details for manual page, falling back.", error);
                    const manualPage: FacebookPage = {
                        id: MANUAL_PAGE_ID,
                        name: MANUAL_PAGE_NAME || `Page (${MANUAL_PAGE_ID.substring(0, 8)}...)`,
                        access_token: MANUAL_ACCESS_TOKEN,
                    };
                    setPages([manualPage]);
                    setSelectedPage(manualPage);
                    setIsLoggedIn(true);
                } finally {
                    setIsSdkLoaded(true);
                }
                return;
            }

            try {
                await initFacebookSdk(FACEBOOK_APP_ID);
                setIsSdkLoaded(true);
                const statusResponse = await getLoginStatus();
                handleLoginSuccess(statusResponse);
            } catch (error) {
                setIsLoggedIn(false);
                setUser(null);
                if (error instanceof Error && error.message.includes('HTTPS')) {
                    setLoginError(error.message);
                }
            }
        };

        initialize();
    }, [handleLoginSuccess]);
    
    const handleLogin = useCallback(async () => {
        setLoginError(null);
        try {
            const response = await login();
            handleLoginSuccess(response);
        } catch (error) {
            console.error("Facebook login failed:", error);
            setIsLoggedIn(false);
            setUser(null);
            setLoginError(typeof error === 'string' ? error : "Login failed. Please try again.");
        }
    }, [handleLoginSuccess]);
    
    const handleLogout = useCallback(async () => {
        await logout();
        setIsLoggedIn(false);
        setUser(null);
        setPages([]);
        setSelectedPage(null);
    }, []);

    const connectWithManualToken = useCallback(async (token: string, pageId: string) => {
        if (!token || !pageId) {
            setVerificationError("Access Token and Page ID are required.");
            return;
        }
        setIsVerifyingToken(true);
        setVerificationError(null);
        try {
            const { name, picture } = await verifyManualToken(token, pageId);
            const manualPage: FacebookPage = {
                id: pageId,
                name: `${name} (Manual Token)`,
                access_token: token,
                picture: picture
            };
            setPages([manualPage]);
            setSelectedPage(manualPage);
            setIsLoggedIn(true);
            setLoginError(null);
        } catch (error) {
            setVerificationError(error instanceof Error ? error.message : "An unknown error occurred.");
        } finally {
            setIsVerifyingToken(false);
        }
    }, []);

    const handlePublishToFacebook = async (content: GeneratedContent, scheduleTime: Date | null) => {
        if (!selectedPage || !content) {
            setPublishError("No page selected or content is missing.");
            throw new Error("No page selected or content is missing.");
        }
        if (content.type === 'strategy') {
             setPublishError("Strategy plans can only be published as text. Please copy the content and post manually.");
            throw new Error("Strategy plans cannot be published directly to Facebook via this tool.");
        }
        setIsPublishing(true);
        setPublishError(null);
        
        let message = '';
        let imageBase64: string | undefined = undefined;
        const hashtagsText = 'hashtags' in content && content.hashtags ? content.hashtags.join(' ') : '';

        switch (content.type) {
            case 'text':
            case 'grounded_text':
            case 'analysis':
                message = `${content.content}\n\n${hashtagsText}`;
                break;
            case 'video':
                message = `${content.title}\n\n${content.message}\n\n${hashtagsText}`;
                break;
            case 'image':
                message = `${content.caption}\n\n${hashtagsText}`;
                if (content.imageUrl && content.imageUrl.startsWith('data:image/jpeg;base64,')) {
                    imageBase64 = content.imageUrl.split(',')[1];
                }
                break;
            case 'ad':
                message = `**${content.headline}**\n\n${content.primaryText}\n\nCall to Action: ${content.callToAction}\n\n${hashtagsText}`;
                break;
        }
        
        if (message.trim()) {
            message += `\n\n${SIGNATURE_TEXT_FOR_COPY}`;
        }
        
        try {
            const params: PublishPostParams = {
                page: selectedPage,
                message: message.trim(),
                scheduledPublishTime: scheduleTime || undefined,
                imageBase64: imageBase64
            };

            if (!params.message && !params.imageBase64) {
                 const errorMessage = "The post is empty. There is no text or image content to publish.";
                 setPublishError(errorMessage);
                 setIsPublishing(false);
                 throw new Error(errorMessage);
            }

            const result = await publishPost(params);
            setIsPublishing(false);
            return result;
        } catch (error: any) {
            console.error("Failed to publish to Facebook:", error);
            const errorMessage = error.message || "An unknown error occurred during publishing.";
            setPublishError(errorMessage);
            
            if (error?.type === 'OAuthException' || error?.code === 190 || (error?.message && error.message.includes('Session has expired'))) {
                setLoginError("Your access token is invalid or has expired. Please connect again.");
                setIsLoggedIn(false);
                setUser(null);
                setPages([]);
                setSelectedPage(null);
            }

            setIsPublishing(false);
            throw new Error(errorMessage);
        }
    };

    const value = {
        isSdkLoaded,
        isLoggedIn,
        isPublishing,
        loginError,
        publishError,
        user,
        pages,
        selectedPage,
        isVerifyingToken,
        verificationError,
        login: handleLogin,
        logout: handleLogout,
        connectWithManualToken,
        handlePublishToFacebook,
        setSelectedPage,
    };
    
    return React.createElement(FacebookContext.Provider, { value }, children);
};