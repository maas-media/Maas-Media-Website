/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, animate } from 'motion/react';
import { ParticleBackground } from './components/ParticleBackground';
import { Navigation } from './components/Navigation';
import { Logo } from './components/Logo';
import { GlassCard } from './components/GlassCard';
import { PROJECTS, POSTS, TESTIMONIALS, Project } from './mockData';
import { Camera, Mail, ArrowRight, Play, ExternalLink, Hexagon, Home as House, Star, Calendar, Smartphone, MapPin, Clock, GraduationCap, Sparkles, MousePointer2 } from 'lucide-react';

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

interface ConstellationNodeProps {
  node: any;
  nodeX: any;
  nodeY: any;
  isHovered: boolean;
  isDimmed: boolean;
  onMouseEnter: (id: string) => void;
  onMouseLeave: () => void;
}

const ConstellationNode: React.FC<ConstellationNodeProps> = ({ 
  node, nodeX, nodeY, isHovered, isDimmed, onMouseEnter, onMouseLeave 
}) => {
  const left = useTransform(nodeX, (v: number) => (v / 10) + '%');
  const top = useTransform(nodeY, (v: number) => (v / 10) + '%');

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left, top }}
    >
      <motion.div
        className="relative cursor-pointer group/node"
        onMouseEnter={() => onMouseEnter(node.id)}
        onMouseLeave={onMouseLeave}
        animate={{
          opacity: isDimmed ? 0.4 : 1,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-40 h-12 bg-transparent z-0" />
        
        <motion.div 
          className="w-3 h-3 bg-periwinkle rounded-full relative z-10"
          animate={{
            boxShadow: isHovered 
              ? '0 0 25px 8px rgba(122, 160, 255, 0.6)' 
              : ['0 0 8px 2px rgba(122, 160, 255, 0.2)', '0 0 16px 4px rgba(122, 160, 255, 0.4)', '0 0 8px 2px rgba(122, 160, 255, 0.2)']
          }}
          transition={isHovered ? { duration: 0.2 } : { repeat: Infinity, duration: node.pulseDur, ease: "easeInOut" }}
        />

        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3 w-max">
          <div className="w-8 h-8 rounded-full bg-periwinkle/10 border border-periwinkle/20 flex items-center justify-center text-[10px] font-medium text-periwinkle backdrop-blur-sm">
            {node.initials}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-ink uppercase tracking-wider leading-none">{node.name}</span>
            <span className="text-[9px] text-ink/40 tracking-widest uppercase mt-1 leading-none">{node.role}</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className={`absolute z-[100] w-[350px] pointer-events-none ${node.x > 700 ? '-left-[360px]' : 'left-8'} ${node.y > 700 ? '-top-64' : 'top-8'}`}
          >
            <GlassCard className="p-10 border-periwinkle/20 shadow-2xl shadow-periwinkle/10 relative overflow-hidden">
              <span className="absolute -top-4 -left-2 text-[120px] font-serif text-periwinkle/5 leading-none select-none">“</span>
              
              <div className="space-y-6 relative z-10">
                <p className="text-xl font-light text-ink/80 leading-relaxed italic">
                  {node.text}
                </p>
                <div className="pt-6 border-t border-ink/5">
                  <div className="text-lg font-medium text-ink">{node.name}</div>
                  <div className="text-xs text-spaced opacity-40 uppercase">{node.role}</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ConstellationTestimonials: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const testimonials = [
    ...TESTIMONIALS,
    { id: '4', name: 'Michael K.', role: 'Executive Producer', text: 'Isaac has a rare ability to capture the energy of a room without ever being intrusive.' },
    { id: '5', name: 'Marcus T.', role: 'Hospitality Group', text: 'The attention to detail in his property tours has set a new standard for our portfolio.' },
    { id: '6', name: 'Jessica W.', role: 'Event Planner', text: 'Clean, energetic, and professional. The turnaround time is just as impressive as the work.' },
  ];

  const basePositions = [
    { x: 200, y: 300, driftX: [0, 8, -4, 0], driftY: [0, -6, 8, 0], dDur: 8 },
    { x: 450, y: 200, driftX: [0, -6, 5, 0], driftY: [0, 8, -6, 0], dDur: 10 },
    { x: 750, y: 350, driftX: [0, 5, -8, 0], driftY: [0, -8, 5, 0], dDur: 9 },
    { x: 300, y: 650, driftX: [0, -8, 6, 0], driftY: [0, 6, -8, 0], dDur: 11 },
    { x: 600, y: 750, driftX: [0, 6, -5, 0], driftY: [0, -7, 6, 0], dDur: 12 },
    { x: 800, y: 600, driftX: [0, -5, 7, 0], driftY: [0, 8, -5, 0], dDur: 13 },
  ];

  // We use 6 static motion values to avoid hook violations in loops
  const x1 = useMotionValue(200); const y1 = useMotionValue(300);
  const x2 = useMotionValue(450); const y2 = useMotionValue(200);
  const x3 = useMotionValue(750); const y3 = useMotionValue(350);
  const x4 = useMotionValue(300); const y4 = useMotionValue(650);
  const x5 = useMotionValue(600); const y5 = useMotionValue(750);
  const x6 = useMotionValue(800); const y6 = useMotionValue(600);

  const nodeXValues = [x1, x2, x3, x4, x5, x6];
  const nodeYValues = [y1, y2, y3, y4, y5, y6];

  useEffect(() => {
    const controls: any[] = [];
    
    basePositions.forEach((pos, i) => {
      const cx = animate(nodeXValues[i], pos.driftX.map(d => d + pos.x), {
        duration: pos.dDur,
        repeat: Infinity,
        ease: "easeInOut"
      });
      const cy = animate(nodeYValues[i], pos.driftY.map(d => d + pos.y), {
        duration: pos.dDur,
        repeat: Infinity,
        ease: "easeInOut"
      });
      controls.push(cx, cy);
    });

    return () => controls.forEach(c => c.stop());
  }, []);

  useEffect(() => {
    if (hoveredId) {
      const idx = testimonials.findIndex(t => t.id === hoveredId);
      if (idx !== -1) {
        animate(nodeXValues[idx], basePositions[idx].x, { duration: 0.4 });
        animate(nodeYValues[idx], basePositions[idx].y, { duration: 0.4 });
      }
    } else {
      basePositions.forEach((pos, i) => {
        animate(nodeXValues[i], pos.driftX.map(d => d + pos.x), {
          duration: pos.dDur,
          repeat: Infinity,
          ease: "easeInOut"
        });
        animate(nodeYValues[i], pos.driftY.map(d => d + pos.y), {
          duration: pos.dDur,
          repeat: Infinity,
          ease: "easeInOut"
        });
      });
    }
  }, [hoveredId]);

  const initials = testimonials.map(t => t.name.split(' ').map(n => n[0]).join(''));
  const pulseDurs = testimonials.map((_, i) => 2.5 + (i * 0.3));

  const connections = [[0, 1], [1, 2], [0, 3], [3, 4], [4, 5], [2, 5], [1, 4]];

  const handleNodeMouseEnter = (id: string) => {
    setHoveredId(id);
    if (!hasInteracted) setHasInteracted(true);
  };

  return (
    <section className="container mx-auto px-4 py-24 min-h-[900px] relative overflow-hidden">
      <div className="mb-20 flex justify-between items-end">
        <div>
          <span className="text-spaced opacity-40 uppercase">Kind Words</span>
          <h2 className="text-2xl font-light text-ink/60 mt-2">Client Testimonials</h2>
        </div>
        
        <AnimatePresence>
          {!hasInteracted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="hidden md:flex items-center gap-3 text-ink/30 mr-12 mb-2"
            >
              <MousePointer2 className="w-3 h-3" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium">hover a client</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="hidden md:block absolute inset-0 top-32 left-0 w-full h-[700px] z-0">
        <svg viewBox="0 0 1000 1000" className="w-full h-full pointer-events-none overflow-visible">
          {connections.map(([startIdx, endIdx], i) => {
            const isRelated = hoveredId === testimonials[startIdx].id || hoveredId === testimonials[endIdx].id;
            
            return (
              <motion.line
                key={`line-${i}`}
                x1={nodeXValues[startIdx]}
                y1={nodeYValues[startIdx]}
                x2={nodeXValues[endIdx]}
                y2={nodeYValues[endIdx]}
                stroke="currentColor"
                className="text-periwinkle"
                initial={{ opacity: 0.15 }}
                animate={{ 
                  opacity: hoveredId ? (isRelated ? 0.4 : 0.05) : 0.15,
                  strokeWidth: isRelated ? 1.5 : 1
                }}
                transition={{ duration: 0.4 }}
              />
            );
          })}
        </svg>

        {testimonials.map((t, i) => (
          <ConstellationNode
            key={t.id}
            node={{ ...t, ...basePositions[i], initials: initials[i], pulseDur: pulseDurs[i] }}
            nodeX={nodeXValues[i]}
            nodeY={nodeYValues[i]}
            isHovered={hoveredId === t.id}
            isDimmed={hoveredId !== null && hoveredId !== t.id}
            onMouseEnter={handleNodeMouseEnter}
            onMouseLeave={() => setHoveredId(null)}
          />
        ))}
      </div>

      <div className="md:hidden space-y-6">
        {testimonials.map((t, i) => (
          <GlassCard key={t.id} className="p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-periwinkle/10 border border-periwinkle/20 flex items-center justify-center text-xs font-medium text-periwinkle">
                {initials[i]}
              </div>
              <div>
                <dt className="text-sm font-medium text-ink uppercase tracking-wider">{t.name}</dt>
                <dd className="text-[10px] text-ink/40 tracking-widest uppercase">{t.role}</dd>
              </div>
            </div>
            <p className="text-lg font-light text-ink/70 leading-relaxed italic">"{t.text}"</p>
          </GlassCard>
        ))}
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

      {/* About Section: Split Editorial Layout */}
      <section className="container mx-auto px-4 py-32">
        <div className="flex flex-col lg:flex-row min-h-[800px] border border-ink/5 overflow-hidden rounded-3xl bg-base/20">
          {/* Left Half: The Image */}
          <div className="w-full lg:w-1/2 relative h-[500px] lg:h-auto overflow-hidden">
            <motion.img 
              initial={{ scale: 1.03, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200"
              className="w-full h-full object-cover grayscale"
              alt="Isaac Maas"
            />
            {/* Identity Badge */}
            <div className="absolute bottom-8 left-8">
              <GlassCard className="px-6 py-3 rounded-full border-white/20 bg-white/10 backdrop-blur-md">
                <span className="text-xl font-medium text-white tracking-tight">Isaac Maas</span>
              </GlassCard>
            </div>
          </div>

          {/* Right Half: Content Zones */}
          <div className="w-full lg:w-1/2 flex flex-col">
            {/* Zone 1: Identity Strip */}
            <div className="p-8 md:p-12 border-b border-ink/5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                    className="flex flex-col gap-3 group"
                  >
                    <div className="flex items-center gap-2">
                      <stat.icon className="w-3.5 h-3.5 text-periwinkle/50 group-hover:text-periwinkle transition-colors" strokeWidth={1.5} />
                      <span className="text-[10px] uppercase tracking-widest opacity-40">{stat.label}</span>
                    </div>
                    <span className="text-sm font-light text-ink/80">{stat.val}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Zone 2: Bio and Video */}
            <div className="flex-grow p-8 md:p-12 flex flex-col md:flex-row gap-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex-1 space-y-6"
              >
                <div className="space-y-4">
                  <p className="text-xl font-light text-ink/70 leading-relaxed italic">
                    "I believe every story has a unique frequency. My job is to find the light and shadow that lets it vibrate."
                  </p>
                  <p className="text-lg font-light text-ink/60 leading-relaxed">
                    I'm a cinematographer who obsessed with the details. From high-end commercial sets to solo property tours, I treat every frame with the same level of architectural precision and emotional grit.
                  </p>
                </div>
                <button 
                  onClick={() => onNavigate('Contact')}
                  className="inline-flex items-center gap-2 text-periwinkle font-medium hover:gap-4 transition-all group pt-4"
                >
                  Let's build something together <ArrowRight className="w-4 h-4 transition-transform" />
                </button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="md:w-56 space-y-3"
              >
                <span className="text-spaced text-[10px] opacity-40">My Story</span>
                <GlassCard className="aspect-[3/4] p-0 overflow-hidden relative group/vplay cursor-pointer border-periwinkle/10">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover grayscale brightness-50"
                    src="https://assets.mixkit.co/videos/preview/mixkit-cinematic-mountain-landscape-with-a-river-in-the-valley-4415-large.mp4"
                    onLoadedData={() => console.log("Story video loaded")}
                    onError={() => console.error("Story video error")}
                  >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-cinematic-mountain-landscape-with-a-river-in-the-valley-4415-large.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover/vplay:scale-110 group-hover/vplay:bg-periwinkle/30 transition-all">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <ConstellationTestimonials />

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <GlassCard className="bg-[#1a1a2e] p-16 md:p-24 overflow-hidden relative group">
          {/* Animated gradient border simulation */}
          <div className="absolute inset-0 bg-gradient-to-r from-periwinkle via-lavender to-teal opacity-20 group-hover:opacity-100 transition-opacity duration-1000 blur-xl" />
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            <h2 className="text-4xl md:text-6xl text-white font-light lowercase">Visuals built <span className="italic">for you.</span></h2>
            <p className="text-white/40 max-w-lg font-light">Elevate your brand with cinematic precision. Based in Atlanta, available worldwide.</p>
            <button 
              onClick={() => onNavigate('Contact')}
              className="px-10 py-4 bg-white text-ink rounded-full font-medium hover:bg-periwinkle hover:text-white transition-all transform hover:scale-105 shadow-2xl shadow-white/10"
            >
              Start Your Project
            </button>
          </div>
        </GlassCard>
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

