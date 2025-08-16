import React from 'react';

interface HashtagsProps {
  hashtags: string[];
  containerClassName?: string;
  linkClassName?: string;
}

export const Hashtags: React.FC<HashtagsProps> = ({ hashtags, containerClassName, linkClassName }) => {
  if (!hashtags || hashtags.length === 0) {
    return null;
  }

  return (
    <div className={containerClassName || "mt-4 text-sm"}>
      {hashtags.map((tag) => (
        <a 
          key={tag} 
          href={`https://www.facebook.com/hashtag/${tag.substring(1)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName || "inline-block mr-2 font-medium text-blue-600 dark:text-blue-400 hover:underline"}
        >
          {tag}
        </a>
      ))}
    </div>
  );
};
