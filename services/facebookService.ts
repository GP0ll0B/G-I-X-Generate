import { FacebookPage, PublishPostParams } from "../constants";

const isHttps = (): boolean => {
    return window.location.protocol === 'https:';
};

export const getPageDetails = async (pageId: string, accessToken: string): Promise<{ name: string, picture?: { data: { url: string } } }> => {
    try {
        const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=name,picture&access_token=${accessToken}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        return data;
    } catch (error: any) {
        console.error('Facebook getPageDetails error:', error);
        throw new Error(error.message || 'Failed to fetch page details.');
    }
};

export const initFacebookSdk = (appId: string | undefined): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!isHttps()) {
            const message = "Facebook features require a secure (HTTPS) connection. To enable Facebook login, please serve the application over HTTPS.";
            console.warn(message);
            return reject(new Error(message));
        }

        if (window.FB && window.FB.AppEvents) {
            resolve();
            return;
        }

        window.fbAsyncInit = function() {
            if (appId) {
                window.FB.init({
                    appId: appId,
                    cookie: true,
                    xfbml: true,
                    version: 'v19.0'
                });
            } else {
                 console.warn("Facebook App ID is not configured. The Facebook login feature will be unavailable.");
            }
            resolve();
        };

        if (!document.getElementById('facebook-jssdk')) {
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                if(fjs && fjs.parentNode) fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
    });
};

export const getLoginStatus = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (!window.FB || typeof window.FB.getLoginStatus !== 'function') {
            return reject('Facebook SDK not initialized or App ID missing.');
        }
        window.FB.getLoginStatus(function(response: any) {
            if (response.status === 'connected') {
                resolve(response);
            } else {
                reject(response);
            }
        });
    });
};

export const login = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (!window.FB || typeof window.FB.login !== 'function') {
            return reject('Facebook SDK not initialized or App ID missing.');
        }
        window.FB.login(function(response: any) {
            if (response.authResponse) {
                resolve(response);
            } else {
                reject('User cancelled login or did not fully authorize.');
            }
        }, { scope: 'email,pages_show_list,pages_manage_posts,pages_read_engagement,business_management' });
    });
};

export const logout = (): Promise<any> => {
    return new Promise(resolve => {
        if (!window.FB || typeof window.FB.logout !== 'function') {
            return resolve(null);
        }
        window.FB.logout(function(response: any) {
            resolve(response);
        });
    });
};

export const getUserPages = async (): Promise<FacebookPage[]> => {
    return new Promise((resolve, reject) => {
        if (!window.FB || typeof window.FB.api !== 'function') {
            return reject('Facebook SDK not initialized.');
        }
        window.FB.api('/me/accounts?fields=name,access_token,picture', function(response: any) {
            if (response && !response.error) {
                resolve(response.data);
            } else {
                reject(response.error || 'Failed to fetch user pages.');
            }
        });
    });
};

const base64ToBlob = (base64: string, contentType: string = 'image/jpeg'): Blob => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
};

const publishTextPost = async ({ page, message, scheduledPublishTime }: Omit<PublishPostParams, 'imageBase64'>) => {
    const params = new URLSearchParams({
        message,
        access_token: page.access_token,
        published: String(!scheduledPublishTime)
    });

    if (scheduledPublishTime) {
        params.append('scheduled_publish_time', String(Math.floor(scheduledPublishTime.getTime() / 1000)));
    }

    try {
        const res = await fetch(`https://graph.facebook.com/v19.0/${page.id}/feed`, {
            method: 'POST',
            body: params,
        });
        const data = await res.json();
        if (data.error) {
            throw data.error;
        }
        return data;
    } catch (error: any) {
        console.error('Facebook text post error:', error);
        throw error;
    }
};

const publishPhoto = async ({ page, caption, scheduledPublishTime, imageBase64 }: { page: FacebookPage; caption: string; scheduledPublishTime?: Date; imageBase64: string; }) => {
    const blob = base64ToBlob(imageBase64);
    
    const formData = new FormData();
    formData.append('source', blob);
    formData.append('caption', caption);
    formData.append('access_token', page.access_token);

    // Explicitly set the 'published' status. It must be false for scheduled posts.
    formData.append('published', String(!scheduledPublishTime));

    if (scheduledPublishTime) {
        formData.append('scheduled_publish_time', String(Math.floor(scheduledPublishTime.getTime() / 1000)));
    }
    
    try {
        const res = await fetch(`https://graph.facebook.com/v19.0/${page.id}/photos`, {
            method: 'POST',
            body: formData,
        });
        const data = await res.json();
        if (data.error) {
            throw data.error;
        }
        return data;
    } catch (error: any) {
        console.error('Facebook photo upload error:', error);
        throw error;
    }
};

export const publishPost = async ({ page, message, scheduledPublishTime, imageBase64 }: PublishPostParams): Promise<any> => {
    if (imageBase64) {
        return publishPhoto({ page, caption: message, scheduledPublishTime, imageBase64 });
    } else {
        return publishTextPost({ page, message, scheduledPublishTime });
    }
};

export const verifyManualToken = async (token: string, pageId: string): Promise<{ name: string, picture?: { data: { url: string }}}> => {
    try {
        const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=name,picture&access_token=${token}`);
        const data = await res.json();
        if (data.error || !data.name) {
            throw new Error(data.error?.message || 'Invalid Token or Page ID. The token may have expired or lacks permissions for this Page.');
        }
        return data;
    } catch (error: any) {
        console.error('Facebook token verification error:', error);
        throw new Error(error.message || 'Failed to verify token with Facebook.');
    }
};