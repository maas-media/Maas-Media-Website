import React from 'react';
import { motion } from 'motion/react';

interface NavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = ['Home', 'Work', 'Blog', 'Contact'];

export const Navigation: React.FC<NavProps> = ({ activeTab, setActiveTab }) => {
  const [isLogoHovered, setIsLogoHovered] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    isFirstRender.current = false;
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
      <motion.div 
        className="glass rounded-full px-2 py-2 flex items-center shadow-2xl border-white/10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ 
          y: scrolled ? -24 : 0, 
          opacity: 1 
        }}
        transition={{ 
          y: { 
            type: 'spring', 
            stiffness: 100, 
            damping: 20, 
            mass: 1,
            delay: isFirstRender.current ? 1 : 0
          },
          opacity: { delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }}
      >
        {/* Logo Section */}
        <div className="flex items-center pl-3 md:pl-4 pr-1 md:pr-2 gap-2 md:gap-4">
          <button 
            onClick={() => setActiveTab('Home')}
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
            className="font-montserrat font-black text-base tracking-tighter transition-colors duration-200 lowercase cursor-pointer"
            style={{ 
              color: isLogoHovered ? '#7aa0ff' : '#333333',
              background: 'none',
              backgroundClip: 'unset',
              WebkitBackgroundClip: 'unset',
              WebkitTextFillColor: 'initial'
            }}
          >
            maas
          </button>
          <div className="w-px h-4 bg-ink/10" />
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                relative px-3 md:px-5 py-2 rounded-full text-xs font-medium transition-all duration-300
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
        </div>
      </motion.div>
    </nav>
  );
};
