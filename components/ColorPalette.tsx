
import React from 'react';
import type { Color } from '../types';

interface ColorPaletteProps {
  colors: Color[];
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ colors }) => {
  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    // You could add a small toast notification here for better UX
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
      {colors.map((color) => (
        <div key={color.hex} className="group cursor-pointer" onClick={() => copyToClipboard(color.hex)}>
          <div
            className="w-full aspect-square rounded-lg mb-2 transition-transform group-hover:scale-105"
            style={{ backgroundColor: color.hex }}
          />
          <div className="text-center">
            <p className="font-bold text-white">{color.name}</p>
            <p className="text-sm text-gray-400 uppercase tracking-wider group-hover:text-lime-300 transition-colors">{color.hex}</p>
            <p className="text-xs text-gray-500">{color.usage}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
