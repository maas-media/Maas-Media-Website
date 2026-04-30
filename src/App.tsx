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
import { PROJECTS, POSTS, TESTIMONIALS, Project } from './mockData';
import { Camera, Mail, ArrowRight, Play, ExternalLink, Hexagon, Home as House, Star, Calendar, Smartphone, MapPin, Clock, GraduationCap, Sparkles, MousePointer2, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

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
                onNavigate('Portfolio');
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

const Home: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { scrollYProgress } = useScroll();
  const videoOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.2]);
  
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
      <section className="h-screen flex flex-col justify-center items-center relative overflow-hidden">
        <motion.div 
          style={{ opacity: videoOpacity, scale: videoScale }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <iframe 
            src="https://player.vimeo.com/video/1188089564?autoplay=1&muted=1&loop=1&background=1&controls=0"
            className="absolute top-1/2 left-1/2 w-[177.77vh] min-w-full h-screen min-h-[56.25vw] -translate-x-1/2 -translate-y-1/2 pointer-events-none border-none"
            allow="autoplay; fullscreen"
            title="Hero Background Video"
          />
        </motion.div>

        <ParticleBackground 
          className="absolute inset-0 z-5 pointer-events-none"
          particleColor="rgba(255, 255, 255, 0.6)"
          lineColor="rgba(255, 255, 255, 0.2)"
        />

        <div className="z-10 px-4 w-full flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[480px] p-8 md:px-10 md:py-8 rounded-[1.5rem] bg-white/10 backdrop-blur-[32px] border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] text-center"
          >
            <div className="flex flex-col items-center gap-6">
              <Logo />
              <div className="space-y-4">
                <motion.h1 
                  className="text-4xl md:text-6xl font-light tracking-tighter leading-[0.9] text-ink"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  Visuals built <br /> <span className="text-periwinkle italic">for you.</span>
                </motion.h1>
                <motion.p 
                  className="text-ink/60 text-sm md:text-base font-light max-w-sm mx-auto"
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
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-spaced opacity-30">Explore the field</span>
          <div className="w-px h-12 bg-gradient-to-b from-periwinkle/40 to-transparent" />
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
                src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200"
                className="w-full h-full object-cover grayscale"
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

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === filter);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 pt-40 pb-40 space-y-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <SectionTitle title="Our Portfolio" subtitle="Visual Works" />
        <div className="flex flex-wrap gap-2 mb-12">
          {['All', 'Brand', 'Real Estate', 'Events', 'Social Media'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full text-xs transition-all ${filter === f ? 'bg-periwinkle text-white' : 'glass hover:bg-white/80'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]"
        >
          {filtered.map((project) => (
            <GlassCard 
              key={project.id}
              layout
              className={`
                group p-0 relative h-full overflow-hidden
                ${project.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
                ${project.size === 'wide' ? 'md:col-span-2' : ''}
                ${project.size === 'tall' ? 'md:row-span-2' : ''}
              `}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={project.thumbnail} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                <span className="text-spaced text-white/60 mb-2">{project.category}</span>
                <h3 className="text-2xl text-white font-light">{project.title}</h3>
                <Play className="w-8 h-8 text-periwinkle mt-4" />
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </AnimatePresence>
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
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-spaced opacity-60">Name</label>
              <input type="text" className="w-full bg-base/50 border border-ink/5 rounded-xl px-4 py-3 outline-none focus:border-periwinkle/30 transition-all font-light" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-spaced opacity-60">Email</label>
              <input type="email" className="w-full bg-base/50 border border-ink/5 rounded-xl px-4 py-3 outline-none focus:border-periwinkle/30 transition-all font-light" placeholder="john@example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-spaced opacity-60">Project Type</label>
            <select className="w-full bg-base/50 border border-ink/5 rounded-xl px-4 py-3 outline-none focus:border-periwinkle/30 transition-all font-light">
              <option>Brand / Commercial</option>
              <option>Real Estate</option>
              <option>Event</option>
              <option>Social Media</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-spaced opacity-60">Message</label>
            <textarea rows={4} className="w-full bg-base/50 border border-ink/5 rounded-xl px-4 py-3 outline-none focus:border-periwinkle/30 transition-all font-light" placeholder="Tell me about your vision..." />
          </div>
          <button className="w-full py-4 bg-periwinkle text-white rounded-xl font-medium hover:bg-periwinkle/90 transition-all shadow-xl shadow-periwinkle/20">
            Submit Vision
          </button>
        </form>
      </GlassCard>
    </motion.div>
  );
};

const Blog: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 pt-40 pb-40"
    >
      <SectionTitle title="Journal" subtitle="Insights" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px]">
        {POSTS.map((post, idx) => (
          <GlassCard 
            key={post.id}
            className={`
              flex flex-col justify-between gap-4 p-10 group
              ${idx === 0 ? 'md:col-span-2' : ''}
            `}
          >
            <div className="space-y-2">
              <span className="text-spaced opacity-40">{post.date}</span>
              <h3 className="text-3xl font-light text-ink group-hover:text-periwinkle transition-colors leading-tight">
                {post.title}
              </h3>
              <p className="text-ink/50 font-light line-clamp-2">{post.excerpt}</p>
            </div>
            <button className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-ink group-hover:gap-4 transition-all">
              Read Post <ArrowRight className="w-4 h-4" />
            </button>
          </GlassCard>
        ))}
        {/* Placeholder for visual interest */}
        <GlassCard className="bg-periwinkle/5 border-dashed border-periwinkle/20 flex items-center justify-center text-center p-8">
           <span className="text-spaced opacity-30">More posts <br /> in production</span>
        </GlassCard>
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
          {activeTab === 'Portfolio' && <Portfolio key="portfolio" />}
          {activeTab === 'Blog' && <Blog key="blog" />}
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

