import React from 'react';
import { motion } from 'motion/react';

interface NavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = ['Home', 'Work', 'Blog', 'Contact'];

export const Navigation: React.FC<NavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
      <motion.div 
        className="glass rounded-full px-2 py-2 flex items-center gap-1 shadow-2xl border-white/10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              relative px-5 py-2 rounded-full text-xs font-medium transition-all duration-300
              ${activeTab === tab ? 'text-ink' : 'text-ink/40 hover:text-ink/60'}
            `}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-periwinkle/10 rounded-full border border-periwinkle/20"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </motion.div>
    </nav>
  );
};
