import React from 'react';

interface VideoDashboardProps {
  videoUrl: string;
}

export const VideoDashboard: React.FC<VideoDashboardProps> = ({ videoUrl }) => {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-6 text-lime-300 text-center">Video Generation Complete</h1>
      <div className="w-full max-w-4xl aspect-video bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
        <video
          src={videoUrl}
          controls
          autoPlay
          loop
          className="w-full h-full object-contain"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};
