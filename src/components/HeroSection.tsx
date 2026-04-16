import { useRef, useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Spline = lazy(() =>
  import('@splinetool/react-spline').then((mod) => ({ default: mod.default }))
);

class Particle {
  x: number; y: number; vx: number; vy: number;
  targetX: number; targetY: number;
  color: string; size: number;

  constructor(canvasW: number, canvasH: number, gridX: number, gridY: number) {
    this.x = Math.random() * canvasW;
    this.y = Math.random() * canvasH;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.targetX = gridX;
    this.targetY = gridY;
    this.color = Math.random() > 0.7 ? '#E23744' : '#555555';
    this.size = Math.random() * 2 + 1;
  }

  update(progress: number, canvasW: number, canvasH: number) {
    if (progress < 0.1) {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvasW) this.vx *= -1;
      if (this.y < 0 || this.y > canvasH) this.vy *= -1;
    } else {
      const ease = Math.min((progress - 0.1) / 0.9, 1);
      this.x += (this.targetX - this.x) * ease * 0.05;
      this.y += (this.targetY - this.y) * ease * 0.05;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function CanvasFallback({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  const initParticles = useCallback((w: number, h: number) => {
    const cols = 40, rows = 20;
    const particles: Particle[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        particles.push(new Particle(w, h, (c / (cols - 1)) * w, (r / (rows - 1)) * h));
      }
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.fillStyle = 'rgba(3, 3, 3, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef.current) {
        p.update(progress, canvas.width, canvas.height);
        p.draw(ctx);
      }
      if (progress > 0.5) {
        ctx.strokeStyle = `rgba(226, 55, 68, ${(progress - 0.5) * 0.1})`;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particlesRef.current.length; i++) {
          for (let j = i + 1; j < Math.min(i + 10, particlesRef.current.length); j++) {
            const a = particlesRef.current[i], b = particlesRef.current[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            if (dx * dx + dy * dy < 2500) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [progress, initParticles]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

function useTypingAnimation(text: string, speed = 80) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const { displayed, done } = useTypingAnimation('DREAM WITHOUT ACTION IS HALLUCINATION.');

  useEffect(() => {
    if (!containerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        setProgress(self.progress);
      },
    });

    return () => trigger.kill();
  }, []);

  const SPLINE_SCENE_URL = '';

  return (
    <section ref={containerRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {SPLINE_SCENE_URL && !splineError ? (
          <Suspense fallback={<CanvasFallback progress={progress} />}>
            <Spline
              scene={SPLINE_SCENE_URL}
              onLoad={() => setSplineLoaded(true)}
              onError={() => setSplineError(true)}
              className="absolute inset-0 w-full h-full"
            />
            {!splineLoaded && <CanvasFallback progress={progress} />}
          </Suspense>
        ) : (
          <CanvasFallback progress={progress} />
        )}

        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-4"
          style={{ opacity: Math.max(0, 1 - progress * 2.5) }}
        >
          <p className="hud-text text-muted mb-6 tracking-[0.3em]">
            SYSTEMIC ANNIHILATION OF FRICTION
          </p>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-display font-bold leading-[0.9] text-center max-w-6xl">
            {displayed}
            {!done && (
              <span className="inline-block w-[3px] h-[0.8em] bg-zomato ml-1 animate-pulse" />
            )}
          </h1>

          <p
            className="hud-text text-muted/50 mt-12 tracking-[0.2em]"
            style={{ opacity: done ? 1 : 0, transition: 'opacity 1s' }}
          >
            SCROLL TO OPTIMIZE →
          </p>
        </div>

        <div className="absolute top-4 left-4 hud-text text-muted/30 text-[10px]">
          <div>SYS.OPT V2.0</div>
          <div>LAT: 28.6139° N</div>
          <div>LON: 77.2090° E</div>
        </div>
      </div>
    </section>
  );
}
