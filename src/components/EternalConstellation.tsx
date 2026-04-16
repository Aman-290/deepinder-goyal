import { useRef, useEffect, useCallback } from 'react';

interface PillarNode {
  name: string;
  color: string;
  x: number;
  y: number;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitAngle: number;
}

const PILLARS: PillarNode[] = [
  { name: 'Zomato', color: '#E23744', x: 0, y: 0, radius: 18, orbitRadius: 120, orbitSpeed: 0.03, orbitAngle: 0 },
  { name: 'Blinkit', color: '#F8CB46', x: 0, y: 0, radius: 20, orbitRadius: 180, orbitSpeed: 0.02, orbitAngle: Math.PI * 0.5 },
  { name: 'District', color: '#8A2BE2', x: 0, y: 0, radius: 16, orbitRadius: 85, orbitSpeed: 0.04, orbitAngle: Math.PI },
  { name: 'Hyperpure', color: '#2E8B57', x: 0, y: 0, radius: 17, orbitRadius: 150, orbitSpeed: 0.025, orbitAngle: Math.PI * 1.5 },
];

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
}

export default function EternalConstellation({
  activePillar,
  onPillarClick,
}: {
  activePillar: string | null;
  onPillarClick: (name: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<PillarNode[]>(PILLARS.map(p => ({ ...p })));
  const dustRef = useRef<DustParticle[]>([]);
  const timeRef = useRef(0);
  const activePillarRef = useRef(activePillar);
  const onClickRef = useRef(onPillarClick);

  activePillarRef.current = activePillar;
  onClickRef.current = onPillarClick;

  // Hit test uses CSS coordinates (no DPR scaling) since node positions are in CSS space
  const handleClick = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (const node of nodesRef.current) {
      const dx = mx - node.x;
      const dy = my - node.y;
      const hitRadius = node.radius + 20;
      if (dx * dx + dy * dy < hitRadius * hitRadius) {
        onClickRef.current(node.name);
        return;
      }
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let hovering = false;
    for (const node of nodesRef.current) {
      const dx = mx - node.x;
      const dy = my - node.y;
      const hitRadius = node.radius + 20;
      if (dx * dx + dy * dy < hitRadius * hitRadius) {
        hovering = true;
        break;
      }
    }
    canvas.style.cursor = hovering ? 'pointer' : 'default';
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMouseMove);

    // Init dust particles
    const rect = canvas.getBoundingClientRect();
    dustRef.current = Array.from({ length: 120 }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      size: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.3 + 0.05,
      phase: Math.random() * Math.PI * 2,
    }));

    let rafId: number;

    const animate = () => {
      const r = canvas.getBoundingClientRect();
      const W = r.width;
      const H = r.height;
      const cx = W / 2;
      const cy = H / 2;
      timeRef.current += 0.016;
      const t = timeRef.current;

      ctx.clearRect(0, 0, W, H);

      // Background dust
      for (const d of dustRef.current) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = W;
        if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H;
        if (d.y > H) d.y = 0;
        const flicker = d.alpha + Math.sin(t * 2 + d.phase) * 0.08;
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0.02, flicker)})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update node positions — very slow, elegant drift
      const nodes = nodesRef.current;
      for (const node of nodes) {
        node.orbitAngle += node.orbitSpeed * 0.008;
        node.x = cx + Math.cos(node.orbitAngle) * node.orbitRadius;
        node.y = cy + Math.sin(node.orbitAngle) * node.orbitRadius * 0.4;
      }

      // Draw orbit paths — very subtle dashed ellipses
      for (const node of nodes) {
        ctx.strokeStyle = `rgba(255,255,255,0.03)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.beginPath();
        ctx.ellipse(cx, cy, node.orbitRadius, node.orbitRadius * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw connection lines between all nodes and center
      for (const node of nodes) {
        const isActive = activePillarRef.current === node.name;
        const lineAlpha = isActive ? 0.15 : 0.04;

        // Connection to center
        const grad = ctx.createLinearGradient(cx, cy, node.x, node.y);
        grad.addColorStop(0, `rgba(255,255,255,${lineAlpha})`);
        grad.addColorStop(0.5, hexToRgba(node.color, lineAlpha * 1.5));
        grad.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = isActive ? 1.5 : 0.8;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();
      }

      // Draw inter-node connections (fainter)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 250) {
            const alpha = (1 - dist / 250) * 0.03;
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw central hub — "Eternal"
      const centralPulse = 1 + Math.sin(t * 1.5) * 0.3;

      // Outer glow rings
      for (let ring = 3; ring >= 1; ring--) {
        const ringR = 18 + ring * 12;
        const ringAlpha = 0.025 * (4 - ring) * centralPulse;
        ctx.strokeStyle = `rgba(226, 55, 68, ${ringAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Central glow
      const cGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50);
      cGrad.addColorStop(0, `rgba(226, 55, 68, ${0.3 * centralPulse})`);
      cGrad.addColorStop(0.4, `rgba(226, 55, 68, ${0.1 * centralPulse})`);
      cGrad.addColorStop(1, 'rgba(226, 55, 68, 0)');
      ctx.fillStyle = cGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 50, 0, Math.PI * 2);
      ctx.fill();

      // Central dot
      ctx.fillStyle = '#E23744';
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Central label
      ctx.fillStyle = 'rgba(226, 55, 68, 0.6)';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ETERNAL', cx, cy + 28);

      // Draw pillar nodes
      for (const node of nodes) {
        const isActive = activePillarRef.current === node.name;
        const nodeScale = isActive ? 1.6 : 1;

        // Outer glow
        const nGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 5 * nodeScale);
        nGrad.addColorStop(0, hexToRgba(node.color, isActive ? 0.3 : 0.12));
        nGrad.addColorStop(0.5, hexToRgba(node.color, isActive ? 0.08 : 0.03));
        nGrad.addColorStop(1, hexToRgba(node.color, 0));
        ctx.fillStyle = nGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 5 * nodeScale, 0, Math.PI * 2);
        ctx.fill();

        // Ring
        ctx.strokeStyle = hexToRgba(node.color, isActive ? 0.6 : 0.25);
        ctx.lineWidth = isActive ? 1.5 : 1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * nodeScale + 4, 0, Math.PI * 2);
        ctx.stroke();

        // Core dot
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * nodeScale, 0, Math.PI * 2);
        ctx.fill();

        // Bright center
        ctx.fillStyle = `rgba(255,255,255,${isActive ? 0.8 : 0.5})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.35 * nodeScale, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = hexToRgba(node.color, isActive ? 0.9 : 0.6);
        ctx.font = `${isActive ? '12' : '11'}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(node.name.toUpperCase(), node.x, node.y + node.radius * nodeScale + 22);
      }

      // Scanning line effect (HUD feel)
      const scanY = cy + Math.sin(t * 0.5) * H * 0.35;
      const scanGrad = ctx.createLinearGradient(0, scanY - 1, 0, scanY + 1);
      scanGrad.addColorStop(0, 'rgba(226, 55, 68, 0)');
      scanGrad.addColorStop(0.5, 'rgba(226, 55, 68, 0.015)');
      scanGrad.addColorStop(1, 'rgba(226, 55, 68, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 20, W, 40);

      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleClick, handleMouseMove]);

  return (
    <div className="w-full h-[400px] md:h-[500px] relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        style={{ background: 'transparent' }}
      />
    </div>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
