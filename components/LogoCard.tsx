
import React from 'react';

interface LogoCardProps {
  title: string;
  description: string;
  companyName: string;
  font: string;
  isPrimary?: boolean;
}

export const LogoCard: React.FC<LogoCardProps> = ({ title, description, companyName, font, isPrimary = false }) => {
  const getInitials = (name: string) => {
    const words = name.split(' ');
    if (words.length > 1) {
      return words[0][0] + words[1][0];
    }
    return name.substring(0, 2);
  };

  return (
    <div className={`bg-gray-800 p-6 rounded-2xl border border-gray-700 flex flex-col ${isPrimary ? 'lg:col-span-1 md:col-span-2' : ''}`}>
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4 border border-gray-700">
        <div 
            className="text-6xl font-black text-white"
            style={{ fontFamily: `'${font}', sans-serif` }}
        >
            {isPrimary ? companyName.split(' ')[0] : getInitials(companyName)}
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm flex-grow">{description}</p>
    </div>
  );
};
