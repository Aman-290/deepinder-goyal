import { useRef, useEffect, useCallback } from 'react';

// Representing the ecosystem matrix nodes
interface NodeData {
  id: string;
  name: string;
  color: string;
  type: 'core' | 'satellite';
  nx: number; // Normalized x (0-1)
  ny: number; // Normalized y (0-1)
}

const NODES: NodeData[] = [
  { id: 'zomato', name: 'Zomato', color: '#E23744', type: 'core', nx: 0.5, ny: 0.35 },
  { id: 'blinkit', name: 'Blinkit', color: '#F8CB46', type: 'core', nx: 0.25, ny: 0.65 },
  { id: 'district', name: 'District', color: '#8A2BE2', type: 'core', nx: 0.5, ny: 0.8 },
  { id: 'hyperpure', name: 'Hyperpure', color: '#2E8B57', type: 'core', nx: 0.75, ny: 0.65 },
  // Auxiliary nodes for visual complexity
  { id: 'logistics_1', name: '', color: '#ffffff', type: 'satellite', nx: 0.25, ny: 0.35 },
  { id: 'logistics_2', name: '', color: '#ffffff', type: 'satellite', nx: 0.75, ny: 0.35 },
  { id: 'data_center_1', name: '', color: '#ffffff', type: 'satellite', nx: 0.15, ny: 0.5 },
  { id: 'data_center_2', name: '', color: '#ffffff', type: 'satellite', nx: 0.85, ny: 0.5 },
];

export default function EternalConstellation({
  activePillar,
  onPillarClick,
}: {
  activePillar: string | null;
  onPillarClick: (name: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const activeHoverRef = useRef<string | null>(null);

  // Keep references for animation loop
  const stateRef = useRef({
    active: activePillar,
    onClick: onPillarClick,
    width: 0,
    height: 0,
  });
  stateRef.current.active = activePillar;
  stateRef.current.onClick = onPillarClick;

  const getComputedPos = (n: NodeData, w: number, h: number) => ({
    x: n.nx * w,
    y: n.ny * h,
  });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let hovering = false;
    activeHoverRef.current = null;

    for (const node of NODES) {
      if (node.type !== 'core') continue;
      const pos = getComputedPos(node, rect.width, rect.height);
      const hitRadius = 30; // Diamond hit area
      if (Math.abs(mx - pos.x) + Math.abs(my - pos.y) < hitRadius * 1.5) {
        hovering = true;
        activeHoverRef.current = node.name;
        break;
      }
    }
    canvas.style.cursor = hovering ? 'pointer' : 'crosshair';
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (const node of NODES) {
      if (node.type !== 'core') continue;
      const pos = getComputedPos(node, rect.width, rect.height);
      if (Math.abs(mx - pos.x) + Math.abs(my - pos.y) < 45) {
        stateRef.current.onClick(node.name);
        return;
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      stateRef.current.width = rect.width;
      stateRef.current.height = rect.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    let rafId: number;

    const drawDiamond = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
    };

    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const w = stateRef.current.width;
      const h = stateRef.current.height;
      const activeName = stateRef.current.active;
      
      ctx.clearRect(0, 0, w, h);

      // Draw futuristic grid background
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      const offsetX = (t * 10) % gridSize;
      ctx.beginPath();
      for (let x = -offsetX; x < w; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // Core connection lines (Circuit board orthogonal style)
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1.5;
      
      const drawOrthoLine = (x1: number, y1: number, x2: number, y2: number) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1, (y1 + y2) / 2);
        ctx.lineTo(x2, (y1 + y2) / 2);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      };

      NODES.forEach((n1, i) => {
        NODES.slice(i + 1).forEach(n2 => {
           // Connect satellite to cores or nearby
           const p1 = getComputedPos(n1, w, h);
           const p2 = getComputedPos(n2, w, h);
           const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
           if (dist < h * 0.6) {
             drawOrthoLine(p1.x, p1.y, p2.x, p2.y);
           }
        });
      });

      // Data packets moving along lines
      ctx.fillStyle = '#ffffff';
      NODES.forEach((node) => {
        if (node.type !== 'core') return;
        const p = getComputedPos(node, w, h);
        const isActive = activeName === node.name;
        if (!isActive) return;

        // Stream pulses when active
        for (let i = 0; i < 4; i++) {
          const packetPhase = (t * 2 + i * (Math.PI / 2)) % (Math.PI * 2);
          const packetT = Math.sin(packetPhase) * 0.5 + 0.5; // Ping-pong 0 to 1
          
          NODES.forEach(target => {
            if (target === node) return;
            const pt = getComputedPos(target, w, h);
            // Trace orthogonal path
            const midY = (p.y + pt.y) / 2;
            let pktX, pktY;
            if (packetT < 0.5) {
              const dt = packetT * 2;
              pktX = p.x;
              pktY = p.y + (midY - p.y) * dt;
            } else {
              const dt = (packetT - 0.5) * 2;
              pktX = p.x + (pt.x - p.x) * dt;
              pktY = midY + (pt.y - midY) * dt;
            }

            ctx.fillStyle = hexToRgba(node.color, 0.8);
            ctx.shadowColor = node.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(pktX, pktY, 2.5, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowBlur = 0; // reset
          });
        }
      });

      // Draw Nodes
      for (const node of NODES) {
        const pos = getComputedPos(node, w, h);
        const isActive = activeName === node.name;
        const isHover = activeHoverRef.current === node.name;
        
        if (node.type === 'core') {
          const size = isActive ? 18 : (isHover ? 14 : 10);
          
          // Radar pulse around active node
          if (isActive) {
            const pSize = 18 + (t * 40) % 60;
            const pAlpha = 1 - ((pSize - 18) / 60);
            ctx.strokeStyle = hexToRgba(node.color, pAlpha * 0.5);
            ctx.lineWidth = 1;
            drawDiamond(ctx, pos.x, pos.y, pSize);
            ctx.stroke();
          }

          // Node body
          ctx.fillStyle = isActive ? node.color : 'rgba(25,25,25,0.8)';
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 2;
          
          drawDiamond(ctx, pos.x, pos.y, size);
          ctx.fill();
          ctx.stroke();

          // Label
          ctx.fillStyle = isActive ? '#fff' : hexToRgba(node.color, 0.7);
          ctx.font = `${isActive ? 'bold 12px' : '10px'} monospace`;
          ctx.textAlign = 'center';
          ctx.fillText(
            `SYS.${node.id.toUpperCase()}`, 
            pos.x, 
            pos.y + size + (isActive ? 16 : 12)
          );
          
        } else {
          // Satellite dots
          ctx.fillStyle = 'rgba(255,255,255,0.2)';
          drawDiamond(ctx, pos.x, pos.y, 4);
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [handleMouseMove, handleClick]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
