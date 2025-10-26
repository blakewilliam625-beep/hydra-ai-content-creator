
import React, { useEffect } from 'react';
import type { BrandIdentity } from '../types';
import { LogoCard } from './LogoCard';
import { ColorPalette } from './ColorPalette';
import { FontPairing } from './FontPairing';

interface BrandDashboardProps {
  brandIdentity: BrandIdentity;
}

export const BrandDashboard: React.FC<BrandDashboardProps> = ({ brandIdentity }) => {
    const { companyName, logoDescription, secondaryMarksDescriptions, colorPalette, fontPairings } = brandIdentity;
    
    useEffect(() => {
        const headerFont = fontPairings.header.replace(/\s/g, '+');
        const bodyFont = fontPairings.body.replace(/\s/g, '+');
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${headerFont}:wght@700;900&family=${bodyFont}:wght@400;500&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, [fontPairings]);

  return (
    <div className="space-y-12 animate-fade-in">
        <header className="text-center">
            <h1 style={{ fontFamily: `'${fontPairings.header}', sans-serif` }} className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                {companyName}
            </h1>
            <p className="text-gray-400 mt-2 text-lg">Your Complete Brand Bible</p>
        </header>
      
      <section>
        <h2 className="text-3xl font-bold mb-6 text-lime-300">Logos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <LogoCard title="Primary Logo" description={logoDescription} companyName={companyName} font={fontPairings.header} isPrimary={true} />
            {secondaryMarksDescriptions.map((desc, index) => (
                <LogoCard key={index} title={`Secondary Mark ${index + 1}`} description={desc} companyName={companyName} font={fontPairings.header} />
            ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-lime-300">Color Palette</h2>
        <ColorPalette colors={colorPalette} />
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-lime-300">Typography</h2>
        <FontPairing fonts={fontPairings} />
      </section>
    </div>
  );
};
