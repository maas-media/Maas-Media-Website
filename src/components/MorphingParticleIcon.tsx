import React, { useEffect, useRef, useMemo } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  phaseX: number;
  phaseY: number;
  floatSpeed: number;
}

export type IconShape = 'hexagon' | 'house' | 'star' | 'play';

interface MorphingParticleIconProps {
  shape: IconShape;
  color?: string;
}

export const MorphingParticleIcon: React.FC<MorphingParticleIconProps> = ({ shape, color = '#7aa0ff' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const particleCount = 500;

  // Generate targets based on shape
  const getTargetPoints = (currentShape: IconShape, width: number, height: number): Point[] => {
    const points: Point[] = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) * 0.5;

    const addLine = (x1: number, y1: number, x2: number, y2: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const t = (i + Math.random() * 0.5) / count; // Spread them more evenly but with slight natural jitter
        points.push({
          x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * 15, // Reduced jitter for more clarity
          y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * 15
        });
      }
    };

    switch (currentShape) {
      case 'hexagon':
        // 6 points of a hexagon
        for (let i = 0; i < 6; i++) {
          const angle1 = (i / 6) * Math.PI * 2 - Math.PI / 2;
          const angle2 = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2;
          const x1 = centerX + Math.cos(angle1) * size;
          const y1 = centerY + Math.sin(angle1) * size;
          const x2 = centerX + Math.cos(angle2) * size;
          const y2 = centerY + Math.sin(angle2) * size;
          addLine(x1, y1, x2, y2, Math.floor(particleCount / 6));
        }
        break;

      case 'house':
        // Simplified house: base square + triangle roof
        const bw = size * 0.9;
        const bh = size * 0.8;
        const floorY = centerY + bh * 0.4;
        const roofBaseY = centerY - bh * 0.1;
        const peakY = centerY - bh * 0.7;
        
        // Base
        addLine(centerX - bw / 2, floorY, centerX + bw / 2, floorY, particleCount * 0.2); // floor
        addLine(centerX - bw / 2, floorY, centerX - bw / 2, roofBaseY, particleCount * 0.2); // left wall
        addLine(centerX + bw / 2, floorY, centerX + bw / 2, roofBaseY, particleCount * 0.2); // right wall
        
        // Roof
        addLine(centerX - bw * 0.6, roofBaseY, centerX, peakY, particleCount * 0.2);
        addLine(centerX, peakY, centerX + bw * 0.6, roofBaseY, particleCount * 0.2);
        break;

      case 'star':
        // 5-pointed star
        const innerSize = size * 0.4;
        const starPoints = 5;
        const step = Math.PI / starPoints;
        for (let i = 0; i < 2 * starPoints; i++) {
          const r = (i % 2 === 0) ? size : innerSize;
          const angle = i * step - Math.PI / 2;
          const nextR = ((i + 1) % 2 === 0) ? size : innerSize;
          const nextAngle = (i + 1) * step - Math.PI / 2;
          
          const x1 = centerX + Math.cos(angle) * r;
          const y1 = centerY + Math.sin(angle) * r;
          const x2 = centerX + Math.cos(nextAngle) * nextR;
          const y2 = centerY + Math.sin(nextAngle) * nextR;
          
          addLine(x1, y1, x2, y2, Math.floor(particleCount / (2 * starPoints)));
        }
        break;

      case 'play':
        // Equilateral triangle
        const h = size * Math.sqrt(3);
        const ty1 = centerY - h / 3;
        const ty2 = centerY + h / 3;
        const tx1 = centerX - size * 0.8;
        const tx2 = centerX + size;
        
        addLine(tx1, ty1, tx1, ty2, particleCount / 3); // vertical
        addLine(tx1, ty1, tx2, centerY, particleCount / 3); // top slope
        addLine(tx1, ty2, tx2, centerY, particleCount / 3); // bottom slope
        break;
    }
    
    // Fill remaining points with random noise to avoid index out of bounds
    while (points.length < particleCount) {
      points.push({
        x: centerX + (Math.random() - 0.5) * size,
        y: centerY + (Math.random() - 0.5) * size
      });
    }

    return points;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 500;
      canvas.height = canvas.parentElement?.clientHeight || 500;
      
      // Init particles if empty
      if (particles.current.length === 0) {
        for (let i = 0; i < particleCount; i++) {
          particles.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            targetX: Math.random() * canvas.width,
            targetY: Math.random() * canvas.height,
            vx: 0,
            vy: 0,
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            floatSpeed: 0.02 + Math.random() * 0.02
          });
        }
      }
    };

    const updateTargets = () => {
      const targets = getTargetPoints(shape, canvas.width, canvas.height);
      particles.current.forEach((p, i) => {
        const target = targets[i % targets.length];
        p.targetX = target.x;
        p.targetY = target.y;
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      time += 1;

      particles.current.forEach((p) => {
        // Smooth harmonic floating offset
        const offsetX = Math.sin(time * p.floatSpeed + p.phaseX) * 15;
        const offsetY = Math.cos(time * p.floatSpeed + p.phaseY) * 15;

        // Target position including floating
        const tx = p.targetX + offsetX;
        const ty = p.targetY + offsetY;

        // Move towards floating target
        const dx = tx - p.x;
        const dy = ty - p.y;
        
        p.vx = dx * 0.05;
        p.vy = dy * 0.05;
        
        p.x += p.vx;
        p.y += p.vy;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    updateTargets();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [shape, color]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};
