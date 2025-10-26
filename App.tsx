import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { BrandDashboard } from './components/BrandDashboard';
import { ChatWidget } from './components/ChatWidget';
import { VideoDashboard } from './components/VideoDashboard';
import { generateBrandIdentity, generateVideo, generateWithHydraAI } from './services/geminiService';
import type { BrandIdentity, AiModel, HydraResultItem } from './types';
import { BookOpenIcon, SoraIcon, GoogleIcon, WanIcon, KlingIcon, MinimaxIcon, SeedanceIcon, HydraIcon } from './components/icons/Icons';

const models: AiModel[] = [
    { id: 'hydra-ai', name: 'Hydra AI', description: 'Unleash all models on a single prompt', icon: HydraIcon, type: 'hydra' },
    { id: 'brand-bible', name: 'Brand Bible', description: 'Generate a complete brand identity', icon: BookOpenIcon, type: 'brand' },
    { id: 'sora-2', name: 'Sora 2', description: "OpenAI's most advanced video model", icon: SoraIcon, badge: 'NEW', type: 'video' },
    { id: 'sora-2-enhancer', name: 'Sora 2 Enhancer', description: 'Stabilizes and smooths video quality', icon: SoraIcon, badge: 'BEST', type: 'video' },
    { id: 'google-veo-3.1', name: 'Google Veo 3.1', description: 'Advanced AI video with sound', icon: GoogleIcon, badge: 'NEW', type: 'video' },
    { id: 'wan-2.5', name: 'Wan 2.5', description: 'Next-gen video generation with sound', icon: WanIcon, type: 'video' },
    { id: 'kling-2.5-turbo', name: 'Kling 2.5 Turbo', description: 'Powerful creation, great value', icon: KlingIcon, type: 'video' },
    { id: 'minimax-hailuo-02', name: 'Minimax Hailuo 02', description: 'Fastest high-dynamic video', icon: MinimaxIcon, type: 'video' },
    { id: 'seedance-pro', name: 'Seedance Pro', description: 'Create multi-shot videos', icon: SeedanceIcon, type: 'video' },
    { id: 'kling-speak', name: 'Kling Speak', description: 'Next-gen talking avatars', icon: KlingIcon, type: 'video' },
];

const App: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>('hydra-ai');
  const [brandIdentity, setBrandIdentity] = useState<BrandIdentity | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [hydraResults, setHydraResults] = useState<HydraResultItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string>('');

  const handleGenerate = useCallback(async (prompt: string, modelId: string) => {
    if (!prompt.trim()) {
      setError("Please enter a prompt or mission.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setBrandIdentity(null);
    setVideoUrl(null);
    setHydraResults(null);
    setProgressMessage('Initializing...');

    const model = models.find(m => m.id === modelId);
    if (!model) {
        setError("Invalid model selected.");
        setIsLoading(false);
        return;
    }

    try {
        if (model.type === 'brand') {
            setProgressMessage('Generating your Brand Bible...');
            const result = await generateBrandIdentity(prompt);
            setBrandIdentity(result);
        } else if (model.type === 'video') {
            const result = await generateVideo(prompt, model.id, setProgressMessage);
            setVideoUrl(result);
        } else if (model.type === 'hydra') {
            setProgressMessage('Hydra AI is processing your request...');
            const results = await generateWithHydraAI(prompt, models, setProgressMessage);
            setHydraResults(results);
        }
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
      setProgressMessage('');
    }
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col md:flex-row">
      <Sidebar 
        onGenerate={handleGenerate} 
        isLoading={isLoading}
        models={models}
        selectedModelId={selectedModelId}
        onSelectModel={setSelectedModelId}
      />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto h-full">
          {isLoading && <LoadingState progressMessage={progressMessage} />}
          {error && <ErrorState message={error} />}
          {brandIdentity && !isLoading && !error && <BrandDashboard brandIdentity={brandIdentity} />}
          {videoUrl && !isLoading && !error && <VideoDashboard videoUrl={videoUrl} />}
          {hydraResults && !isLoading && !error && <HydraDashboard results={hydraResults} />}
          {!brandIdentity && !videoUrl && !hydraResults && !isLoading && !error && <InitialState />}
        </div>
      </main>
      <ChatWidget />
    </div>
  );
};

const InitialState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
    <div className="max-w-md">
       <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
         <path strokeLinecap="round" strokeLinejoin="round" d="M12 12V4.5m-4.5 7.5V4.5m9 7.5V4.5" />
       </svg>
      <h2 className="text-2xl font-bold text-white mb-2">Welcome to Hydra AI</h2>
      <p>Select a model from the sidebar, enter your creative prompt, and click "Generate" to begin. Choose Hydra AI to run them all at once!</p>
    </div>
  </div>
);

const LoadingState: React.FC<{ progressMessage: string }> = ({ progressMessage }) => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-lime-300 mb-4"></div>
    <h2 className="text-2xl font-bold text-white">Generating...</h2>
    <p className="text-gray-400 mt-2 max-w-md">{progressMessage || "Our AI is crafting your unique content. This might take a moment."}</p>
  </div>
);

const HydraResultError: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 flex items-center space-x-4">
     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
     </svg>
     <div>
        <h3 className="text-lg font-bold text-white">Generation Failed</h3>
        <p className="text-red-300 text-sm">{message}</p>
     </div>
  </div>
);

const HydraDashboard: React.FC<{ results: HydraResultItem[] }> = ({ results }) => (
    <div className="space-y-12 animate-fade-in">
        <header className="text-center">
             <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                Hydra AI Results
            </h1>
            <p className="text-gray-400 mt-2 text-lg">Outputs from all engaged models.</p>
        </header>

        <div className="space-y-8">
            {results.map((result) => (
                <div key={result.modelId}>
                    <h2 className="text-2xl font-bold mb-4 text-gray-300 border-b-2 border-gray-700 pb-2">{result.modelName}</h2>
                    <div className="mt-4">
                        {result.error && <HydraResultError message={result.error} />}
                        {result.data && result.type === 'brand' && typeof result.data !== 'string' && <BrandDashboard brandIdentity={result.data} />}
                        {result.data && result.type === 'video' && typeof result.data === 'string' && <VideoDashboard videoUrl={result.data} />}
                    </div>
                </div>
            ))}
        </div>
    </div>
);


interface ErrorStateProps {
  message: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full text-center bg-red-900/20 border border-red-500 rounded-lg p-8">
     <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
     </svg>
    <h2 className="text-2xl font-bold text-white mb-2">An Error Occurred</h2>
    <p className="text-red-300">{message}</p>
  </div>
);

export default App;