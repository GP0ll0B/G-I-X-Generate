import React from 'react';

interface PostHeaderProps {
  variant?: 'default' | 'video';
}

export const PostHeader: React.FC<PostHeaderProps> = ({ variant = 'default' }) => {
    const isVideo = variant === 'video';
    const userName = "GIX";

    const finalAvatarUrl = (
        isVideo 
        ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}&backgroundColor=ffffff,d1d5db,9ca3af&backgroundType=gradient`
        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}&backgroundColor=008080,009688,4caf50&backgroundType=gradient`
    );

    return (
        <div className={isVideo ? "flex items-center" : "flex items-center mb-4"}>
            <img
                src={finalAvatarUrl}
                alt={userName}
                className={`w-10 h-10 rounded-full mr-3 ${isVideo ? 'border-2 border-white/50' : ''}`}
            />
            <div>
                <p className={isVideo ? "font-bold text-white" : "font-bold text-gray-800 dark:text-gray-100"}>{userName}</p>
                <p className={isVideo ? "text-xs text-gray-200" : "text-xs text-gray-500 dark:text-gray-400"}>Science & Tech · Just now · 🌐</p>
            </div>
        </div>
    );
};