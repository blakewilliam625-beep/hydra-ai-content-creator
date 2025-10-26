import React, { useState, useEffect } from 'react';
import type { AiModel } from '../types';

interface SidebarProps {
  onGenerate: (prompt: string, modelId: string) => void;
  isLoading: boolean;
  models: AiModel[];
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
}

const ModelCard: React.FC<{ model: AiModel; isSelected: boolean; onClick: () => void }> = ({ model, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center space-x-4 p-3 rounded-xl cursor-pointer transition-all duration-200 relative ${
      isSelected ? 'bg-gray-700/60 ring-2 ring-lime-300' : 'bg-gray-800/50 hover:bg-gray-700/50'
    }`}
  >
    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${isSelected ? 'bg-gray-800' : 'bg-gray-700'}`}>
        <model.icon className="w-7 h-7 text-white" />
    </div>
    <div className="flex-1">
        <h3 className="font-bold text-white">{model.name}</h3>
        <p className="text-sm text-gray-400">{model.description}</p>
    </div>
    {model.badge && (
      <div className={`absolute top-0 right-0 -mt-2 -mr-2 text-xs font-bold px-2 py-1 rounded-full ${
        model.badge === 'NEW' ? 'bg-lime-300 text-gray-900' : 'bg-pink-500 text-white'
      }`}>
        {model.badge}
      </div>
    )}
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ onGenerate, isLoading, models, selectedModelId, onSelectModel }) => {
  const [prompt, setPrompt] = useState('');
  const [apiKeyMissingForVeo, setApiKeyMissingForVeo] = useState(false);
  
  const selectedModel = models.find(m => m.id === selectedModelId);

  useEffect(() => {
    const checkApiKey = async () => {
      const isVeo = selectedModel?.id === 'google-veo-3.1';
      const isHydra = selectedModel?.id === 'hydra-ai';
      if ((isVeo || isHydra) && 'aistudio' in window) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setApiKeyMissingForVeo(!hasKey);
      } else {
        setApiKeyMissingForVeo(false);
      }
    };
    checkApiKey();
  }, [selectedModelId, selectedModel]);

  const handleSelectKey = async () => {
    if ('aistudio' in window) {
      await (window as any).aistudio.openSelectKey();
      setApiKeyMissingForVeo(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt, selectedModelId);
  };

  let formConfig;
  if (selectedModel?.type === 'brand') {
      formConfig = {
        label: "Company Mission",
        description: "Describe your company's purpose, values, and what you want to achieve.",
        placeholder: "e.g., 'To build a sustainable future by creating eco-friendly products...'"
      };
  } else if (selectedModel?.type === 'video') {
      formConfig = {
        label: "Video Prompt",
        description: "Describe the video you want to create. Be as specific and creative as possible!",
        placeholder: "e.g., 'A cinematic shot of a robot surfing on a giant wave at sunset...'"
    };
  } else { // This will be for 'hydra'
      formConfig = {
        label: "Universal Prompt",
        description: "Enter a single, powerful prompt. Hydra AI will adapt it and send it to all available models.",
        placeholder: "e.g., 'A futuristic cityscape with flying cars and neon signs, embodying a sleek tech brand...'"
      }
  }


  return (
    <aside className="w-full md:w-[450px] bg-gray-900 border-r border-gray-700/50 p-6 flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Hydra AI</h1>
      
      <div className="space-y-3 mb-6 overflow-y-auto custom-scrollbar pr-2 flex-shrink-0" style={{ maxHeight: '40vh' }}>
        {models.map((model) => (
          <ModelCard 
            key={model.id} 
            model={model} 
            isSelected={model.id === selectedModelId}
            onClick={() => onSelectModel(model.id)}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <label htmlFor="prompt" className="text-lg font-semibold mb-2">{formConfig.label}</label>
        <p className="text-gray-400 mb-4 text-sm">{formConfig.description}</p>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={formConfig.placeholder}
          className="w-full flex-grow p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all custom-scrollbar"
          rows={8}
        />
        
        {apiKeyMissingForVeo && (
            <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-lg text-center">
                <p className="text-yellow-200 text-sm mb-3">Google Veo (used by Hydra AI) requires an API key for video generation. Please select a key to continue.</p>
                <button type="button" onClick={handleSelectKey} className="bg-yellow-400 text-yellow-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors">
                    Select API Key
                </button>
                 <p className="text-xs text-yellow-400/70 mt-2">
                    For more information, see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline">billing documentation</a>.
                </p>
            </div>
        )}

        <button
          type="submit"
          disabled={isLoading || apiKeyMissingForVeo}
          className="w-full mt-6 bg-lime-300 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-lime-400 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate'
          )}
        </button>
      </form>
    </aside>
  );
};