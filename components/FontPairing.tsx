
import React from 'react';
import type { FontPairing as FontPairingType } from '../types';

interface FontPairingProps {
  fonts: FontPairingType;
}

export const FontPairing: React.FC<FontPairingProps> = ({ fonts }) => {
  return (
    <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 grid md:grid-cols-2 gap-8">
      <div>
        <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Header Font</p>
        <p 
            className="text-5xl font-bold truncate text-white"
            style={{ fontFamily: `'${fonts.header}', sans-serif`}}
        >
          {fonts.header}
        </p>
        <p 
            className="text-lg mt-4"
            style={{ fontFamily: `'${fonts.header}', sans-serif`}}
        >
            Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
        </p>
      </div>
      <div className="border-t border-gray-700 md:border-t-0 md:border-l md:pl-8">
        <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Body Font</p>
        <p 
            className="text-5xl font-bold truncate text-white"
            style={{ fontFamily: `'${fonts.body}', sans-serif`}}
        >
          {fonts.body}
        </p>
        <p 
            className="text-lg mt-4 text-gray-300"
            style={{ fontFamily: `'${fonts.body}', sans-serif`}}
        >
            The quick brown fox jumps over the lazy dog. This font is perfect for paragraphs and longer-form content, ensuring readability and a pleasant reading experience.
        </p>
      </div>
    </div>
  );
};
