import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BRAIN_POINTS: [number, number][] = [];
for (let i = 0; i < 200; i++) {
  const angle = (i / 200) * Math.PI * 2;
  const rx = 120 + Math.sin(angle * 3) * 20 + Math.sin(angle * 7) * 10;
  const ry = 90 + Math.cos(angle * 2) * 15 + Math.cos(angle * 5) * 8;
  BRAIN_POINTS.push([
    Math.cos(angle) * rx + (Math.random() - 0.5) * 40,
    Math.sin(angle) * ry + (Math.random() - 0.5) * 30,
  ]);
}
for (let i = 0; i < 150; i++) {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.random() * 80;
  BRAIN_POINTS.push([
    Math.cos(angle) * r + (Math.random() - 0.5) * 20,
    Math.sin(angle) * r * 0.75 + (Math.random() - 0.5) * 15,
  ]);
}

interface BloodParticle {
  x: number; y: number; baseY: number; speed: number; size: number; brightness: number;
}

export default function GravityBrainViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const [templeActive, setTempleActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = 400, H = 300;
    canvas.width = W;
    canvas.height = H;
    const cx = W / 2, cy = H / 2;

    const particles: BloodParticle[] = Array.from({ length: 80 }, () => ({
      x: cx + (Math.random() - 0.5) * 200,
      y: cy + (Math.random() - 0.5) * 160,
      baseY: 0,
      speed: 0.3 + Math.random() * 0.7,
      size: 1 + Math.random() * 2,
      brightness: 0.5 + Math.random() * 0.5,
    }));
    particles.forEach(p => p.baseY = p.y);

    const trigger = ScrollTrigger.create({
      trigger: canvas.parentElement,
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        setTempleActive(self.progress > 0.6);
      },
    });

    let rafId: number;
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      const progress = progressRef.current;
      const gravityEffect = progress < 0.6 ? progress / 0.6 : 1 - (progress - 0.6) / 0.4;
      const reversed = progress > 0.6;

      for (const [bx, by] of BRAIN_POINTS) {
        ctx.fillStyle = `rgba(138, 43, 226, ${0.08 + (reversed ? 0.1 : 0)})`;
        ctx.beginPath();
        ctx.arc(cx + bx, cy + by, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const p of particles) {
        if (reversed) {
          p.y -= p.speed * 1.5;
          if (p.y < cy - 80) p.y = cy + 80;
          p.brightness = Math.min(1, p.brightness + 0.01);
        } else {
          p.y += p.speed * gravityEffect * 0.8;
          if (p.y > cy + 80) p.y = cy - 80;
          const verticalPos = (p.y - (cy - 80)) / 160;
          p.brightness = 0.2 + verticalPos * 0.6 * (1 - gravityEffect * 0.5);
        }

        const alpha = p.brightness;
        ctx.fillStyle = reversed
          ? `rgba(226, 55, 68, ${alpha})`
          : `rgba(226, 55, 68, ${alpha * (1 - gravityEffect * 0.4)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (reversed) {
        ctx.strokeStyle = 'rgba(138, 43, 226, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx + 130, cy - 20, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(138, 43, 226, 0.3)';
        ctx.fill();
      }

      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      trigger.kill();
    };
  }, []);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full max-w-md mx-auto" style={{ aspectRatio: '4/3' }} />
      {templeActive && (
        <p className="hud-text text-center mt-2 text-[10px]" style={{ color: '#8A2BE2' }}>
          TEMPLE DEVICE ACTIVE // BLOOD FLOW RESTORED
        </p>
      )}
    </div>
  );
}
