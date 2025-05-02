"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface AnimatedBackgroundProps {
  variant?: 'default' | 'dashboard' | 'minimal';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ variant = 'default' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();

  // N'afficher l'arrière-plan animé que sur certaines pages
  const shouldRender = !pathname?.includes('/login') && !pathname?.includes('/register');
  
  useEffect(() => {
    if (!shouldRender || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Définir la taille du canvas à la taille de la fenêtre
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Créer des particules selon le variant
    let particleCount = variant === 'minimal' ? 30 : variant === 'dashboard' ? 50 : 80;
    let particleSpeed = variant === 'minimal' ? 0.2 : variant === 'dashboard' ? 0.3 : 0.4;
    
    // Définir les couleurs selon le variant
    const colors = variant === 'minimal' 
      ? ['rgba(59, 130, 246, 0.3)', 'rgba(99, 102, 241, 0.3)'] 
      : variant === 'dashboard'
      ? ['rgba(59, 130, 246, 0.4)', 'rgba(99, 102, 241, 0.4)', 'rgba(139, 92, 246, 0.4)']
      : ['rgba(59, 130, 246, 0.5)', 'rgba(99, 102, 241, 0.5)', 'rgba(139, 92, 246, 0.5)', 'rgba(236, 72, 153, 0.3)'];
    
    // Créer les particules
    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;
      alpha: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.directionX = (Math.random() - 0.5) * particleSpeed;
        this.directionY = (Math.random() - 0.5) * particleSpeed;
        this.size = Math.random() * 3 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.6 + 0.2;
      }
      
      update() {
        // Rebondir sur les bords
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
          this.directionY = -this.directionY;
        }
        
        // Déplacer les particules
        this.x += this.directionX;
        this.y += this.directionY;
        
        this.draw();
      }
      
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    
    // Créer un tableau de particules
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Dessiner les particules
    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Mettre à jour les particules
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      
      // Dessiner les lignes entre les particules proches
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Dessiner une ligne si les particules sont assez proches
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };
    
    animate();
    
    // Nettoyer
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [shouldRender, variant]);
  
  if (!shouldRender) return null;
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950/60"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default AnimatedBackground;