import React from 'react';
import { motion } from 'motion/react';

export const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer">
      <motion.div 
        className="w-12 h-12 glass rounded-xl flex items-center justify-center p-2 relative overflow-hidden"
        whileHover={{ scale: 1.05 }}
      >
        <div className="absolute inset-0 bg-periwinkle/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="w-6 h-6 text-periwinkle drop-shadow-[0_0_8px_rgba(122,160,255,0.5)]"
          stroke="currentColor" 
          strokeWidth="1.5"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M15 12c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z" />
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
        </svg>
      </motion.div>
      <span className="text-spaced text-ink">Maas Media</span>
    </div>
  );
};
