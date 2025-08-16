

import React, { useCallback } from 'react';

interface TopicFormProps {
    topic: string;
    setTopic: (topic: string) => void;
    postType: 'text' | 'grounded_text' | 'image' | 'video' | 'video_generation';
    videoInputImage: { data: string; type: string; } | null;
    setVideoInputImage: (image: { data: string; type: string; } | null) => void;
}

export const TopicForm: React.FC<TopicFormProps> = ({ topic, setTopic, postType, videoInputImage, setVideoInputImage }) => {
    const placeholderText = {
        text: "e.g., The future of decentralized AI",
        grounded_text: "e.g., Who won the 2024 Nobel Prize in Physics?",
        image: "e.g., A stunning visual of a neural network",
        video: "e.g., A motivational message for a video script",
        video_generation: "e.g., A high-speed drone flight through a futuristic city"
    };

    const handleFileChange = useCallback((files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            if (!file.type.startsWith('image/')) {
                // In a real app, it's better to show a toast message to the user.
                console.error("Invalid file type. Please select an image.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                setVideoInputImage({
                    data: e.target?.result as string,
                    type: file.type,
                });
            };
            reader.readAsDataURL(file);
        }
    }, [setVideoInputImage]);

    return (
        <div>
            <label htmlFor="topic" className="font-semibold text-gray-800 dark:text-gray-200">
                Enter Post Topic or Idea
            </label>
            <textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={placeholderText[postType]}
                className="w-full mt-1 p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                rows={4}
            />
            {postType === 'video_generation' && (
                <div className="mt-4 space-y-2 animate-fade-in-fast">
                    <label className="font-semibold text-gray-800 dark:text-gray-200">
                        Input Image (Optional)
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Add an image to guide the video generation process.</p>
                    {videoInputImage ? (
                        <div className="relative group">
                            <img src={videoInputImage.data} alt="Video input preview" className="w-full h-auto max-h-48 object-cover rounded-lg" />
                            <button
                                onClick={() => setVideoInputImage(null)}
                                className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                                aria-label="Remove image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ) : (
                        <div 
                            className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                handleFileChange(e.dataTransfer.files);
                            }}
                        >
                            <input
                                type="file"
                                id="video-image-upload"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => handleFileChange(e.target.files)}
                                accept="image/png, image/jpeg, image/webp"
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400">Drag & drop an image or click to upload</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};