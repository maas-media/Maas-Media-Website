import React from 'react';
import { motion } from 'motion/react';

export const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer">
      <span className="font-montserrat font-extrabold uppercase tracking-widest text-ink text-xs">MAAS MEDIA</span>
    </div>
  );
};
