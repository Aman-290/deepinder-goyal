import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Generate brain outline points — two hemispheres with a central fissure
function generateBrainOutline(): [number, number][] {
  const points: [number, number][] = [];

  // Left hemisphere outline
  for (let i = 0; i < 120; i++) {
    const t = (i / 120) * Math.PI * 2;
    const rx = 100 + Math.sin(t * 3) * 15 + Math.sin(t * 6) * 8;
    const ry = 75 + Math.cos(t * 2) * 12 + Math.cos(t * 5) * 6;
    const x = Math.cos(t) * rx - 10;
    const y = Math.sin(t) * ry;
    points.push([x + (Math.random() - 0.5) * 6, y + (Math.random() - 0.5) * 5]);
  }

  // Right hemisphere slightly offset
  for (let i = 0; i < 120; i++) {
    const t = (i / 120) * Math.PI * 2;
    const rx = 95 + Math.sin(t * 3 + 0.5) * 15 + Math.sin(t * 7) * 7;
    const ry = 72 + Math.cos(t * 2 + 0.3) * 11 + Math.cos(t * 5) * 5;
    const x = Math.cos(t) * rx + 10;
    const y = Math.sin(t) * ry;
    points.push([x + (Math.random() - 0.5) * 6, y + (Math.random() - 0.5) * 5]);
  }

  // Central fissure — dense line of particles down the middle
  for (let i = 0; i < 40; i++) {
    const y = -70 + (i / 40) * 140;
    points.push([(Math.random() - 0.5) * 8, y + (Math.random() - 0.5) * 4]);
  }

  // Cerebral fold patterns — wavy lines inside the brain
  for (let fold = 0; fold < 5; fold++) {
    const yBase = -50 + fold * 25;
    const xOffset = (fold % 2 === 0 ? -1 : 1) * 20;
    for (let i = 0; i < 30; i++) {
      const x = -70 + (i / 30) * 140 + xOffset;
      const y = yBase + Math.sin(i * 0.4 + fold) * 12;
      if (Math.abs(x) < 95 - Math.abs(y) * 0.3) {
        points.push([x + (Math.random() - 0.5) * 4, y + (Math.random() - 0.5) * 3]);
      }
    }
  }

  // Interior fill — scattered points within the brain shape
  for (let i = 0; i < 100; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 70;
    const x = Math.cos(angle) * r * 1.3;
    const y = Math.sin(angle) * r;
    points.push([x + (Math.random() - 0.5) * 8, y + (Math.random() - 0.5) * 6]);
  }

  return points;
}

const BRAIN_POINTS = generateBrainOutline();

interface BloodParticle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  speed: number;
  size: number;
  brightness: number;
  phase: number;
}

export default function GravityBrainViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const [templeActive, setTempleActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = 440, H = 340;
    canvas.width = W * 2;
    canvas.height = H * 2;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(2, 2); // Retina
    const cx = W / 2, cy = H / 2;

    const particles: BloodParticle[] = Array.from({ length: 100 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 70;
      return {
        x: cx + Math.cos(angle) * r * 1.3,
        y: cy + Math.sin(angle) * r,
        baseX: cx + Math.cos(angle) * r * 1.3,
        baseY: cy + Math.sin(angle) * r,
        speed: 0.3 + Math.random() * 0.7,
        size: 1.5 + Math.random() * 2.5,
        brightness: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      };
    });

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
    let time = 0;
    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, W, H);
      const progress = progressRef.current;
      const gravityEffect = progress < 0.6 ? progress / 0.6 : 1 - (progress - 0.6) / 0.4;
      const reversed = progress > 0.6;

      // Brain outline glow
      const outlineAlpha = reversed ? 0.2 : 0.08;
      const outlineColor = reversed ? '138, 43, 226' : '138, 43, 226';
      for (const [bx, by] of BRAIN_POINTS) {
        const px = cx + bx;
        const py = cy + by;
        // Subtle pulse
        const pulse = 1 + Math.sin(time * 2 + bx * 0.01) * 0.3;
        ctx.fillStyle = `rgba(${outlineColor}, ${outlineAlpha * pulse})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Translucent brain outline stroke
      ctx.save();
      ctx.globalAlpha = reversed ? 0.12 : 0.04;
      ctx.strokeStyle = '#8A2BE2';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Left hemisphere arc
      ctx.ellipse(cx - 10, cy, 100, 75, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      // Right hemisphere arc
      ctx.ellipse(cx + 10, cy, 95, 72, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Blood flow particles
      for (const p of particles) {
        const wobble = Math.sin(time * 1.5 + p.phase) * 2;

        if (reversed) {
          p.y -= p.speed * 1.5;
          p.x = p.baseX + wobble;
          if (p.y < cy - 80) {
            p.y = cy + 80;
            p.x = p.baseX;
          }
          p.brightness = Math.min(1, p.brightness + 0.005);
        } else {
          p.y += p.speed * gravityEffect * 0.8;
          p.x = p.baseX + wobble * (1 + gravityEffect * 0.5);
          if (p.y > cy + 80) {
            p.y = cy - 80;
            p.x = p.baseX;
          }
          const verticalPos = (p.y - (cy - 80)) / 160;
          p.brightness = 0.3 + verticalPos * 0.5 * (1 - gravityEffect * 0.4);
        }

        const alpha = p.brightness;
        const baseColor = reversed ? '226, 55, 68' : '226, 55, 68';
        const finalAlpha = reversed ? alpha : alpha * (1 - gravityEffect * 0.3);

        // Particle glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `rgba(${baseColor}, ${finalAlpha})`);
        gradient.addColorStop(0.5, `rgba(${baseColor}, ${finalAlpha * 0.3})`);
        gradient.addColorStop(1, `rgba(${baseColor}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Bright core
        ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Temple device indicator when reversed
      if (reversed) {
        const templeX = cx + 140;
        const templeY = cy - 20;
        const tempPulse = 0.5 + Math.sin(time * 3) * 0.5;

        // Glow
        const tGrad = ctx.createRadialGradient(templeX, templeY, 0, templeX, templeY, 20);
        tGrad.addColorStop(0, `rgba(138, 43, 226, ${0.4 * tempPulse})`);
        tGrad.addColorStop(1, 'rgba(138, 43, 226, 0)');
        ctx.fillStyle = tGrad;
        ctx.beginPath();
        ctx.arc(templeX, templeY, 20, 0, Math.PI * 2);
        ctx.fill();

        // Ring
        ctx.strokeStyle = `rgba(138, 43, 226, ${0.6 * tempPulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(templeX, templeY, 8, 0, Math.PI * 2);
        ctx.stroke();

        // Inner dot
        ctx.fillStyle = `rgba(138, 43, 226, ${0.8 * tempPulse})`;
        ctx.beginPath();
        ctx.arc(templeX, templeY, 3, 0, Math.PI * 2);
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
      <canvas ref={canvasRef} className="w-full max-w-[440px] mx-auto" style={{ aspectRatio: '44/34' }} />
      {templeActive && (
        <p className="hud-text text-center mt-3 text-[11px] tracking-wider animate-pulse" style={{ color: '#8A2BE2' }}>
          TEMPLE DEVICE ACTIVE // CEREBRAL BLOOD FLOW RESTORED
        </p>
      )}
    </div>
  );
}
