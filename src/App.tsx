/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useAnimationFrame, animate } from 'motion/react';
import { ParticleBackground } from './components/ParticleBackground';
import { Navigation } from './components/Navigation';
import { Logo } from './components/Logo';
import { GlassCard } from './components/GlassCard';
import { PROJECTS, BLOG_POSTS, TESTIMONIALS, Project } from './mockData';
import { Camera, Mail, ArrowRight, Play, ExternalLink, Hexagon, Home as House, Star, Calendar, Smartphone, MapPin, Clock, GraduationCap, Sparkles, MousePointer2, ChevronLeft, ChevronRight, Quote, ChevronDown, X, Twitter, Link as LinkIcon } from 'lucide-react';

// --- Components ---

const ServiceRow: React.FC<{ 
  service: any; 
  index: number; 
  active: boolean;
  setActive: (active: boolean) => void;
  onNavigate: (tab: string) => void 
}> = ({ service, index, active, setActive, onNavigate }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!active) setIsLoaded(false);
  }, [active]);

  return (
    <motion.div 
      className={`border-b border-ink/10 relative cursor-pointer px-4 transition-colors duration-500 ${active ? 'bg-ink/[0.02]' : 'bg-transparent'}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => setActive(!active)}
    >
      <div className="py-12 flex items-center justify-between group">
        <div className="flex items-center gap-6">
          <div className="relative">
            {React.createElement(service.icon, { 
              className: `w-8 h-8 md:w-12 md:h-12 transition-all duration-500 ${active ? 'text-periwinkle scale-110' : 'text-ink/20'}`,
              strokeWidth: 1
            } as any)}
          </div>
          <h3 className={`text-3xl md:text-5xl font-light transition-all duration-500 ${active ? 'translate-x-4 text-periwinkle' : 'text-ink'}`}>
            {service.title}
          </h3>
        </div>
        <div className="flex items-center gap-12">
          <span className="text-spaced opacity-20 group-hover:opacity-60 transition-opacity">0{index + 1}</span>
          <ArrowRight className={`w-8 h-8 opacity-20 transition-all duration-500 ${active ? 'rotate-90 text-periwinkle opacity-100' : ''}`} />
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: active ? 'auto' : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="pb-16 flex flex-col md:flex-row items-center gap-16 justify-between">
          <div className="flex-1 space-y-8">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl font-light text-ink/60 leading-relaxed max-w-lg"
            >
              {service.desc}
            </motion.p>
            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
              transition={{ delay: 0.3 }}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('Work');
              }}
              className="inline-flex items-center gap-2 text-periwinkle font-medium hover:gap-4 transition-all"
            >
              See the work <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.95 }}
            transition={{ delay: 0.1 }}
            className="w-full md:w-[45%] lg:w-[40%] max-w-md aspect-square rounded-2xl overflow-hidden glass border-periwinkle/10 relative bg-[#0f0f19]/80"
          >
            {active && (
              <>
                <motion.div 
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isLoaded ? 0 : 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 z-0 animate-shimmer"
                />
                <iframe 
                  src="https://player.vimeo.com/video/1188089564?autoplay=1&muted=1&loop=1&background=1&controls=0"
                  className={`absolute inset-0 w-full h-full pointer-events-none border-none transition-opacity duration-400 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                  allow="autoplay; fullscreen"
                  title={service.title}
                  onLoad={() => setIsLoaded(true)}
                />
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FeaturedQuoteTestimonials: React.FC = () => {
  const testimonials = [
    ...TESTIMONIALS.map((t, i) => ({ 
      ...t, 
      company: t.role === 'Founder' ? 'Creative Studio' : 'Corporate Solutions',
      initials: t.name.split(' ').map(n => n[0]).join('')
    })),
    { 
      id: '4', 
      name: 'Michael K.', 
      text: 'Isaac has a rare ability to capture the energy of a room without ever being intrusive.', 
      company: 'MK Productions',
      initials: 'MK'
    },
    { 
      id: '5', 
      name: 'Marcus T.', 
      text: 'The attention to detail in his property tours has set a new standard for our portfolio.', 
      company: 'The Ritz',
      initials: 'MT'
    },
    { 
      id: '6', 
      name: 'Jessica W.', 
      text: 'Clean, energetic, and professional. The turnaround time is just as impressive.', 
      company: 'Events by JW',
      initials: 'JW'
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
  };

  const resetTimer = () => {
    startTimer();
  };

  useEffect(() => {
    if (!isPaused) {
      startTimer();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, activeIndex]);

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section 
      className="container mx-auto px-4 py-32"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mb-20">
        <span className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-medium">Kind words</span>
      </div>

      <div className="flex flex-col items-center">
        {/* Top Zone: Featured Quote */}
        <div className="relative w-full max-w-[700px] h-[400px] flex flex-col items-center justify-center text-center overflow-y-auto">
          <Quote className="w-16 h-16 text-periwinkle/15 font-light mb-8 flex-shrink-0" strokeWidth={1} />
          
          <div className="relative w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="space-y-8"
              >
                <blockquote className="text-2xl md:text-[32px] font-light text-ink/80 leading-relaxed italic">
                  "{activeTestimonial.text}"
                </blockquote>
                
                <div className="flex flex-col items-center gap-6">
                  <div className="w-10 h-[1px] bg-ink/10" />
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-ink">{activeTestimonial.name}</div>
                    <div className="text-xs text-ink/40 uppercase tracking-widest">{activeTestimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Zone: Avatar Strip */}
        <div className="mt-12 flex flex-wrap justify-center items-start gap-4 md:gap-8 min-h-[100px]">
          {testimonials.map((t, i) => {
            const isActive = activeIndex === i;
            const isHovered = hoveredId === t.id;
            
            return (
              <div 
                key={t.id} 
                className="flex flex-col items-center group/avatar cursor-pointer"
                onMouseEnter={() => setHoveredId(t.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => {
                  setActiveIndex(i);
                  resetTimer();
                }}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1 : (isHovered ? 1.08 : 1),
                    opacity: isActive ? 1 : (isHovered ? 0.75 : 0.45),
                    boxShadow: isActive ? '0 0 20px rgba(122, 160, 255, 0.4)' : '0 0 0px rgba(122, 160, 255, 0)',
                  }}
                  transition={{
                    duration: isHovered ? 0.4 : 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className={`
                    relative rounded-full flex items-center justify-center overflow-hidden
                    ${isActive 
                      ? 'w-14 h-14 md:w-[56px] md:h-[56px] border-2 border-periwinkle/80' 
                      : 'w-12 h-12 md:w-[48px] md:h-[48px] glass border-ink/5'}
                  `}
                >
                  <div className="text-xs font-semibold text-periwinkle">
                    {t.initials}
                  </div>
                </motion.div>
                
                {/* Reserved space for name label */}
                <div className="h-8 flex items-center justify-center mt-3">
                  <motion.span
                    animate={{ 
                      opacity: (isActive || isHovered) ? (isActive ? 1 : 0.6) : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`text-[9px] uppercase tracking-widest text-center transition-colors pointer-events-none ${isActive ? 'text-periwinkle font-medium' : 'text-ink/40'}`}
                  >
                    {t.name}
                  </motion.span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};



const BentoGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
    {children}
  </div>
);

const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-12">
    <motion.span 
      className="text-spaced text-periwinkle"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      {subtitle}
    </motion.span>
    <motion.h2 
      className="text-4xl md:text-5xl font-light mt-2 text-ink tracking-tight"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {title}
    </motion.h2>
  </div>
);

// --- Sections / Pages ---

const SKILLS = [
  'FAA Certified Drone Pilot',
  'DaVinci Resolve',
  'Cinematography',
  'Pro Grade Audio',
  'Motion Graphics',
  'Adaptive Lighting',
  'Google Ads Certified'
];

const WaveformBorder = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const offset1 = useMotionValue(0);
  const offset2 = useMotionValue(0);
  const breatheOpacity = useMotionValue(0.15);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { width, height } = dimensions;
  const rx = 24; 
  // Approximate perimeter for a rounded rectangle
  const perimeter = (width + height) * 2 - rx * 8 + (2 * Math.PI * rx);

  useAnimationFrame((time, delta) => {
    if (perimeter <= 0) return;
    
    // time is in milliseconds
    const t = time / 1000;

    // Fix 2: Randomized Variable Speed
    // Modulate speeds using sine waves to create organic, non-mechanical motion
    
    // Layer 1: Slow clockwise pulse (~6s base cycle)
    // Speed modulates over ~5 seconds cycle
    const baseSpeed1 = 0.16; // fraction of perimeter per second
    const modSpeed1 = 0.05 * Math.sin(t * (2 * Math.PI / 5));
    const speed1 = (baseSpeed1 + modSpeed1) * perimeter;
    offset1.set((offset1.get() - speed1 * (delta / 1000)) % perimeter);

    // Layer 2: Fast counter-clockwise pulse (~3.5s base cycle)
    // Speed modulates over ~2 seconds cycle
    const baseSpeed2 = 0.28;
    const modSpeed2 = 0.1 * Math.sin(t * (2 * Math.PI / 2));
    const speed2 = (baseSpeed2 + modSpeed2) * perimeter;
    offset2.set((offset2.get() + speed2 * (delta / 1000)) % perimeter);

    // Layer 3: Breathe opacity
    // Slowly varies over 4 seconds
    const opacity = 0.15 + 0.1 * Math.sin(t * (2 * Math.PI / 4));
    breatheOpacity.set(opacity);
  });

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(122, 160, 255, 0.8)" />
            <stop offset="50%" stopColor="rgba(180, 140, 255, 0.9)" />
            <stop offset="100%" stopColor="rgba(122, 160, 255, 0.8)" />
          </linearGradient>
          <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(100, 210, 220, 0.8)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="100%" stopColor="rgba(100, 210, 220, 0.8)" />
          </linearGradient>
          
          {/* Fix 1: Soft fading pulse ends using blurred masks */}
          <filter id="soft-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
          </filter>
          
          <mask id="pulse-mask-1">
            <motion.rect
              x="2" y="2" width={Math.max(0, width - 4)} height={Math.max(0, height - 4)} rx={rx}
              fill="none" stroke="white" strokeWidth="6"
              strokeDasharray={`${width * 0.6} ${perimeter}`}
              style={{ strokeDashoffset: offset1 }}
              filter="url(#soft-blur)"
            />
          </mask>
          
          <mask id="pulse-mask-2">
            <motion.rect
              x="2" y="2" width={Math.max(0, width - 4)} height={Math.max(0, height - 4)} rx={rx}
              fill="none" stroke="white" strokeWidth="6"
              strokeDasharray={`${width * 0.3} ${perimeter}`}
              style={{ strokeDashoffset: offset2 }}
              filter="url(#soft-blur)"
            />
          </mask>
        </defs>

        {/* Layer 3: Diffuse Global Glow Breathe Layer */}
        <motion.rect
          x="1" y="1" width={Math.max(0, width - 2)} height={Math.max(0, height - 2)} rx={rx}
          fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="3.5"
          style={{ opacity: breatheOpacity }}
        />

        {/* Layer 1: Slow wide clockwise pulse (masked for soft ends) */}
        <rect
          x="1.5" y="1.5" width={Math.max(0, width - 3)} height={Math.max(0, height - 3)} rx={rx}
          fill="none" stroke="url(#wave-gradient-1)" strokeWidth="2.5"
          mask="url(#pulse-mask-1)"
        />

        {/* Layer 2: Faster narrow counter-clockwise pulse (masked for soft ends) */}
        <rect
          x="1.5" y="1.5" width={Math.max(0, width - 3)} height={Math.max(0, height - 3)} rx={rx}
          fill="none" stroke="url(#wave-gradient-2)" strokeWidth="2.5"
          mask="url(#pulse-mask-2)"
        />
      </svg>
    </div>
  );
};

const TypewriterSkills = () => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  
  const currentSkill = SKILLS[index];
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isPausing) {
      timeout = setTimeout(() => {
        setIsPausing(false);
        setIsDeleting(true);
      }, 1800);
    } else if (isDeleting && displayText === '') {
      setIndex((prev) => (prev + 1) % SKILLS.length);
      setIsDeleting(false);
    } else if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
      }, 45);
    } else if (displayText === currentSkill) {
      setIsPausing(true);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(currentSkill.slice(0, displayText.length + 1));
      }, 90);
    }
    
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, isPausing, index, currentSkill]);

  return (
    <GlassCard className="w-full h-full py-12 md:py-16 px-6 md:px-8 flex flex-col items-center justify-center min-h-[180px] md:min-h-[240px] border-ink/5 relative overflow-hidden group">
      <WaveformBorder />
      <span className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-medium mb-6 relative z-10">
        What I bring to the table...
      </span>
      <div className="relative z-10 flex items-center justify-center text-center w-full min-h-[42px] md:min-h-[60px]">
        <div className="flex flex-wrap justify-center items-center text-ink px-2 text-2xl md:text-[42px]">
          {displayText.split('').map((char, i) => (
            <span
              key={`${index}-${i}`}
              className="font-light tracking-tight leading-none"
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
          {/* Cursor */}
          <motion.span 
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
            className="w-[2px] md:w-[3px] ml-1 bg-ink inline-block align-middle"
            style={{ 
              height: '1em',
            }}
          />
        </div>
      </div>
    </GlassCard>
  );
};

import { MorphingParticleIcon, IconShape } from './components/MorphingParticleIcon';

const FloatingVideoFrame: React.FC<{ 
  size: 'small' | 'medium' | 'large'; 
  initialPos: { x: number; y: number };
  delay?: number;
}> = ({ size, initialPos, delay = 0 }) => {
  const sizeClasses = {
    small: 'w-32 md:w-48 aspect-video',
    medium: 'w-48 md:w-80 aspect-video',
    large: 'w-64 md:w-[520px] aspect-video',
  };

  return (
    <motion.div
      style={{ 
        left: `${initialPos.x}%`,
        top: `${initialPos.y}%`,
        perspective: 1000
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [0, -20, 0], // Continuous floating drift
        x: [0, 10, 0], // Subtle side to side drift
      }}
      transition={{
        opacity: { duration: 1, delay },
        scale: { duration: 1, delay },
        y: { 
          duration: 6 + Math.random() * 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: Math.random() * 5
        },
        x: { 
          duration: 8 + Math.random() * 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: Math.random() * 5
        }
      }}
      className={`absolute z-0 ${sizeClasses[size]} rounded-2xl md:rounded-3xl overflow-hidden glass border-ink/10 shadow-2xl pointer-events-none hidden md:block`}
    >
      <iframe 
        src="https://player.vimeo.com/video/1188089564?autoplay=1&muted=1&loop=1&background=1&controls=0"
        className="absolute inset-0 w-full h-full border-none pointer-events-none scale-[1.3]"
        allow="autoplay; fullscreen"
        title="Floating Video Content"
      />
      <div className="absolute inset-0 bg-periwinkle/5 pointer-events-none" />
    </motion.div>
  );
};

const PulsingRim: React.FC<{ borderRadius?: number }> = ({ borderRadius = 40 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const offset1 = useMotionValue(0);
  const offset2 = useMotionValue(0);
  const breatheOpacity = useMotionValue(0.15);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { width, height } = dimensions;
  const rx = borderRadius; 
  // Approximate perimeter for a rounded rectangle
  const perimeter = (width + height) * 2 - rx * 8 + (2 * Math.PI * rx);

  useAnimationFrame((time, delta) => {
    if (perimeter <= 0) return;
    
    const t = time / 1000;

    // Layer 1: Slow clockwise pulse
    const baseSpeed1 = 0.12;
    const modSpeed1 = 0.04 * Math.sin(t * (2 * Math.PI / 5));
    const speed1 = (baseSpeed1 + modSpeed1) * perimeter;
    offset1.set((offset1.get() - speed1 * (delta / 1000)) % perimeter);

    // Layer 2: Faster counter-clockwise pulse
    const baseSpeed2 = 0.22;
    const modSpeed2 = 0.08 * Math.sin(t * (2 * Math.PI / 2.5));
    const speed2 = (baseSpeed2 + modSpeed2) * perimeter;
    offset2.set((offset2.get() + speed2 * (delta / 1000)) % perimeter);

    // Layer 3: Breathe opacity
    const opacity = 0.25 + 0.15 * Math.sin(t * (2 * Math.PI / 4));
    breatheOpacity.set(opacity);
  });

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="hero-rim-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(122, 160, 255, 0.85)" />
            <stop offset="50%" stopColor="rgba(216, 180, 254, 1)" />
            <stop offset="100%" stopColor="rgba(122, 160, 255, 0.85)" />
          </linearGradient>
          <linearGradient id="hero-rim-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(150, 240, 255, 0.85)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 1)" />
            <stop offset="100%" stopColor="rgba(150, 240, 255, 0.85)" />
          </linearGradient>
          
          <filter id="hero-soft-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" result="blur" />
          </filter>
          
          <mask id="hero-pulse-mask-1">
            <motion.rect
              x="2" y="2" width={Math.max(0, width - 4)} height={Math.max(0, height - 4)} rx={rx}
              fill="none" stroke="white" strokeWidth="12"
              strokeDasharray={`${width * 0.8} ${perimeter}`}
              style={{ strokeDashoffset: offset1 }}
              filter="url(#hero-soft-blur)"
            />
          </mask>
          
          <mask id="hero-pulse-mask-2">
            <motion.rect
              x="2" y="2" width={Math.max(0, width - 4)} height={Math.max(0, height - 4)} rx={rx}
              fill="none" stroke="white" strokeWidth="12"
              strokeDasharray={`${width * 0.4} ${perimeter}`}
              style={{ strokeDashoffset: offset2 }}
              filter="url(#hero-soft-blur)"
            />
          </mask>
        </defs>

        {/* Layer 3: Diffuse Global Glow Breathe Layer */}
        <motion.rect
          x="1" y="1" width={Math.max(0, width - 2)} height={Math.max(0, height - 2)} rx={rx}
          fill="none" stroke="rgba(122, 160, 255, 0.5)" strokeWidth="10"
          style={{ opacity: breatheOpacity, filter: 'blur(15px)' }}
        />

        {/* Layer 1: Slow wide clockwise pulse */}
        <rect
          x="1" y="1" width={Math.max(0, width - 2)} height={Math.max(0, height - 2)} rx={rx}
          fill="none" stroke="url(#hero-rim-gradient-1)" strokeWidth="4"
          mask="url(#hero-pulse-mask-1)"
        />

        {/* Layer 2: Faster narrow counter-clockwise pulse */}
        <rect
          x="1" y="1" width={Math.max(0, width - 2)} height={Math.max(0, height - 2)} rx={rx}
          fill="none" stroke="url(#hero-rim-gradient-2)" strokeWidth="4"
          mask="url(#hero-pulse-mask-2)"
        />
      </svg>
    </div>
  );
};


const Home: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
  const services = [
    { 
      id: 'brand', 
      title: 'Brand & Commercial', 
      desc: 'Premium brand narratives that drive impact and define your identity through purposeful storytelling.', 
      icon: Play,
      video: 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-keyboard-and-a-cup-of-coffee-34442-large.mp4'
    },
    { 
      id: 'real-estate', 
      title: 'Real Estate', 
      desc: 'Cinematic property tours highlighting architectural detail and neighborhood energy for high-end listings.', 
      icon: House,
      video: 'https://assets.mixkit.co/videos/preview/mixkit-cinematic-view-of-a-misty-forest-4416-large.mp4'
    },
    { 
      id: 'events', 
      title: 'Events', 
      desc: 'Energetic recaps captured with cinematic energy and emotional resonance that preserves every moment.', 
      icon: Calendar,
      video: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-slow-motion-1191-large.mp4'
    },
    { 
      id: 'social', 
      title: 'Social Content', 
      desc: 'Short-form visuals optimized for high-engagement, dynamic pacing, and platform-specific impact.', 
      icon: Smartphone,
      video: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-using-his-mobile-phone-at-night-42289-large.mp4'
    }
  ];

  return (
    <div className="space-y-32 pb-40">
      {/* Hero */}
      <section className="h-screen flex flex-col justify-center items-center relative overflow-hidden bg-white">
        {/* Mobile Fullscreen Video */}
        <div className="md:hidden absolute inset-0 z-0">
          <iframe 
            src="https://player.vimeo.com/video/1188089564?autoplay=1&muted=1&loop=1&background=1&controls=0"
            className="absolute top-1/2 left-1/2 w-[177.77vh] min-w-full h-screen min-h-[56.25vw] -translate-x-1/2 -translate-y-1/2 pointer-events-none border-none"
            allow="autoplay; fullscreen"
            title="Mobile Hero Background Video"
          />
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
        </div>

        {/* Desktop Floating Frames */}
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        >
          <FloatingVideoFrame 
            size="large" 
            initialPos={{ x: 10, y: 15 }} 
            delay={0.2}
          />
          <FloatingVideoFrame 
            size="medium" 
            initialPos={{ x: 70, y: 10 }} 
            delay={0.4}
          />
          <FloatingVideoFrame 
            size="medium" 
            initialPos={{ x: 5, y: 65 }} 
            delay={0.6}
          />
          <FloatingVideoFrame 
            size="small" 
            initialPos={{ x: 65, y: 75 }} 
            delay={0.8}
          />
          <FloatingVideoFrame 
            size="small" 
            initialPos={{ x: 80, y: 45 }} 
            delay={1.0}
          />
        </motion.div>

        <ParticleBackground 
          className="absolute inset-0 z-5 pointer-events-none"
          particleColor="rgba(122, 160, 255, 0.4)"
          lineColor="rgba(122, 160, 255, 0.1)"
        />

        <div className="z-10 px-4 w-full flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[620px] px-8 py-7 md:px-[52px] md:py-7 rounded-[2.5rem] glass border-ink/5 shadow-2xl text-center relative bg-white/40"
          >
            <PulsingRim borderRadius={40} />
            
            {/* Liquid Glass Content */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              <Logo />
              <div className="space-y-3">
                <motion.h1 
                  className="text-5xl md:text-7xl font-light tracking-tighter leading-[0.85] text-ink"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  Visuals built <br /> <span className="text-periwinkle italic">for you.</span>
                </motion.h1>
                <motion.p 
                  className="text-ink/60 text-base md:text-lg font-light max-w-sm mx-auto leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  Elevating narratives through premium cinematography. Based in Atlanta, serving brands worldwide.
                </motion.p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <button 
                  onClick={() => onNavigate('Portfolio')}
                  className="group relative px-10 py-4 rounded-full transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-periwinkle via-lavender to-teal opacity-80 group-hover:opacity-100 transition-opacity rounded-full" />
                  <div className="absolute inset-[1px] bg-ink rounded-full group-hover:inset-[2px] transition-all" />
                  <span className="relative z-10 text-white font-medium flex items-center gap-2">
                    Launch Portfolio <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-ink/60">Explore the process</span>
          <ChevronDown className="w-5 h-5 text-periwinkle/60 text-periwinkle" strokeWidth={1.5} />
        </motion.div>
      </section>

      {/* Services Section: Hover-Reveal Layout */}
      <section className="container mx-auto px-4 border-t border-ink/5 pt-24 pb-32">
        <div className="mb-20">
          <span className="text-spaced opacity-40">What I do</span>
          <h2 className="text-2xl font-light text-ink/60 mt-2">Specialized Cinematography</h2>
        </div>

        <div className="flex flex-col">
          {services.map((service, idx) => (
            <ServiceRow 
              key={service.id} 
              service={service} 
              index={idx} 
              active={expandedIndex === idx}
              setActive={(active) => setExpandedIndex(active ? idx : null)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>


      {/* Selected Works */}

      <FeaturedQuoteTestimonials />
      <section className="container mx-auto px-4 py-32">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          
          {/* Left Column (35-40%) */}
          <div className="w-full lg:w-[38%] flex flex-col gap-6">
            {/* Top Tile: Headshot */}
            <GlassCard className="p-0 overflow-hidden aspect-[3/4] border-ink/5 flex-shrink-0">
              <motion.img 
                initial={{ scale: 1.05, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                src="https://raw.githubusercontent.com/maas-media/Maas-Media-Website/main/src/headshots-4.JPG"
                className="w-full h-full object-cover rounded-3xl"
                alt="Isaac Maas"
              />
            </GlassCard>

            {/* Bottom Tile: Info Strip (Vertical List) - Stretched to fill gap */}
            <GlassCard className="p-10 space-y-10 border-ink/5 flex-grow">
              {[
                { label: 'Location', val: 'Atlanta, GA', icon: MapPin },
                { label: 'Experience', val: '6+ Years', icon: Clock },
                { label: 'Education', val: 'SCAD', icon: GraduationCap },
                { label: 'Fun Fact', val: 'Shot on a Point-and-Shoot', icon: Sparkles }
              ].map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                  className="flex flex-col gap-2"
                >
                  <span className="text-[9px] uppercase tracking-[0.25em] text-ink/40 font-medium">{stat.label}</span>
                  <span className="text-base font-medium text-ink/80">{stat.val}</span>
                </motion.div>
              ))}
            </GlassCard>
          </div>

          {/* Right Column (60-65%) */}
          <div className="w-full lg:w-[62%] flex flex-col gap-6">
            {/* Top Tile: Bio */}
            <GlassCard className="p-12 space-y-8 border-ink/5 text-center lg:text-left flex-grow flex flex-col justify-center">
              <div className="space-y-6">
                <p className="text-2xl font-light text-ink/80 leading-relaxed italic">
                  "I believe every story has a unique frequency. My job is to find the light and shadow that lets it vibrate."
                </p>
                <p className="text-lg font-light text-ink/60 leading-relaxed max-w-2xl">
                  I'm a cinematographer who obsessed with the details. From high-end commercial sets to solo property tours, I treat every frame with the same level of architectural precision and emotional grit.
                </p>
              </div>
            </GlassCard>

            {/* Middle Tile: My Story Video */}
            <GlassCard className="p-12 space-y-6 border-ink/5 overflow-hidden flex-shrink-0">
              <div className="flex flex-col gap-6">
                <span className="text-[10px] uppercase tracking-widest text-ink/40 font-medium text-center lg:text-left">My Story</span>
                <div className="aspect-video w-full rounded-2xl overflow-hidden relative group/vplay cursor-pointer border border-periwinkle/10 bg-[#0f0f19]">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover grayscale brightness-50"
                    src="https://assets.mixkit.co/videos/preview/mixkit-cinematic-mountain-landscape-with-a-river-in-the-valley-4415-large.mp4"
                  >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-cinematic-mountain-landscape-with-a-river-in-the-valley-4415-large.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover/vplay:scale-110 group-hover/vplay:bg-periwinkle/30 transition-all">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Bottom Tile: Typewriter Skills */}
            <div className="flex-grow flex flex-col">
              <TypewriterSkills />
            </div>
          </div>
        </div>

        {/* Full-width CTA Tile */}
        <motion.div 
          whileHover="hover"
          initial="rest"
          animate="rest"
          className="relative p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left mt-6 rounded-3xl overflow-hidden cursor-default"
        >
          {/* Glass State Background (Resting) */}
          <motion.div 
            variants={{
              rest: { opacity: 1, backdropFilter: 'blur(20px)' },
              hover: { opacity: 0, backdropFilter: 'blur(0px)' }
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 z-0 bg-white/60 border border-ink/5 rounded-3xl"
          />

          {/* Gradient State Background (Hover) */}
          <motion.div 
            variants={{
              rest: { opacity: 0 },
              hover: { opacity: 0.9 }
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 z-0 bg-gradient-to-r from-periwinkle via-lavender to-teal blur-2xl"
          />

          <div className="relative z-10 space-y-2">
            <motion.h4 
              variants={{
                rest: { color: '#1a1a2e' },
                hover: { color: '#ffffff' }
              }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-medium"
            >
              Ready to tell your story?
            </motion.h4>
            <motion.p 
              variants={{
                rest: { color: 'rgba(26, 26, 46, 0.6)' },
                hover: { color: 'rgba(255, 255, 255, 0.6)' }
              }}
              transition={{ duration: 0.5 }}
              className="font-light"
            >
              Let's build a cinematic experience together.
            </motion.p>
          </div>
          <button 
            onClick={() => onNavigate('Contact')}
            className="group/btn relative px-10 py-4 rounded-full transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-periwinkle via-lavender to-teal opacity-80 group-hover/btn:opacity-100 transition-opacity rounded-full" />
            <div className="absolute inset-[1px] bg-ink rounded-full group-hover/btn:inset-[2px] transition-all" />
            <span className="relative z-10 text-white font-medium flex items-center gap-2">
              Get in Touch <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </motion.div>
      </section>

    </div>
  );
};

const ProjectLightbox: React.FC<{ 
  project: Project | null; 
  onClose: () => void 
}> = ({ project, onClose }) => {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/92 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors z-[110]"
          >
            <X className="w-8 h-8" />
          </button>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl flex flex-col items-center gap-6"
            onClick={e => e.stopPropagation()}
          >
            {/* Video Player Container */}
            <div 
              className={`
                relative w-full overflow-hidden rounded-2xl shadow-2xl glass border-white/10 bg-black
                ${project.orientation === 'landscape' ? 'max-w-[900px] aspect-video' : ''}
                ${project.orientation === 'vertical' ? 'max-w-[450px] aspect-[9/16] h-[80vh]' : ''}
              `}
            >
              <iframe
                src={`${project.vimeoUrl}?autoplay=1&muted=0&loop=0&controls=1`}
                className="absolute inset-0 w-full h-full border-none"
                allow="autoplay; fullscreen"
                title={project.title}
              />
            </div>

            {/* Info */}
            <div className="w-full max-w-[900px] text-center md:text-left space-y-4 px-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <h2 className="text-2xl md:text-3xl font-medium text-white">{project.title}</h2>
                <span className="inline-block px-3 py-1 rounded-full glass border-white/20 text-[10px] uppercase tracking-widest text-white/60 w-fit mx-auto md:mx-0">
                  {project.category}
                </span>
              </div>
              <p className="text-sm md:text-base text-white/50 font-light max-w-2xl leading-relaxed mx-auto md:mx-0">
                {project.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const categories = ['All', 'Brand & Commercial', 'Real Estate', 'Events', 'Social Content'];
  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === filter);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Template System Logic
  const getGridItems = (projects: Project[]) => {
    const items: Array<{ project: Project; layout: any; template: string }> = [];
    const queue = [...projects];
    
    while (queue.length > 0) {
      const next1 = queue[0];
      const next2 = queue[1];
      const next3 = queue[2];

      // Template E logic: Featured
      if (next1.featured) {
        items.push({
          project: queue.shift()!,
          template: 'E',
          layout: { d: 'md:col-span-12 h-[380px]', t: 'sm:col-span-2 h-[340px]', m: 'h-[300px]' }
        });
        continue;
      }

      // Need at least 3 for A, B, C, D complexity check
      if (queue.length >= 3) {
        // Selection Logic
        const o1 = next1.orientation;
        const o2 = next2.orientation;
        const o3 = next3.orientation;

        // Template D: 2 vertical + 1 landscape
        if (o1 === 'vertical' && o2 === 'vertical' && o3 === 'landscape') {
          items.push({ project: queue.shift()!, template: 'D', layout: { d: 'md:col-span-3 md:row-span-2 h-[480px]', t: 'sm:col-span-1 h-[360px]', m: 'h-[340px]' } });
          items.push({ project: queue.shift()!, template: 'D', layout: { d: 'md:col-span-3 md:row-span-2 h-[480px]', t: 'sm:col-span-1 h-[360px]', m: 'h-[340px]' } });
          items.push({ project: queue.shift()!, template: 'D', layout: { d: 'md:col-span-6 md:row-span-2 h-[480px]', t: 'sm:col-span-2 h-[240px]', m: 'h-[220px]' } });
          continue;
        }

        // Template B: 1 vertical + 2 landscape
        if (o1 === 'vertical' && o2 === 'landscape' && o3 === 'landscape') {
          items.push({ project: queue.shift()!, template: 'B', layout: { d: 'md:col-span-5 md:row-span-2 h-[480px]', t: 'sm:col-span-1 h-[360px]', m: 'h-[340px]' } });
          items.push({ project: queue.shift()!, template: 'B', layout: { d: 'md:col-span-7 md:row-span-1 h-[232px]', t: 'sm:col-span-1 h-[240px]', m: 'h-[220px]' } });
          items.push({ project: queue.shift()!, template: 'B', layout: { d: 'md:col-span-7 md:row-span-1 h-[232px]', t: 'sm:col-span-1 h-[240px]', m: 'h-[220px]' } });
          continue;
        }

        // Template A: 3 landscape (A or C preference, using A here)
        if (o1 === 'landscape' && o2 === 'landscape' && o3 === 'landscape') {
          // Flip between A and C for variety 
          if (items.length % 6 === 0) {
            items.push({ project: queue.shift()!, template: 'A', layout: { d: 'md:col-span-7 md:row-span-2 h-[480px]', t: 'sm:col-span-2 h-[340px]', m: 'h-[220px]' } });
            items.push({ project: queue.shift()!, template: 'A', layout: { d: 'md:col-span-5 md:row-span-1 h-[232px]', t: 'sm:col-span-1 h-[240px]', m: 'h-[220px]' } });
            items.push({ project: queue.shift()!, template: 'A', layout: { d: 'md:col-span-5 md:row-span-1 h-[232px]', t: 'sm:col-span-1 h-[240px]', m: 'h-[220px]' } });
          } else {
            items.push({ project: queue.shift()!, template: 'C', layout: { d: 'md:col-span-4 h-[260px]', t: 'sm:col-span-1 h-[240px]', m: 'h-[220px]' } });
            items.push({ project: queue.shift()!, template: 'C', layout: { d: 'md:col-span-4 h-[260px]', t: 'sm:col-span-1 h-[240px]', m: 'h-[220px]' } });
            items.push({ project: queue.shift()!, template: 'C', layout: { d: 'md:col-span-4 h-[260px]', t: 'sm:col-span-2 h-[240px]', m: 'h-[220px]' } });
          }
          continue;
        }
      }

      // Fallback: Template C (Safe fallback if mixed or < 3)
      const p = queue.shift()!;
      items.push({
        project: p,
        template: 'C',
        layout: p.orientation === 'vertical' 
          ? { d: 'md:col-span-4 h-[480px]', t: 'sm:col-span-1 h-[360px]', m: 'h-[340px]' } 
          : { d: 'md:col-span-4 h-[260px]', t: 'sm:col-span-1 h-[240px]', m: 'h-[220px]' }
      });
    }
    
    return items;
  };

  const projectGridItems = getGridItems(filtered);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 pt-40 pb-40"
    >
      {/* Page Header */}
      <header className="mb-20 space-y-4 max-w-4xl">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-6xl font-light text-ink tracking-tight"
        >
          The Work
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-ink/40 font-light text-base md:text-lg tracking-wide max-w-2xl"
        >
          A collection of brand, real estate, event, and social content — each built around the client's vision.
        </motion.p>
      </header>

      {/* Filter Strip */}
      <div className="flex flex-wrap gap-3 mb-24 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((cat, idx) => (
          <motion.button
            key={cat}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + idx * 0.05 }}
            onClick={() => setFilter(cat)}
            className={`
              px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-300 glass border-ink/5 whitespace-nowrap
              ${filter === cat 
                ? 'border-periwinkle/40 bg-white/70 text-ink shadow-[0_0_20px_rgba(122,160,255,0.15)] ring-1 ring-periwinkle/10' 
                : 'text-ink/40 hover:text-ink/60 hover:bg-white/40'}
            `}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {projectGridItems.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-[10px] sm:gap-[12px] md:gap-[16px]"
          >
            {projectGridItems.map(({ project, layout, template }, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`
                  group relative rounded-[2.5rem] overflow-hidden glass border-ink/5 cursor-pointer
                  col-span-1 ${layout.t} ${layout.d} ${layout.m}
                  transition-all duration-300 hover:z-10
                `}
                onClick={() => setSelectedProject(project)}
                data-category={project.category}
                data-index={idx}
              >
                {/* Thumbnail Image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={project.thumbnail} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Bottom glass gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Play Hover UI */}
                <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                    <Play className="w-5 h-5 md:w-6 md:h-6 text-white ml-1 fill-white" />
                  </div>
                </div>

                {/* Info Overlay */}
                <div className={`absolute bottom-0 left-0 right-0 ${template === 'E' ? 'p-12 md:p-14' : 'p-8 md:p-10'} z-20 flex flex-col items-start gap-4`}>
                  <div className="px-3 py-1 rounded-full glass border-white/20 text-[9px] font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                    {project.category}
                  </div>
                  <h3 className={`font-medium text-white tracking-tight leading-tight transition-transform duration-300 group-hover:translate-x-1 ${template === 'E' ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
                    {project.title}
                  </h3>
                </div>

                {/* Periwinkle Lift Shadow */}
                <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_40px_rgba(122,160,255,0.2)] pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-40 text-center flex flex-col items-center gap-4"
          >
            <Sparkles className="w-8 h-8 text-periwinkle/30" />
            <span className="text-spaced opacity-30 text-sm">More coming soon.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <ProjectLightbox 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </motion.div>
  );
};

const Contact: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 pt-40 pb-40 flex justify-center"
    >
      <GlassCard className="max-w-2xl w-full p-12 space-y-12">
        <SectionTitle title="Let's build." subtitle="Contact" />
        
        {/* Success Message */}
        <div data-fs-success className="hidden glass p-12 rounded-[2rem] text-center space-y-4 animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-periwinkle/10 flex items-center justify-center text-periwinkle">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-2xl font-medium text-ink">Message received.</h3>
          <p className="text-ink/60 text-sm">I'll be in touch within 24–48 hours.</p>
          <a href="/" onClick={(e) => { e.preventDefault(); window.location.reload(); }} className="inline-block text-periwinkle text-sm font-medium hover:gap-2 transition-all">
            Back to home →
          </a>
        </div>

        {/* Error Message */}
        <div data-fs-error className="hidden glass p-6 rounded-xl border-red-500/30 text-center mb-6">
          <p className="text-sm text-red-500/80">
            Something went wrong. Please try again or email me directly at isaac@maasmedia.org.
          </p>
        </div>

        <form id="contact-form" className="space-y-6">
          <input type="hidden" name="_subject" value="New inquiry — Maas Media" />
          <input type="hidden" name="_captcha" value="true" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-spaced opacity-60">Name</label>
              <input 
                type="text" 
                name="name"
                data-fs-field
                required
                className="w-full bg-base/50 border border-ink/5 rounded-xl px-4 py-3 outline-none focus:border-periwinkle/30 transition-all font-light" 
                placeholder="John Doe" 
              />
              <span data-fs-error="name" className="fs-error-message"></span>
            </div>
            <div className="space-y-2">
              <label className="text-spaced opacity-60">Email</label>
              <input 
                type="email" 
                name="email"
                data-fs-field
                required
                className="w-full bg-base/50 border border-ink/5 rounded-xl px-4 py-3 outline-none focus:border-periwinkle/30 transition-all font-light" 
                placeholder="john@example.com" 
              />
              <span data-fs-error="email" className="fs-error-message"></span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-spaced opacity-60">Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              data-fs-field
              required
              className="w-full bg-base/50 border border-ink/5 rounded-xl px-4 py-3 outline-none focus:border-periwinkle/30 transition-all font-light" 
              placeholder="(555) 555-5555" 
            />
            <span data-fs-error="phone" className="fs-error-message"></span>
          </div>
          <div className="space-y-2">
            <label className="text-spaced opacity-60">Project Type</label>
            <select 
              name="project_type"
              data-fs-field
              required
              className="w-full bg-base/50 border border-ink/5 rounded-xl px-4 py-3 outline-none focus:border-periwinkle/30 transition-all font-light"
            >
              <option value="">Select a project type</option>
              <option value="Brand & Commercial">Brand & Commercial</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Event">Event</option>
              <option value="Social Media">Social Media</option>
              <option value="Other">Other</option>
            </select>
            <span data-fs-error="project_type" className="fs-error-message"></span>
          </div>
          <div className="space-y-2">
            <label className="text-spaced opacity-60">Message</label>
            <textarea 
              name="message"
              data-fs-field
              required
              rows={4} 
              className="w-full bg-base/50 border border-ink/5 rounded-xl px-4 py-3 outline-none focus:border-periwinkle/30 transition-all font-light" 
              placeholder="Tell me about your vision..." 
            />
            <span data-fs-error="message" className="fs-error-message"></span>
          </div>
          <button 
            type="submit"
            data-fs-submit-btn
            className="w-full py-4 bg-periwinkle text-white rounded-xl font-medium hover:bg-periwinkle/90 transition-all shadow-xl shadow-periwinkle/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Send it over
          </button>
        </form>
      </GlassCard>
    </motion.div>
  );
};

const BlogPostDetail: React.FC<{ slug: string; onBack: () => void; onNavigate: (tab: string) => void; onPostClick: (slug: string) => void }> = ({ slug, onBack, onNavigate, onPostClick }) => {
  const post = BLOG_POSTS.find(p => p.slug === slug);
  const relatedPosts = BLOG_POSTS.filter(p => p.slug !== slug).sort(() => 0.5 - Math.random()).slice(0, 3);

  if (!post) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-40 pb-40"
    >
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-8 flex items-center gap-2 text-sm text-ink/40">
          <button onClick={onBack} className="hover:text-periwinkle transition-colors">Blog</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-ink/60 truncate">{post.title}</span>
        </div>

        {/* Post Hero */}
        <div className="w-full h-[320px] md:h-[520px] rounded-[2.5rem] overflow-hidden relative mb-12 shadow-2xl">
          {post.youtubeUrl ? (
            <div className="w-full h-full bg-black">
              <iframe
                src={post.youtubeUrl}
                className="w-full h-full border-none"
                allow="autoplay; fullscreen"
                title={post.title}
              />
            </div>
          ) : (
            <img 
              src={post.thumbnail} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          )}
          {/* Hero Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-8 md:p-12">
            <div className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-[10px] uppercase tracking-widest text-white w-fit mb-4">
              {post.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-light text-white leading-tight max-w-4xl tracking-tight">
              {post.title}
            </h1>
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="border-y border-ink/5 py-6 mb-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-sm text-ink/50">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>5 min read</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-ink/10" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-4 text-ink/40">
            <button className="hover:text-periwinkle transition-colors"><Twitter className="w-5 h-5" /></button>
            <button className="hover:text-periwinkle transition-colors"><LinkIcon className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Post Body */}
        <div className="max-w-[720px] mx-auto space-y-10">
          <p className="text-lg leading-relaxed text-ink/80">
            Mastering drone cinematography starts with understanding the hardware, but it truly excels when you master the interplay between natural light and camera movement. 
            In this guide, we explore the essential techniques for capturing smooth, cinematic shots that elevate your property and commercial productions.
          </p>

          <h2 className="text-2xl md:text-3xl font-medium text-ink pt-4">Geometry of the Landscape</h2>
          <p className="text-ink/70 leading-relaxed">
            When you're hundreds of feet in the air, the world becomes a canvas of geometric shapes. Real estate cinematography relies on these lines to guide the viewer's eye toward the focal point—the property itself. Leading lines, symmetry, and the rule of thirds remain just as vital in the sky as they do on the ground.
          </p>

          <div className="relative group">
            <div className="pl-6 border-l-2 border-periwinkle">
              <p className="text-xl md:text-2xl font-light text-periwinkle italic leading-relaxed">
                "The most impactful aerial shots aren't those that show everything at once, but those that reveal the story of the space through deliberate motion."
              </p>
            </div>
          </div>

          <p className="text-ink/70 leading-relaxed">
            Slow, controlled movements are the hallmark of high-end drone work. Avoid erratic turns or sudden changes in speed. Instead, aim for long, sweeping orbits or steady "push-ins" that mimic dolly shots used on major film sets. This consistency builds a sense of luxury and professionalism.
          </p>

          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1200" 
              alt="Mid-post visual" 
              className="w-full h-auto"
            />
            <p className="text-sm text-ink/40 mt-3 italic text-center">Finding the perfect golden hour light for an estate shoot.</p>
          </div>

          <h2 className="text-2xl md:text-3xl font-medium text-ink pt-4">The Importance of Light</h2>
          <p className="text-ink/70 leading-relaxed">
             Golden hour is not just a suggestion; it's a requirement for world-class drone visuals. The long shadows and warm hues provide depth that midday sun simply cannot replicate. 
             By flying during the last hour of daylight, you capture textures on rooflines and landscaping that help potential buyers feel the warmth of a home before they ever step inside.
          </p>

          {/* Optional Video Embed */}
          <div className="pt-8 space-y-4">
             <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-ink/40">Watch the video.</span>
             <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-xl">
               <iframe
                 src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                 className="w-full h-full border-none"
                 allow="autoplay; fullscreen"
               />
             </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-24">
          <GlassCard className="p-12 md:p-16 text-center space-y-8 bg-periwinkle/[0.03]">
             <h2 className="text-3xl md:text-4xl font-light tracking-tight text-ink">
               Enjoyed this? Let's create something together.
             </h2>
             <a 
               href="/contact"
               onClick={(e) => {
                 e.preventDefault();
                 onNavigate('Contact');
               }}
               className="inline-block px-10 py-4 bg-periwinkle text-white rounded-full font-medium hover:bg-periwinkle/90 transition-all shadow-xl shadow-periwinkle/20"
             >
               Get in Touch
             </a>
          </GlassCard>
        </div>

        {/* Related Posts */}
        <div className="mt-24 space-y-12">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-ink/40 text-center block">More from the blog.</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map(p => (
              <a 
                key={p.id}
                href={`/blog/${p.slug}.html`}
                onClick={(e) => {
                  e.preventDefault();
                  onPostClick(p.slug);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer block h-full"
              >
                <GlassCard className="overflow-hidden p-0 flex flex-col h-full border-ink/5 hover:shadow-[0_0_40px_rgba(122,160,255,0.15)] transition-shadow">
                  <div className="h-48 w-full overflow-hidden rounded-[1.5rem] m-2">
                    <img 
                      src={p.thumbnail} 
                      alt={p.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-[1.5rem]" 
                    />
                  </div>
                  <div className="p-6 pt-2 space-y-3 flex-1 flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-periwinkle font-medium">{p.category}</span>
                    <h3 className="text-lg leading-snug font-medium text-ink group-hover:text-periwinkle transition-colors">{p.title}</h3>
                    <span className="text-[10px] text-ink/30 mt-auto">{p.date}</span>
                  </div>
                </GlassCard>
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Blog: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [filter, setFilter] = useState('All');
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null);

  const categories = ['All', 'Tips', 'Atlanta', 'Behind the Lens', 'Industry'];

  const filtered = BLOG_POSTS.filter(post => 
    filter === 'All' ? true : post.category === filter
  );

  const featuredPost = filtered.find(p => p.featured) || filtered[0];
  const standardPosts = filtered.filter(p => p.id !== featuredPost?.id);

  if (selectedPostSlug) {
    return (
      <BlogPostDetail 
        slug={selectedPostSlug} 
        onBack={() => setSelectedPostSlug(null)} 
        onNavigate={onNavigate}
        onPostClick={setSelectedPostSlug}
      />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-40"
    >
      {/* Hero Video Strip */}
      <div className="w-full h-[480px] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <iframe
            src="https://player.vimeo.com/video/1188089564?autoplay=1&muted=1&loop=1&background=1&controls=0"
            className="w-[100vw] h-[56.25vw] min-h-full min-w-[177.77vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-none"
            allow="autoplay; fullscreen"
          />
          <div className="absolute inset-0 bg-black/45 z-10" />
        </div>
        
        {/* Particle Overlay (re-using the system if possible, or just a wrapper) */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* We'll assume ParticleBackground is global or already present in layout */}
        </div>

        <div className="relative z-30 text-center space-y-4 px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-light text-white tracking-tight"
          >
            Behind the Lens
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg md:text-xl font-light"
          >
            Thoughts, tips and stories from the field.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-20 space-y-20">
        {/* Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat, idx) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setFilter(cat)}
              className={`
                px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-300 glass border-ink/5 whitespace-nowrap
                ${filter === cat 
                  ? 'border-periwinkle/40 bg-white/70 text-ink shadow-[0_0_20px_rgba(122,160,255,0.15)] ring-1 ring-periwinkle/10' 
                  : 'text-ink/40 hover:text-ink/60 hover:bg-white/40'}
              `}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <div className="space-y-16">
              {/* Featured Post Card */}
              {featuredPost && (
                <motion.div
                  key={featuredPost.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  onClick={() => setSelectedPostSlug(featuredPost.slug)}
                  className="group relative w-full h-[400px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl"
                >
                  <img 
                    src={featuredPost.thumbnail} 
                    alt={featuredPost.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:bg-black/60" />
                  
                  <div className="absolute top-8 left-8">
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-[9px] font-medium uppercase tracking-widest text-white">
                      {featuredPost.category}
                    </div>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8 space-y-4 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-white/60 text-sm line-clamp-2 max-w-xl font-light">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest">{featuredPost.date}</span>
                      <span className="text-periwinkle text-xs font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                        Read more <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {/* Lift Shadow */}
                  <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_40px_rgba(122,160,255,0.3)] pointer-events-none" />
                </motion.div>
              )}

              {/* Standard Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {standardPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => setSelectedPostSlug(post.slug)}
                    className="group flex flex-col md:flex-row items-stretch glass border-ink/5 rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-300 min-h-[180px] hover:shadow-[0_0_40px_rgba(122,160,255,0.1)]"
                  >
                    <div className="w-full md:w-[180px] h-[180px] md:h-auto overflow-hidden">
                      <img 
                        src={post.thumbnail} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 p-8 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase tracking-widest text-periwinkle font-medium">{post.category}</span>
                        </div>
                        <h3 className="text-lg font-medium text-ink group-hover:text-periwinkle transition-colors leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-ink/40 text-[13px] line-clamp-2 font-light">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[10px] text-ink/30 uppercase tracking-widest">{post.date}</span>
                        <span className="text-periwinkle text-[11px] font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read more <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-40 text-center flex flex-col items-center gap-4"
            >
              <Sparkles className="w-8 h-8 text-periwinkle/30" />
              <span className="text-spaced opacity-30 text-sm">Posts coming soon.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');

  // Stagger effect for initial load
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'Home' && <Home key="home" onNavigate={setActiveTab} />}
          {activeTab === 'Work' && <Portfolio key="portfolio" />}
          {activeTab === 'Blog' && <Blog key="blog" onNavigate={setActiveTab} />}
          {activeTab === 'Contact' && <Contact key="contact" />}

        </AnimatePresence>
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <footer className="relative z-10 py-20 border-t border-ink/5 bg-white/30 backdrop-blur-md">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-xl font-light tracking-widest text-ink uppercase">Maas Media</span>
            <span className="text-xs text-ink/40 tracking-[0.3em] uppercase">Atlanta | Worldwide</span>
          </div>
          <div className="flex gap-8">
            {['Instagram', 'Vimeo', 'LinkedIn'].map(link => (
              <a key={link} href="#" className="text-spaced hover:text-periwinkle transition-colors">{link}</a>
            ))}
          </div>
          <div className="text-xs text-ink/30 tracking-widest">
            © 2026 Maas Media. Visuals built for you.
          </div>
        </div>
      </footer>
    </div>
  );
}

