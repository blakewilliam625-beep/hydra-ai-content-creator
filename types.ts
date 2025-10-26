// FIX: Add missing import for React to resolve namespace error.
import type React from 'react';

export interface Color {
  name: string;
  hex: string;
  usage: string;
}

export interface FontPairing {
  header: string;
  body: string;
}

export interface BrandIdentity {
  logoDescription: string;
  secondaryMarksDescriptions: string[];
  colorPalette: Color[];
  fontPairings: FontPairing;
  companyName: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type AiModel = {
  id: string;
  name: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  badge?: 'NEW' | 'BEST';
  type: 'brand' | 'video' | 'hydra';
};

export interface HydraResultItem {
  modelId: string;
  modelName: string;
  type: 'brand' | 'video';
  data?: BrandIdentity | string; // BrandIdentity for brand, string (url) for video
  error?: string;
}
