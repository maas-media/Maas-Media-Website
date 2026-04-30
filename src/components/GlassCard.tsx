import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  glow = true,
  ...props 
}) => {
  return (
    <motion.div
      {...props}
      className={`glass rounded-3xl p-6 relative overflow-hidden ${className} ${glow ? 'glass-hover' : ''}`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Underlying glow if requested */}
      {glow && (
        <div className="absolute inset-0 -z-10 bg-periwinkle/0 group-hover:bg-periwinkle/5 transition-colors duration-500" />
      )}
      {children}
    </motion.div>
  );
};
