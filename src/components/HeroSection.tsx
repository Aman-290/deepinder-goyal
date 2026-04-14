import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const [text, setText] = useState('');
  const fullText = "Dream without action is hallucination.";

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      targetX: number;
      targetY: number;
      color: string;
      size: number;

      constructor(x: number, y: number, targetX: number, targetY: number, color: string) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.targetX = targetX;
        this.targetY = targetY;
        this.color = color;
        this.size = Math.random() * 2 + 1;
      }

      update(progress: number) {
        if (progress < 0.1) {
          // Chaotic movement
          this.x += this.vx;
          this.y += this.vy;
          
          if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
          if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
        } else {
          // Snap to grid based on scroll progress
          const easeProgress = Math.min((progress - 0.1) * 1.5, 1); // 0 to 1
          
          // Interpolate between current chaotic position and target grid position
          const dx = this.targetX - this.x;
          const dy = this.targetY - this.y;
          
          this.x += dx * easeProgress * 0.1;
          this.y += dy * easeProgress * 0.1;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const cols = 40;
      const rows = 20;
      const spacingX = canvas.width / cols;
      const spacingY = canvas.height / rows;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          // Create a pattern (e.g., Zomato Z or a face shape)
          // For simplicity, let's make a grid that forms a central dense area
          const targetX = i * spacingX + spacingX / 2;
          const targetY = j * spacingY + spacingY / 2;
          
          const isRed = Math.random() > 0.7;
          const color = isRed ? '#E23744' : '#555555';
          
          // Start at random positions
          const startX = Math.random() * canvas.width;
          const startY = Math.random() * canvas.height;
          
          particles.push(new Particle(startX, startY, targetX, targetY, color));
        }
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let currentProgress = 0;
    const unsubscribe = scrollYProgress.on("change", (v) => {
      currentProgress = v;
    });

    const render = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update(currentProgress);
        p.draw(ctx);
      });

      // Draw connections if progress is high
      if (currentProgress > 0.5) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 50) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      unsubscribe();
    };
  }, [scrollYProgress]);

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  return (
    <div ref={containerRef} className="relative h-[200vh] w-full bg-bg">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <motion.div 
            style={{ opacity, y }}
            className="text-center px-4 w-full max-w-7xl mx-auto relative"
          >
            {/* Subtle Portrait Placeholder behind text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[80vh] border border-line/30 bg-surface/20 flex items-center justify-center overflow-hidden -z-10 opacity-20 mix-blend-luminosity">
              <span className="font-mono text-xs text-muted absolute z-10 px-2 py-1 bg-bg/50 border border-line/50">
                deepinder-hero-portrait.webp
              </span>
              <img src="deepinder-hero-portrait.webp" alt="Deepinder Goyal" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>

            <div className="hud-text text-muted mb-6 text-sm md:text-base border border-line inline-block px-4 py-2 bg-surface/50 backdrop-blur-sm">
              SYSTEMIC ANNIHILATION OF FRICTION
            </div>
            <h1 className="font-display text-6xl md:text-8xl lg:text-[10rem] font-bold uppercase tracking-tighter text-ink max-w-6xl mx-auto leading-[0.85] mix-blend-difference">
              {text}
              <span className="animate-pulse text-zomato">_</span>
            </h1>
          </motion.div>
        </div>

        {/* HUD Elements */}
        <div className="absolute top-8 left-8 hud-text text-xs text-muted">
          <div>SYS.OPT.V1.0</div>
          <div>LAT: 28.6139° N</div>
          <div>LON: 77.2090° E</div>
        </div>
        
        <div className="absolute bottom-8 right-8 hud-text text-xs text-muted text-right">
          <div>SCROLL TO OPTIMIZE</div>
          <div className="animate-bounce mt-2">↓</div>
        </div>
      </div>
    </div>
  );
}
