import React from 'react';

interface SignatureBlockProps {
  html: string;
}

export const SignatureBlock: React.FC<SignatureBlockProps> = ({ html }) => {
  return (
    <div className="dark:text-gray-300" dangerouslySetInnerHTML={{ __html: html.replace(/color: #333/g, 'color: inherit').replace(/color: #1877f2/g, 'color: #3b82f6')}} />
  );
};
