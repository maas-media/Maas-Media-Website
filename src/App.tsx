/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useAnimationFrame, animate, useInView } from 'motion/react';
import { ParticleBackground } from './components/ParticleBackground';
import { Navigation } from './components/Navigation';
import { GlassCard } from './components/GlassCard';
import { Project, Post } from './mockData';
import { getProjects, getPosts, getClients, getSiteSettings } from './sanityClient';
import { Camera, Mail, ArrowRight, Play, ExternalLink, Hexagon, Home as House, Star, Calendar, Smartphone, MapPin, Clock, GraduationCap, Sparkles, MousePointer2, ChevronLeft, ChevronRight, Quote, ChevronDown, X, Twitter, Maximize2, Link as LinkIcon, Instagram, Youtube, Linkedin, PenLine, Video, AudioLines, Pause, Layers, Info } from 'lucide-react';
import headshotImg from './assets/maas-headshot.jpg';
import { useForm, ValidationError } from '@formspree/react';

// --- Components ---

const ServiceRow: React.FC<{ 
  service: any; 
  index: number; 
  active: boolean;
  setActive: (active: boolean) => void;
  onNavigate: (tab: string) => void;
  onNavigateWithFilter: (tab: string, filter: string) => void;
}> = ({ service, index, active, setActive, onNavigate, onNavigateWithFilter }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isTouchRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTouch = () => {
      isTouchRef.current = true;
    };
    window.addEventListener('touchstart', handleTouch, { once: true });
    return () => window.removeEventListener('touchstart', handleTouch);
  }, []);

   useEffect(() => {
    if (active && isTouchRef.current && containerRef.current) {
      setTimeout(() => {
        const navbar = 80;
        const top = containerRef.current!.getBoundingClientRect().top + window.scrollY - navbar;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 450);
    }
  }, [active]);

  useEffect(() => {
    if (!active) setIsLoaded(false);
  }, [active]);

  return (
    <motion.div 
      ref={containerRef}
      className={`border-b border-ink/10 relative cursor-pointer px-4 transition-colors duration-500 ${active ? 'bg-ink/[0.02]' : 'bg-transparent'}`}
      onMouseEnter={() => !isTouchRef.current && setActive(true)}
      onMouseLeave={() => !isTouchRef.current && setActive(false)}
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
                onNavigateWithFilter('Work', service.filterCategory);
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
            className="w-full md:w-[45%] lg:w-[40%] max-w-md aspect-video rounded-2xl overflow-hidden glass border-periwinkle/10 relative bg-[#0f0f19]/80"
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
                  src={`https://player.vimeo.com/video/${service.vimeoId}?autoplay=1&muted=1&loop=1&background=1&controls=0`}
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

const ClientLogos: React.FC<{ clients: { id: string; name: string; logoUrl: string }[] }> = ({ clients }) => {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef<number>(0);
  const xRef = React.useRef(0);

  const [flippedSlots, setFlippedSlots] = useState([false, false, false, false, false, false]);
  const slotSequence = [0, 4, 2, 3, 1, 5];
  const sequenceRef = useRef(0);

  useEffect(() => {
    if (clients.length < 2) return;
    const interval = setInterval(() => {
      const slotToFlip = slotSequence[sequenceRef.current % slotSequence.length];
      setFlippedSlots(prev => {
        const next = [...prev];
        next[slotToFlip] = !next[slotToFlip];
        return next;
      });
      sequenceRef.current += 1;
    }, 1000);
    return () => clearInterval(interval);
  }, [clients.length]);

  const slots = Array.from({ length: 6 }).map((_, i) => ({
    front: clients[i % clients.length],
    back: clients[(i + 6) % clients.length]
  }));

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const speed = 0.5;

    const animate = () => {
      xRef.current -= speed;
      const singleWidth = track.scrollWidth / 3;
      if (Math.abs(xRef.current) >= singleWidth) {
        xRef.current = 0;
      }
      track.style.transform = `translateX(${xRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [clients]);

  if (!clients || clients.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 24 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="md:py-4 pt-1 pb-2 px-4 relative"
    >
      <div className="text-spaced text-ink/30 text-center md:mb-8 mb-4">
        trusted by
      </div>

      {/* Mobile-only static grid */}
      <div className="md:hidden grid grid-cols-3 gap-3 px-2">
        {slots.map((slot, i) => (
          <div
            key={i}
            className="relative h-20"
            style={{ perspective: '600px' }}
          >
            <div
              className="relative w-full h-full transition-transform duration-700 ease-in-out"
              style={{
                transformStyle: 'preserve-3d',
                transform: flippedSlots[i] ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Front face */}
              <div
                className="absolute inset-0 rounded-2xl flex items-center justify-center p-3"
                style={{ backfaceVisibility: 'hidden', background: 'rgba(255,255,255,0.6)', border: '0.5px solid rgba(180,180,220,0.25)' }}
              >
                {slot.front?.logoUrl && (
                  <img
                    src={slot.front.logoUrl}
                    alt={slot.front.name}
                    className="h-8 w-auto object-contain max-w-full"
                  />
                )}
              </div>
              {/* Back face */}
              <div
                className="absolute inset-0 rounded-2xl flex items-center justify-center p-3"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'rgba(255,255,255,0.6)', border: '0.5px solid rgba(180,180,220,0.25)' }}
              >
                {slot.back?.logoUrl && (
                  <img
                    src={slot.back.logoUrl}
                    alt={slot.back.name}
                    className="h-8 w-auto object-contain max-w-full"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block relative w-full py-2">
        <div
          className="overflow-x-hidden overflow-y-visible"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)'
          }}
        >
          <div
            ref={trackRef}
            className="flex items-center gap-16 w-max py-6"
          >
            {[...clients, ...clients, ...clients].map((client, index) => {
              const keyId = `${client.id}-${index}`;
              return (
                <div
                  key={keyId}
                  className="relative flex items-center justify-center px-8 py-4 rounded-2xl transition-all duration-300 cursor-default"
                >
                  <img
                    src={client.logoUrl}
                    alt={client.name}
                    className="h-20 w-auto object-contain transition-all duration-500 hover:scale-110"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
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
  'DaVinci Resolve Expertise',
  'Eye-Catching Cinematography',
  'Pro Grade Audio',
  'Motion Graphics',
  'Adaptive Lighting Setups',
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
      }, 1200);
    } else if (isDeleting && displayText === '') {
      setIndex((prev) => (prev + 1) % SKILLS.length);
      setIsDeleting(false);
    } else if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
      }, 25);
    } else if (displayText === currentSkill) {
      setIsPausing(true);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(currentSkill.slice(0, displayText.length + 1));
      }, 60);
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
  size: 'medium' | 'large';
  initialPos: { x: number; y: number };
  vimeoUrl: string;
  delay?: number;
  floatConfig?: { xAmp: number; yAmp: number; xSpeed: number; ySpeed: number; xPhase: number; yPhase: number };
}> = ({ size, initialPos, vimeoUrl, delay = 0, floatConfig }) => {
  const fcRef = useRef(floatConfig ?? {
    xAmp: 8,
    yAmp: 10,
    xSpeed: 0.2,
    ySpeed: 0.15,
    xPhase: Math.random() * Math.PI * 2,
    yPhase: Math.random() * Math.PI * 2,
  });

  const floatX = useMotionValue(0);
  const floatY = useMotionValue(0);

  useAnimationFrame((time) => {
    const t = time / 1000;
    const fc = fcRef.current;
    floatX.set(Math.sin(t * fc.xSpeed * Math.PI * 2 + fc.xPhase) * fc.xAmp);
    floatY.set(Math.sin(t * fc.ySpeed * Math.PI * 2 + fc.yPhase) * fc.yAmp);
  });

  const [isHovered, setIsHovered] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const videoId = vimeoUrl.split('/').pop()?.split('?')[0] ?? '';
  const thumbnailUrl = `https://vumbnail.com/${videoId}.jpg`;

  // Width is a % of viewport width — scales with screen size
  // large = 22vw (min 200px, max 380px), medium = 16vw (min 160px, max 288px)
  const vwSize = size === 'large'
    ? 'clamp(200px, 22vw, 380px)'
    : 'clamp(160px, 16vw, 288px)';

  // Aspect ratio 16:9 so height = width * 9/16
  // We derive height from the same clamp logic
  const vhSize = size === 'large'
    ? 'clamp(112px, 12.375vw, 213px)'
    : 'clamp(90px, 9vw, 162px)';

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${initialPos.x}%`,
        top: `${initialPos.y}%`,
        width: vwSize,
        height: vhSize,
        translateX: '-50%',
        translateY: '-50%',
        x: floatX,
        y: floatY,
      }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl md:rounded-3xl overflow-hidden glass border-ink/10 shadow-2xl pointer-events-auto hidden md:block group hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setHasLoaded(false); }}
    >
      <div className="w-full h-full relative">
        {/* Thumbnail — always visible as background */}
        <div className="absolute inset-0">
          <img
            src={thumbnailUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <Play className="w-3 h-3 text-white fill-white ml-0.5" />
            </div>
            <span className="text-[9px] uppercase tracking-widest text-white/60 font-medium">hover to play</span>
          </div>
        </div>

        {/* Vimeo iframe — only mounted when hovered, fades in over thumbnail */}
        {isHovered && (
          <iframe
            src={`${vimeoUrl}?autoplay=1&muted=1&controls=0&loop=1&background=1`}
            className={`absolute inset-0 w-full h-full border-none scale-[1.3] transition-opacity duration-500 ${hasLoaded ? 'opacity-100' : 'opacity-0'}`}
            allow="autoplay"
            onLoad={() => setHasLoaded(true)}
          />
        )}
        <div className="absolute inset-0 bg-periwinkle/5 pointer-events-none" />
      </div>
    </motion.div>
  );
};

const MobileVideoCarousel: React.FC<{ vimeoUrls: string[] }> = ({ vimeoUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextIndex = (currentIndex + 1) % vimeoUrls.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % vimeoUrls.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [vimeoUrls.length]);

  return (
    <div className="md:hidden w-full px-4 pb-6">
      <div className="relative w-full rounded-[2rem] overflow-hidden aspect-video bg-ink/5">

        {/* Preload next video silently in background */}
        <div className="absolute inset-0 opacity-0 pointer-events-none">
          <iframe
            src={`${vimeoUrls[nextIndex]}?autoplay=1&muted=1&controls=0&loop=0&background=1`}
            className="absolute inset-0 w-full h-full border-none scale-[1.3]"
            allow="autoplay"
          />
        </div>

        {/* Current video with fade transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <iframe
              src={`${vimeoUrls[currentIndex]}?autoplay=1&muted=1&controls=0&loop=0&background=1`}
              className="absolute inset-0 w-full h-full border-none scale-[1.3]"
              allow="autoplay"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {vimeoUrls.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === currentIndex ? 'w-4 h-1.5 bg-periwinkle' : 'w-1.5 h-1.5 bg-ink/20'
            }`}
          />
        ))}
      </div>
    </div>
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
const ProcessTimeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = [
    {
      num: '01',
      title: 'Discovery',
      timecode: '00:01',
      desc: "We start with a conversation. I want to understand your brand, your audience, and what you're actually trying to accomplish so that every creative decision has a reason behind it.",
      activeColor: 'rgba(122,160,255,0.35)',
      activeBorder: 'rgba(122,160,255,0.8)',
      idleColor: 'rgba(122,160,255,0.08)',
      idleBorder: 'rgba(122,160,255,0.25)',
    },
    {
      num: '02',
      title: 'Production',
      timecode: '00:03',
      desc: "This is where it gets fun. From shot lists and location scouting to the shoot day itself, I run the full production process so you can stay focused on running your business.",
      activeColor: 'rgba(180,140,255,0.32)',
      activeBorder: 'rgba(180,140,255,0.8)',
      idleColor: 'rgba(180,140,255,0.07)',
      idleBorder: 'rgba(180,140,255,0.25)',
    },
    {
      num: '03',
      title: 'Delivery',
      timecode: '00:06',
      desc: "Color graded, edited, and built for your platform. You get a final product that's ready to publish and actually moves the needle for your brand.",
      activeColor: 'rgba(100,210,200,0.30)',
      activeBorder: 'rgba(100,210,200,0.8)',
      idleColor: 'rgba(100,210,200,0.07)',
      idleBorder: 'rgba(100,210,200,0.25)',
    }
  ];

  useEffect(() => {
    if (isPlaying) {
      playRef.current = setInterval(() => {
        setActiveStep(prev => (prev + 1) % steps.length);
      }, 6000);
    } else {
      if (playRef.current) clearInterval(playRef.current);
    }
    return () => { if (playRef.current) clearInterval(playRef.current); };
  }, [isPlaying]);

  const waveformBars = useMemo(() => Array.from({ length: 120 }).map((_, i) => {
    const seed = Math.sin(i * 0.8) * 0.5 + Math.sin(i * 0.3) * 0.3 + Math.sin(i * 1.7) * 0.2;
    const h = Math.max(2, Math.abs(seed) * 20 + 2);
    return { x: (i / 120) * 600, y: (24 - h) / 2, h };
  }), []);

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const stepIndex = Math.round(percentage * (steps.length - 1));
    const finalStep = Math.max(0, Math.min(steps.length - 1, stepIndex));
    setActiveStep(finalStep);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="container mx-auto px-4 py-12 max-w-[1180px] overflow-hidden"
    >
      <h2 className="text-base uppercase tracking-[0.3em] font-medium text-ink/30 mb-12">
        The Process
      </h2>

      {/* Mobile-only layout */}
      <div className="md:hidden flex flex-col gap-3">
        {/* Mini Scrubber */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] text-ink/30">
            {steps[activeStep].timecode}
          </span>
          <div 
            onClick={handleScrubberClick}
            className="flex-1 relative h-1 bg-ink/5 rounded-full cursor-pointer"
          >
            {/* Fill Bar */}
            <div 
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
              style={{ 
                backgroundColor: steps[activeStep].activeBorder,
                width: `${(activeStep / (steps.length - 1)) * 100}%` 
              }}
            />
            {/* Playhead */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-white transition-all duration-500"
              style={{ 
                backgroundColor: steps[activeStep].activeBorder,
                left: `${(activeStep / (steps.length - 1)) * 100}%` 
              }}
            />
            {/* Ticks */}
            {steps.map((step, index) => {
              const leftVal = index === 0 ? '0%' : index === 1 ? '50%' : '100%';
              return (
                <div
                  key={index}
                  className="absolute top-3 -translate-x-1/2 font-mono text-[8px] text-ink/20"
                  style={{ left: leftVal }}
                >
                  {step.timecode}
                </div>
              );
            })}
          </div>
          <span className="font-mono text-[10px] text-ink/20">
            00:06
          </span>
        </div>

        {/* Active Card with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass border-ink/5 rounded-2xl p-6 flex gap-5 items-start mb-4 h-[180px] overflow-hidden"
            style={{ borderLeft: `3px solid ${steps[activeStep].activeBorder}` }}
          >
            <div className="flex flex-col gap-2 flex-1">
              <span className="font-mono text-[10px] text-ink/30">{steps[activeStep].timecode}</span>
              <h3 className="text-base font-medium text-ink leading-tight">{steps[activeStep].title}</h3>
              <p className="text-sm font-light text-ink/50 leading-relaxed">{steps[activeStep].desc}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mobile Transport Controls */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <button
            onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
            className="w-10 h-10 rounded-full border border-ink/10 flex items-center justify-center text-ink/30 hover:border-periwinkle/40 hover:text-periwinkle transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              if (activeStep >= steps.length - 1) setActiveStep(0);
              setIsPlaying(p => !p);
            }}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
              isPlaying 
                ? 'border-periwinkle/40 bg-periwinkle/10 text-periwinkle' 
                : 'border-ink/10 text-ink/30 hover:border-periwinkle/40 hover:text-periwinkle'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
          <button
            onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
            className="w-10 h-10 rounded-full border border-ink/10 flex items-center justify-center text-ink/30 hover:border-periwinkle/40 hover:text-periwinkle transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop Timeline Layout */}
      <div className="hidden md:flex flex-col">
        {/* Main Panel */}
        <div 
          className="rounded-2xl overflow-hidden flex flex-col w-full border border-white/5 min-h-0"
          style={{ background: '#0f0f1a' }}
        >
          {/* Top Section */}
          <div className="grid grid-cols-2 border-b border-white/5 bg-white/10 items-stretch">
            {/* Left Cell: Source Monitor */}
            <div className="border-r border-white/5 flex flex-col h-full">
              {/* Header bar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.03]">
                <div className="flex items-center gap-1.5">
                  <Video className="w-3 h-3 text-white/30" />
                  <span className="text-[9px] uppercase tracking-widest text-white/30 font-medium ml-1.5 animate-pulse">
                    Source Monitor
                  </span>
                </div>
                <span className="font-mono text-[9px] text-white/20">
                  BTS_reel_v3.mp4
                </span>
              </div>

              {/* Video Area */}
              <div className="h-[320px] bg-[#080810] relative overflow-hidden flex-1">
                <iframe
                  src="https://player.vimeo.com/video/1189150076?autoplay=1&muted=1&controls=0&loop=1&background=1"
                  className="absolute inset-0 w-full h-full border-none scale-[1.3]"
                  allow="autoplay"
                />
                
                {/* Timecode overlay bottom-left */}
                <span className="absolute bottom-2 left-2 font-mono text-[9px] text-white/40 bg-black/50 px-1.5 py-0.5 rounded z-10">
                  {steps[activeStep].timecode}
                </span>

                {/* Safe area guide */}
                <div className="absolute inset-[8%] border border-white/5 pointer-events-none" />
              </div>

              {/* Transport bar */}
              <div className="flex items-center gap-2 px-4 py-2 border-t border-white/5 bg-white/[0.03]">
                {/* Skip Back */}
                <button
                  onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                  className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:border-periwinkle/40 hover:text-periwinkle transition-all"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>

                {/* Play/Pause */}
                <button
                  onClick={() => {
                    if (activeStep >= steps.length - 1) setActiveStep(0);
                    setIsPlaying(p => !p);
                  }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isPlaying 
                      ? 'bg-periwinkle/15 border border-periwinkle/30 text-periwinkle' 
                      : 'border border-white/10 text-white/30 hover:border-periwinkle/40 hover:text-periwinkle'
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3 fill-current" />
                  ) : (
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  )}
                </button>

                {/* Skip Forward */}
                <button
                  onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                  className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:border-periwinkle/40 hover:text-periwinkle transition-all"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>

                {/* Scrubber track */}
                <div 
                  onClick={handleScrubberClick}
                  className="flex-1 relative h-1 bg-white/10 rounded-full cursor-pointer border border-white/10"
                >
                  {/* Fill Bar */}
                  <div 
                    className="absolute left-0 top-0 h-full rounded-full bg-periwinkle/40 transition-all duration-500"
                    style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                  />
                  {/* Playhead */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-periwinkle border-2 border-white transition-all duration-500"
                    style={{ left: `${(activeStep / (steps.length - 1)) * 100}%` }}
                  />
                </div>

                {/* Duration */}
                <span className="font-mono text-[9px] text-white/20">
                  00:06
                </span>
              </div>
            </div>

            {/* Right Cell: Inspector */}
            <div className="flex flex-col bg-white/[0.04]">
              {/* Header bar */}
              <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/5 bg-white/[0.03]">
                <Info className="w-3 h-3 text-white/30" />
                <span className="text-[9px] uppercase tracking-widest text-white/30 font-medium">
                  Inspector
                </span>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                {/* Metadata Grid */}
                <div className="grid grid-cols-4 gap-1.5">
                  <div className="bg-white/5 border border-white/8 rounded-xl px-3 py-2">
                    <div className="text-[8px] text-white/30 mb-1">Codec</div>
                    <div className="font-mono text-[11px] text-white/70">H.264</div>
                  </div>
                  <div className="bg-white/5 border border-white/8 rounded-xl px-3 py-2">
                    <div className="text-[8px] text-white/30 mb-1">Resolution</div>
                    <div className="font-mono text-[11px] text-white/70">4K UHD</div>
                  </div>
                  <div className="bg-white/5 border border-white/8 rounded-xl px-3 py-2">
                    <div className="text-[8px] text-white/30 mb-1">Frame Rate</div>
                    <div className="font-mono text-[11px] text-white/70">23.976</div>
                  </div>
                  <div className="bg-white/5 border border-white/8 rounded-xl px-3 py-2">
                    <div className="text-[8px] text-white/30 mb-1">Duration</div>
                    <div className="font-mono text-[11px] text-white/70">00:06</div>
                  </div>
                </div>

                {/* Active Clip Card */}
                <div 
                  className="rounded-xl p-4 flex-1 relative overflow-hidden min-h-0"
                  style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${steps[activeStep].activeBorder}` }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none rounded-xl"
                    style={{ boxShadow: `inset 0 0 30px 0px ${steps[activeStep].activeColor}` }}
                  />
                  <span className="text-[9px] uppercase tracking-widest text-white/20 block font-medium relative z-10">
                    Active Clip
                  </span>
                  <div
                    className="w-8 h-px my-2 relative z-10"
                    style={{ background: steps[activeStep].activeBorder }}
                  />
                  
                  <div className="min-h-[24px] relative z-10">
                    <AnimatePresence mode="wait">
                      <motion.h4
                        key={activeStep}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-2xl font-medium text-white mb-2"
                      >
                        {steps[activeStep].title}
                      </motion.h4>
                    </AnimatePresence>
                  </div>
                  
                  <div className="h-[100px] relative z-10 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={activeStep}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm text-white/60 font-light leading-relaxed mt-1.5"
                      >
                        {steps[activeStep].desc}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Timeline */}
          <div className="border-t border-white/5 flex flex-col bg-white/[0.02]">
            {/* Timeline Header */}
            <div className="flex items-center gap-3 px-4 py-2 border-b border-white/5 bg-white/[0.03]">
              <Layers className="w-3 h-3 text-white/30" />
              <span className="text-[9px] uppercase tracking-widest text-white/30 font-medium">
                Timeline
              </span>
              <div className="flex-1" />
              <span className="font-mono text-xs text-white/50">
                {steps[activeStep].timecode}
              </span>
            </div>

            {/* V1 Track Row */}
            <div className="flex items-stretch border-b border-white/5">
              {/* Label cell */}
              <div className="w-10 shrink-0 flex items-center justify-center border-r border-white/5 bg-white/5">
                <span className="font-mono text-[9px] text-white/20 font-bold">V1</span>
              </div>

              {/* Clip area */}
              <div className="flex-1 relative h-[140px] p-1.5 bg-white/[0.02]">
                <div className="flex gap-1.5 h-full w-full">
                  {steps.map((step, index) => {
                    const isActive = activeStep === index;
                    return (
                      <div
                        key={index}
                        onClick={() => setActiveStep(index)}
                        style={isActive ? {
                          background: step.activeColor,
                          borderColor: step.activeBorder,
                          boxShadow: `0 0 0 1px ${step.activeBorder}, 0 0 20px 2px ${step.activeColor}`
                        } : {
                          backgroundColor: step.idleColor,
                          borderColor: step.idleBorder,
                        }}
                        className={`relative rounded-lg cursor-pointer overflow-hidden border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between p-2.5 ${
                          isActive ? 'flex-[3]' : 'flex-[1]'
                        }`}
                      >
                        {index === activeStep && (
                          <motion.div
                            className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-periwinkle"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        )}
                        <div>
                          <div className="font-mono text-[9px] text-white/30 leading-none">
                            {step.timecode}
                          </div>
                          <h4 
                            className={`text-xs font-medium text-white mt-0.5 leading-tight ${
                              !isActive ? 'truncate' : ''
                            }`}
                          >
                            {step.title}
                          </h4>
                        </div>
                        <div className="font-mono text-[9px] text-white/20 leading-none">
                          {step.num}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* A1 Track Row */}
            <div className="flex items-stretch border-b border-white/5 min-h-[40px]">
              {/* Label cell */}
              <div className="w-10 shrink-0 flex items-center justify-center border-r border-white/5 bg-white/5">
                <span className="font-mono text-[9px] text-white/20 font-bold">A1</span>
              </div>

              {/* Waveform area */}
              <div className="flex-1 p-1.5 bg-white/[0.02]">
                <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
                  <svg width="100%" height="20" viewBox="0 0 600 24" preserveAspectRatio="none" className="opacity-25 w-full h-full">
                    {waveformBars.map((bar, i) => (
                      <rect key={i} x={bar.x} y={bar.y} width={3} height={bar.h} rx={1} fill="rgba(255,255,255,0.8)" />
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


const Home: React.FC<{ 
  onNavigate: (tab: string) => void; 
  onNavigateWithFilter: (tab: string, filter: string) => void;
  clients: any[]; 
  siteSettings: any;
}> = ({ onNavigate, onNavigateWithFilter, clients, siteSettings }) => {
  const [heroVideoSrc, setHeroVideoSrc] = useState('');
  useEffect(() => {
    setHeroVideoSrc('https://player.vimeo.com/video/1196786877?autoplay=1&muted=1&controls=0&loop=1&background=1&playsinline=1');
  }, []);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const ctaRef = React.useRef(null);
  const ctaInView = useInView(ctaRef, { once: false, margin: '-10% 0px' });
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const [demoReelPlaying, setDemoReelPlaying] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
  const services = [
  { 
    id: 'brand', 
    title: 'Brand & Commercial', 
    filterCategory: 'Brand & Commercial',
    desc: 'Premium brand narratives that drive impact and define your identity through purposeful storytelling.', 
    icon: Play,
    vimeoId: '1193350137'
  },
  { 
    id: 'real-estate', 
    title: 'Real Estate', 
    filterCategory: 'Real Estate',
    desc: 'Cinematic property tours highlighting architectural detail and neighborhood energy for high-end listings.', 
    icon: House,
    vimeoId: '1193350140'
  },
  { 
    id: 'events', 
    title: 'Events', 
    filterCategory: 'Events',
    desc: 'Energetic recaps captured with cinematic energy and emotional resonance that preserves every moment.', 
    icon: Calendar,
    vimeoId: '1193350138'
  },
  { 
    id: 'social', 
    title: 'Social Content', 
    filterCategory: 'Social Content',
    desc: 'Short-form visuals optimized for high-engagement, dynamic pacing, and platform-specific impact.', 
    icon: Smartphone,
    vimeoId: '1193350139'
  }
];

  return (
    <div className="pb-4 md:pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[100dvh] max-h-[100dvh] md:h-screen md:max-h-none flex flex-col justify-center items-center bg-base">
        {/* Mobile fullscreen background video */}
        <div className="md:hidden absolute inset-0 z-0 bg-ink">
          <iframe
            src={heroVideoSrc}
            className="absolute inset-0 w-full h-full border-none scale-[1.5]"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            playsInline
            title="Hero background"
          />
          {/* Darkening overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/30 to-ink/70" />
        </div>

        {/* Desktop Floating Frames — 8 players */}

                <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-[500] pointer-events-none"
        >
          {/* Top left */}
<FloatingVideoFrame
  size="large"
  initialPos={{ x: 18, y: 22 }}
  vimeoUrl="https://player.vimeo.com/video/1189169837"
  delay={0.1}
  floatConfig={{ xAmp: 4, yAmp: 5, xSpeed: 0.18, ySpeed: 0.14, xPhase: 0, yPhase: 1.1 }}
/>
{/* Middle left */}
<FloatingVideoFrame
  size="medium"
  initialPos={{ x: 13, y: 52 }}
  vimeoUrl="https://player.vimeo.com/video/1189169866"
  delay={0.4}
  floatConfig={{ xAmp: 4, yAmp: 5, xSpeed: 0.16, ySpeed: 0.21, xPhase: 3.8, yPhase: 2.4 }}
/>
{/* Bottom left */}
<FloatingVideoFrame
  size="large"
  initialPos={{ x: 18, y: 80 }}
  vimeoUrl="https://player.vimeo.com/video/1189169854"
  delay={1.0}
  floatConfig={{ xAmp: 4, yAmp: 4, xSpeed: 0.24, ySpeed: 0.18, xPhase: 4.4, yPhase: 1.7 }}
/>
{/* Top right */}
<FloatingVideoFrame
  size="medium"
  initialPos={{ x: 82, y: 22 }}
  vimeoUrl="https://player.vimeo.com/video/1193350137"
  delay={0.25}
  floatConfig={{ xAmp: 4, yAmp: 5, xSpeed: 0.22, ySpeed: 0.17, xPhase: 2.1, yPhase: 0.5 }}
/>
{/* Middle right */}
<FloatingVideoFrame
  size="medium"
  initialPos={{ x: 87, y: 52 }}
  vimeoUrl="https://player.vimeo.com/video/1189169885"
  delay={0.55}
  floatConfig={{ xAmp: 4, yAmp: 5, xSpeed: 0.26, ySpeed: 0.19, xPhase: 1.5, yPhase: 4.1 }}
/>
{/* Bottom right */}
<FloatingVideoFrame
  size="large"
  initialPos={{ x: 82, y: 80 }}
  vimeoUrl="https://player.vimeo.com/video/1189169904"
  delay={0.7}
  floatConfig={{ xAmp: 4, yAmp: 4, xSpeed: 0.21, ySpeed: 0.16, xPhase: 5.0, yPhase: 0.9 }}
/>
{/* Top center */}
<FloatingVideoFrame
  size="medium"
  initialPos={{ x: 50, y: 18 }}
  vimeoUrl="https://player.vimeo.com/video/1193350138"
  delay={0.85}
  floatConfig={{ xAmp: 4, yAmp: 3, xSpeed: 0.19, ySpeed: 0.23, xPhase: 2.7, yPhase: 3.3 }}
/>
{/* Bottom center */}
<FloatingVideoFrame
  size="medium"
  initialPos={{ x: 50, y: 78 }}
  vimeoUrl="https://player.vimeo.com/video/1193350139"
  delay={1.15}
  floatConfig={{ xAmp: 4, yAmp: 3, xSpeed: 0.17, ySpeed: 0.13, xPhase: 0.8, yPhase: 5.2 }}
/>
        </motion.div>

        <ParticleBackground 
          className="absolute inset-0 z-5 pointer-events-none hidden md:block"
          particleColor="rgba(122, 160, 255, 0.4)"
          lineColor="rgba(122, 160, 255, 0.1)"
        />

        <div className="z-10 w-full h-full flex flex-col items-center justify-center md:justify-center md:py-0 px-6 max-h-[100dvh] overflow-hidden md:max-h-none md:overflow-visible"
          style={{ paddingTop: '0', paddingBottom: '0' }}
        >
          <div className="flex flex-col items-center text-center px-6 py-6">
            <motion.h1
              className="text-4xl font-light tracking-tighter leading-[1.1] text-white md:text-ink md:text-7xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Stories worth <span className="text-[#9bb8ff] md:text-periwinkle italic">seeing.</span>
            </motion.h1>

            <motion.p
              className="mt-4 text-sm font-medium text-white/70 md:text-gray-500 max-w-xs md:text-lg md:max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              Impactful media for brands, real estate, and more.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 1 }}
              className="mt-6"
            >
              <button
                onClick={() => onNavigate('Work')}
                className="group relative px-10 py-4 rounded-full transition-all flex items-center justify-center overflow-hidden"
              >
                <span className="relative z-10 text-white/80 md:text-ink/70 hover:text-white md:hover:text-ink font-medium tracking-tight flex items-center gap-2 transition-colors">
                  Launch Portfolio
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </span>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-0 group-hover:w-[124px] h-px bg-white/40 md:bg-periwinkle/40 transition-all duration-300" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Mobile scroll indicator */}
        <motion.div
          className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/60">Explore the process</span>
          <ChevronDown className="w-5 h-5 text-white/60" strokeWidth={1.5} />
        </motion.div>

        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-ink/60">Explore the process</span>
          <ChevronDown className="w-5 h-5 text-periwinkle/60 text-periwinkle" strokeWidth={1.5} />
        </motion.div>
      </section>

      {/* Services Section: Hover-Reveal Layout */}
      <section className="container mx-auto px-4 border-t border-ink/5 pt-24 pb-8 mt-24">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-base uppercase tracking-[0.3em] font-medium text-ink/30 mb-12"
        >
          Services
        </motion.h2>
        

        <div className="flex flex-col">
          {services.map((service, idx) => (
            <ServiceRow 
              key={service.id} 
              service={service} 
              index={idx} 
              active={expandedIndex === idx}
              setActive={(active) => setExpandedIndex(active ? idx : null)}
              onNavigate={onNavigate}
              onNavigateWithFilter={onNavigateWithFilter}
            />
          ))}
        </div>
      </section>

      <div className="pb-0 md:pb-12 pt-0 mt-8">
        <ProcessTimeline />
      </div>


      {/* Selected Works */}
      <div className="mb-4 md:mb-12">
        <ClientLogos clients={clients} />
      </div>
      <section className="container mx-auto px-4 pt-6 md:pt-32 pb-4 md:pb-32 mt-8">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-base uppercase tracking-[0.3em] font-medium text-ink/30 mb-12"
        >
          About
        </motion.h2>
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          
          {/* Left Column (35-40%) */}
          <div className="w-full lg:w-[38%] flex flex-col gap-6">
            <div className="flex flex-row lg:flex-col gap-4 lg:gap-6">
              {/* Top Tile: Headshot */}
              <GlassCard className="p-0 overflow-hidden border-ink/5 flex-shrink-0 w-[40%] lg:w-full aspect-square lg:aspect-[3/4]">
                <motion.img 
                  initial={{ scale: 1.05, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  src={siteSettings?.headshot || headshotImg}
                  className="w-full h-full object-cover rounded-3xl"
                  alt="Isaac Maas"
                />
              </GlassCard>

              {/* Bottom Tile: Info Strip (Vertical List) - Stretched to fill gap */}
              <GlassCard className="p-6 lg:p-10 space-y-5 lg:space-y-10 border-ink/5 flex-grow">
                {[
                  { label: 'Location', val: siteSettings?.location || 'Atlanta, GA', icon: MapPin },
                  { label: 'Experience', val: siteSettings?.experience || '6+ Years', icon: Clock },
                  { label: 'Education', val: 'Taylor University', icon: GraduationCap }
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
          </div>

          {/* Right Column (60-65%) */}
          <div className="w-full lg:w-[62%] flex flex-col gap-6">
            {/* Top Tile: Bio */}
            <GlassCard className="p-12 space-y-8 border-ink/5 text-center lg:text-left flex-grow flex flex-col justify-center">
              <div className="space-y-6">
                <p className="text-base font-light text-ink/80 leading-relaxed max-w-2xl">
                  Hi, I'm Isaac! I'm a filmmaker and media specialist who believes great stories deserve to be told well. Whether it's a brand, business, team, or individual, I love using images to capture authentic moments and create content that connects with people. I've shot weddings, basketball games, real estate listings, orientation videos, and much more - always enjoying the process of piecing together visuals that supports every client's goals and leaves a real impact.
                </p>
              </div>
            </GlassCard>

            {/* Middle Tile: My Story Video */}
            <GlassCard className="p-12 space-y-6 border-ink/5 overflow-hidden flex-shrink-0">
              <div className="flex flex-col gap-6">
                <span className="text-[10px] uppercase tracking-widest text-ink/40 font-medium text-center lg:text-left">Demo Reel</span>
                <div className="aspect-video w-full rounded-2xl overflow-hidden relative border border-periwinkle/10 bg-[#0f0f19]">
                  {/* Thumbnail + play button — shown when not playing */}
                  {!demoReelPlaying && (
                    <div 
                      className="absolute inset-0 z-10 cursor-pointer group/demo"
                      onClick={() => setDemoReelPlaying(true)}
                    >
                      <img
                        src="https://vumbnail.com/1189150076.jpg"
                        alt="Demo Reel"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover/demo:scale-110 group-hover/demo:bg-periwinkle/40 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                          <Play className="w-6 h-6 text-white fill-white ml-1" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Vimeo iframe — always rendered but only visible when playing */}
                  <iframe
                    src={`https://player.vimeo.com/video/1189150076?autoplay=${demoReelPlaying ? 1 : 0}&controls=1`}
                    className={`absolute inset-0 w-full h-full border-none transition-opacity duration-300 ${demoReelPlaying ? 'opacity-100' : 'opacity-0'}`}
                    allow="autoplay; fullscreen"
                    title="Demo Reel"
                  />
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
          ref={ctaRef}
          whileHover="hover"
          initial="rest"
          animate={isMobile && ctaInView ? "hover" : "rest"}
          className={`relative p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left mt-8 rounded-3xl overflow-hidden cursor-default ${isMobile && ctaInView ? 'bg-periwinkle/10 border-periwinkle/30 shadow-[0_0_40px_rgba(122,160,255,0.15)]' : ''}`}
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
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const isLoaded = isIframeLoaded;
  const setIsLoaded = setIsIframeLoaded;
  const [isPlaying, setIsPlaying] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setIsPlaying(false);
    setIsLoaded(false);
  }, [project]);

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
        <>
          {/* Mobile Layout (md:hidden) — thumbnail-first experience */}
          <div className="md:hidden fixed inset-0 z-[100] flex flex-col bg-ink">
            <AnimatePresence mode="wait">
              {!isPlaying ? (
                /* Showcase View */
                <motion.div
                  key="showcase"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col flex-1 overflow-y-auto"
                >
                  {/* Top section — fullscreen thumbnail hero */}
                  <div 
                    onClick={() => setIsPlaying(true)}
                    className={`relative w-full cursor-pointer shrink-0 ${
                      project.orientation === 'vertical' ? 'aspect-[9/16] max-h-[55vh]' : 'aspect-video'
                    }`}
                  >
                    {project.thumbnail && (
                      <img 
                        src={project.thumbnail} 
                        alt="" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                    
                    {/* Centered play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                      </div>
                    </div>

                    {/* Floating close button top-right */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                      }}
                      className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Bottom section — project info */}
                  <div className="flex-1 px-6 pt-6 pb-10 flex flex-col gap-4 bg-ink">
                    <span className="inline-block px-3 py-1 rounded-full border border-white/10 text-[10px] uppercase tracking-widest text-white/50 w-fit">
                      {project.categories?.join(' / ')}
                    </span>
                    <h2 className="text-2xl font-medium text-white leading-tight">
                      {project.title}
                    </h2>
                    <p className="text-sm text-white/50 font-light leading-relaxed">
                      {project.description}
                    </p>

                    {/* Divider */}
                    <div className="border-t border-white/5 mt-2" />

                    {/* Buttons stacked */}
                    <div className="flex flex-col gap-3 mt-4">
                      {/* Primary — Play Video */}
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="w-full py-4 rounded-2xl bg-periwinkle text-white text-sm font-medium flex items-center justify-center gap-2 cursor-pointer transition-opacity active:opacity-80"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        Play Video
                      </button>

                      {/* Secondary — Watch on Vimeo */}
                      <button
                        onClick={() => window.open(project.vimeoUrl, '_blank')}
                        className="w-full py-4 rounded-2xl border border-white/10 text-white/50 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors active:bg-white/5"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Watch on Vimeo
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Player View */
                <motion.div
                  key="player"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black flex flex-col items-center justify-center"
                >
                  {/* Floating back button top-left */}
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Floating close button top-right */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Iframe container */}
                  <div className={`relative ${
                    project.orientation === 'vertical' ? 'h-full aspect-[9/16] max-w-full' : 'w-full aspect-video max-h-screen'
                  }`}>
                    <iframe
                      src={`${project.vimeoUrl}?autoplay=1&muted=0&loop=0&controls=1`}
                      className="absolute inset-0 w-full h-full border-none"
                      allow="autoplay; fullscreen"
                      title={project.title}
                      onLoad={() => setIsIframeLoaded(true)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Layout (hidden md:flex) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="hidden md:flex fixed inset-0 z-[100] bg-ink/60 backdrop-blur-xl items-center justify-center p-4 md:p-8 overflow-y-auto md:overflow-hidden"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[1200px] h-auto md:max-h-[90vh] bg-ink/90 backdrop-blur-2xl rounded-[2.5rem] border border-periwinkle/20 shadow-[0_0_80px_rgba(122,160,255,0.12)] md:overflow-hidden flex flex-col md:flex-row items-stretch mx-4 md:mx-0"
              onClick={e => e.stopPropagation()}
            >
              {/* Left Column (Video Player) */}
              <div
                ref={!isMobile ? videoContainerRef : null}
                className={`relative overflow-hidden bg-black flex items-center justify-center shrink-0 rounded-t-[2.5rem] md:rounded-l-[2.5rem] md:rounded-tr-none max-h-[50vh] md:max-h-none ${
                  project.orientation === 'vertical' ? 'w-auto mx-auto' : 'w-full md:w-[60%] aspect-video md:aspect-auto'
                }`}
                style={project.orientation === 'vertical' ? {
                  aspectRatio: '9/16',
                  height: 'calc(90vh - 48px)',
                  width: 'auto',
                } : {}}
              >
                {!isIframeLoaded && project.thumbnail && (
                  <img 
                    src={project.thumbnail} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover blur-sm scale-105 opacity-60 z-10 transition-opacity duration-300"
                  />
                )}
                <iframe
                  src={`${project.vimeoUrl}?autoplay=1&muted=0&loop=0&controls=1`}
                  className="absolute inset-0 w-full h-full border-none"
                  allow="autoplay; fullscreen"
                  title={project.title}
                  onLoad={() => setIsIframeLoaded(true)}
                />
              </div>

              {/* Right Column (Info Panel) */}
              <div className="relative w-full md:w-[40%] flex-1 flex flex-col bg-ink/95 p-10 md:p-12 rounded-b-[2.5rem] md:rounded-r-[2.5rem] md:rounded-bl-none overflow-y-auto max-h-[40vh] md:max-h-full">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 text-white/20 hover:text-white/60 transition-colors z-[110]"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col h-full justify-between gap-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full border border-white/10 text-[10px] uppercase tracking-widest text-white/50 w-fit">
                      {project.categories?.join(' / ')}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-medium text-white mt-4 leading-tight">
                      {project.title}
                    </h2>
                    <p className="text-sm text-white/50 font-light leading-relaxed mt-4">
                      {project.description}
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-8 md:mt-auto mt-6">
                    <button
                      onClick={() => videoContainerRef.current?.requestFullscreen()}
                      className="flex items-center gap-2 px-6 py-3 rounded-full border border-periwinkle/40 text-periwinkle text-sm font-medium hover:bg-periwinkle/10 transition-all cursor-pointer"
                    >
                      <Maximize2 className="w-4 h-4" />
                      Watch Full Screen
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Portfolio: React.FC<{ 
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (p: Project | null) => void;
  initialFilter?: string;
}> = ({ projects, selectedProject, setSelectedProject, initialFilter }) => {
  const [filter, setFilter] = useState(initialFilter || 'All');
  
  const categories = ['All', 'Brand & Commercial', 'Real Estate', 'Events', 'Social Content', 'Photography'];
  const filtered = filter === 'All' ? projects : projects.filter(p => p.categories?.includes(filter));

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    if (initialFilter) setFilter(initialFilter);
  }, [initialFilter]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 pt-40 pb-16 md:pb-40"
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
          A collection of brand, real estate, event, and social content.
        </motion.p>
      </header>

      {/* Filter Strip */}
      <div className="relative mb-24 -mx-4 md:mx-0">
        <div className="overflow-x-auto scrollbar-hide px-4">
          <div className="flex flex-nowrap md:flex-wrap items-center md:justify-center gap-3 p-4 overflow-visible">
            {categories.map((cat, idx) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                onClick={() => {
                  if (cat === 'Photography') {
                    window.open('https://isaacmaas.pixieset.com/', '_blank');
                  } else {
                    setFilter(cat);
                  }
                }}
                className={`
                  text-[10px] px-3 py-1.5 md:text-xs md:px-5 md:py-2 rounded-full uppercase tracking-[0.2em] font-medium transition-all duration-300 glass border-ink/5 whitespace-nowrap
                  ${filter === cat && cat !== 'Photography' 
                    ? 'border-periwinkle/40 bg-white/70 text-ink shadow-[0_0_20px_rgba(122,160,255,0.15)] ring-1 ring-periwinkle/10' 
                    : 'text-ink/40 hover:text-ink/60 hover:bg-white/40'}
                `}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-base to-transparent z-10 md:hidden" />
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {filtered.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[16px]"
          >
            {filtered.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`
                  group relative rounded-[2.5rem] overflow-hidden glass border-ink/5 cursor-pointer
                  transition-all duration-300 hover:z-10
                  ${project.featured 
                    ? 'col-span-1 sm:col-span-2 md:col-span-3 h-[420px]' 
                    : 'col-span-1 h-[300px]'
                  }
                `}
                onClick={() => setSelectedProject(project)}
                data-category={project.categories?.join(', ')}
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
                <div className={`absolute bottom-0 left-0 right-0 ${project.featured ? 'p-12 md:p-14' : 'p-8 md:p-10'} z-20 flex flex-col items-start gap-4`}>
                  <div className="px-10 py-1.5 rounded-full glass border-white/20 text-[9px] font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                    {project.categories?.join(' / ')}
                  </div>
                  <h3 className={`font-medium text-white tracking-tight leading-tight transition-transform duration-300 group-hover:translate-x-1 ${project.featured ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
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

const Footer: React.FC<{ settings: any }> = ({ settings }) => {
  const showInstagram = settings?.instagramUrl;
  const showYoutube = settings?.youtubeUrl;
  const showLinkedin = settings?.linkedinUrl;

  return (
    <footer className="w-full px-4 md:px-8 pb-4 pt-0 bg-base">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-t-[2.5rem] rounded-b-[2rem] px-10 md:px-16 py-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-ink/5 shadow-xl shadow-ink/5 relative overflow-hidden"
      >
        {/* Subtle background detail */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[radial-gradient(ellipse,rgba(122,160,255,0.06)_0%,transparent_70%)] pointer-events-none -z-10" />

        {/* Left section — brand */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="font-montserrat font-black text-2xl tracking-tighter text-ink lowercase">
            maas
          </span>
          <span className="text-spaced text-ink/30 text-xs mt-1 flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            Atlanta, GA
          </span>
        </div>

        {/* Center section — social icons */}
        <div className="flex items-center gap-6">
          {showInstagram && (
            <a 
              href={settings.instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex flex-col items-center gap-1.5"
            >
              <div className="w-11 h-11 rounded-full border border-ink/10 flex items-center justify-center transition-all duration-300 group-hover:border-periwinkle/40 group-hover:bg-periwinkle/5 group-hover:shadow-[0_0_20px_rgba(122,160,255,0.2)]">
                <Instagram className="w-4 h-4 text-ink/40 group-hover:text-periwinkle transition-colors duration-300" />
              </div>
              <span className="text-[9px] tracking-widest uppercase text-ink/30 group-hover:text-periwinkle/60 transition-colors duration-300">
                Instagram
              </span>
            </a>
          )}
          {showYoutube && (
            <a 
              href={settings.youtubeUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex flex-col items-center gap-1.5"
            >
              <div className="w-11 h-11 rounded-full border border-ink/10 flex items-center justify-center transition-all duration-300 group-hover:border-periwinkle/40 group-hover:bg-periwinkle/5 group-hover:shadow-[0_0_20px_rgba(122,160,255,0.2)]">
                <Youtube className="w-4 h-4 text-ink/40 group-hover:text-periwinkle transition-colors duration-300" />
              </div>
              <span className="text-[9px] tracking-widest uppercase text-ink/30 group-hover:text-periwinkle/60 transition-colors duration-300">
                YouTube
              </span>
            </a>
          )}
          {showLinkedin && (
            <a 
              href={settings.linkedinUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex flex-col items-center gap-1.5"
            >
              <div className="w-11 h-11 rounded-full border border-ink/10 flex items-center justify-center transition-all duration-300 group-hover:border-periwinkle/40 group-hover:bg-periwinkle/5 group-hover:shadow-[0_0_20px_rgba(122,160,255,0.2)]">
                <Linkedin className="w-4 h-4 text-ink/40 group-hover:text-periwinkle transition-colors duration-300" />
              </div>
              <span className="text-[9px] tracking-widest uppercase text-ink/30 group-hover:text-periwinkle/60 transition-colors duration-300">
                LinkedIn
              </span>
            </a>
          )}
        </div>

        {/* Right section — copyright */}
        <div className="text-center md:text-right">
          <div className="text-xs text-ink/30">
            © {new Date().getFullYear()} Maas Media LLC
          </div>
          <div className="text-[10px] text-ink/20 mt-1 tracking-wide">
            Visuals built for you.
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

const Contact: React.FC = () => {
  const [state, handleSubmit] = useForm('mgodvopq');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 pt-40 pb-40 flex flex-col items-center"
    >
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-[radial-gradient(ellipse,rgba(122,160,255,0.08)_0%,transparent_70%)] pointer-events-none z-0 md:hidden" />
      <div className="max-w-2xl w-full mb-6">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-6xl font-light text-ink tracking-tight mb-3"
        >
          Let's build.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-sm text-ink/40 font-light"
        >
          I typically respond within 24 hours.
        </motion.p>
      </div>
      <GlassCard className="max-w-2xl w-full p-12 space-y-12">
        {state.succeeded && (
          <div className="glass p-12 rounded-[2rem] text-center space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-periwinkle/10 flex items-center justify-center text-periwinkle">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-2xl font-medium text-ink">Message received.</h3>
            <p className="text-ink/60 text-sm">I'll be in touch within 24–48 hours.</p>
            <a href="/" onClick={(e) => { e.preventDefault(); window.location.reload(); }} className="inline-block text-periwinkle text-sm font-medium">
              Back to home →
            </a>
          </div>
        )}

        {!state.succeeded && (
          <>
            {state.errors && (state.errors as any).length > 0 && !state.succeeded && (
              <div className="glass p-6 rounded-xl border border-red-500/30 text-center mb-6">
                <p className="text-sm text-red-500/80">
                  Something went wrong. Please try again or email me directly at isaac@maasmedia.org.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-spaced opacity-60">Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    className="w-full bg-base/50 border border-ink/5 rounded-xl px-4 py-3 outline-none focus:border-periwinkle/30 transition-all font-light" 
                    placeholder="John Doe" 
                  />
                  <ValidationError field="name" prefix="name" errors={state.errors} className="block text-[0.7rem] text-red-400/90 mt-1" />
                </div>
                <div className="space-y-2">
                  <label className="text-spaced opacity-60">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    className="w-full bg-base/50 border border-ink/5 rounded-xl px-4 py-3 outline-none focus:border-periwinkle/30 transition-all font-light" 
                    placeholder="john@example.com" 
                  />
                  <ValidationError field="email" prefix="email" errors={state.errors} className="block text-[0.7rem] text-red-400/90 mt-1" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-spaced opacity-60">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required
                  className="w-full bg-base/50 border border-ink/5 rounded-xl px-4 py-3 outline-none focus:border-periwinkle/30 transition-all font-light" 
                  placeholder="(555) 555-5555" 
                />
                <ValidationError field="phone" prefix="phone" errors={state.errors} className="block text-[0.7rem] text-red-400/90 mt-1" />
              </div>
              <div className="space-y-2">
                <label className="text-spaced opacity-60">Project Type</label>
                <select 
                  name="project_type"
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
                <ValidationError field="project_type" prefix="project_type" errors={state.errors} className="block text-[0.7rem] text-red-400/90 mt-1" />
              </div>
              <div className="space-y-2">
                <label className="text-spaced opacity-60">Message</label>
                <textarea 
                  name="message"
                  required
                  rows={4} 
                  className="w-full bg-base/50 border border-ink/5 rounded-xl px-4 py-3 outline-none focus:border-periwinkle/30 transition-all font-light" 
                  placeholder="Tell me about your vision..." 
                />
                <ValidationError field="message" prefix="message" errors={state.errors} className="block text-[0.7rem] text-red-400/90 mt-1" />
              </div>
              <button 
                type="submit"
                disabled={state.submitting}
                className="w-full py-4 bg-periwinkle text-white rounded-xl font-medium hover:bg-periwinkle/90 transition-all shadow-xl shadow-periwinkle/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {state.submitting ? 'Sending...' : 'Send it over'}
              </button>
            </form>
          </>
        )}
      </GlassCard>
    </motion.div>
  );
};

const Blog: React.FC<{ 
  onNavigate: (tab: string) => void;
  posts: Post[];
}> = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-[2.5rem] p-12 md:p-16 flex flex-col items-center text-center gap-6 max-w-lg w-full relative overflow-hidden"
      >
        {/* Subtle background detail */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(122,160,255,0.07)_0%,transparent_70%)] pointer-events-none" />

        {/* Icon container */}
        <div className="w-16 h-16 rounded-full bg-periwinkle/10 border border-periwinkle/20 flex items-center justify-center relative z-10">
          <PenLine className="w-7 h-7 text-periwinkle" />
        </div>

        {/* Label */}
        <span className="text-spaced text-ink/30 text-xs relative z-10">
          coming soon
        </span>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-medium text-ink relative z-10">
          The Blog
        </h1>

        {/* Divider */}
        <div className="w-8 h-px bg-periwinkle/40 relative z-10" />

        {/* Description */}
        <p className="text-sm text-ink/50 font-light leading-relaxed max-w-sm relative z-10">
          Thoughts on video, craft, and the creative process — arriving soon.
        </p>

        <a
          href="https://www.instagram.com/maasmediallc"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-periwinkle/30 text-periwinkle text-xs font-medium hover:bg-periwinkle/10 transition-all duration-300 relative z-10"
        >
          <Instagram className="w-3.5 h-3.5" />
          Follow along on Instagram
        </a>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [portfolioFilter, setPortfolioFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Stagger effect for initial load
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsData, postsData, clientsData, siteSettingsData] = await Promise.all([
          getProjects(),
          getPosts(),
          getClients(),
          getSiteSettings(),
        ]);
        setProjects(projectsData);
        setPosts(postsData);
        setClients(clientsData);
        setSiteSettings(siteSettingsData);
      } catch (error) {
        console.error('Error fetching data from Sanity:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    setSelectedProject(null);
  }, [activeTab]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-base z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-periwinkle/30 border-t-periwinkle rounded-full animate-spin" />
          <span className="text-spaced opacity-40 text-xs">Loading experiences...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'Home' && (
            <Home 
              key="home" 
              onNavigate={setActiveTab} 
              onNavigateWithFilter={(tab, filter) => {
                setPortfolioFilter(filter);
                setActiveTab(tab);
              }} 
              clients={clients} 
              siteSettings={siteSettings} 
            />
          )}
          {activeTab === 'Work' && (
            <Portfolio 
              key="portfolio" 
              projects={projects} 
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              initialFilter={portfolioFilter}
            />
          )}
          {activeTab === 'Blog' && <Blog key="blog" onNavigate={setActiveTab} posts={posts} />}
          {activeTab === 'Contact' && <Contact key="contact" />}

        </AnimatePresence>
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} hidden={!!selectedProject} />
      
      <Footer settings={siteSettings} />
    </div>
  );
}

