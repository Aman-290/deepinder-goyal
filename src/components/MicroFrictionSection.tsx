import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Walking person SVG — legs alternate based on walkPhase (0–1)
function PersonSilhouette({ index, walkPhase = 0 }: { index: number; walkPhase?: number }) {
  const heights = [140, 130, 145, 125, 135];
  const h = heights[index % heights.length];
  const headY = 20;
  const shoulderY = 40;
  const bodyW = index % 2 === 0 ? 22 : 20;

  // Leg swing based on walkPhase — alternating left/right
  const legSwing = Math.sin(walkPhase * Math.PI * 4) * 12;
  const armSwing = Math.sin(walkPhase * Math.PI * 4) * 6;

  return (
    <svg width="60" height={h} viewBox={`0 0 60 ${h}`} className="overflow-visible">
      {/* Head */}
      <circle cx="30" cy={headY} r="10" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

      {/* Body / torso */}
      <path
        d={`M${30 - bodyW / 2} ${shoulderY} Q30 ${shoulderY - 4} ${30 + bodyW / 2} ${shoulderY} L${30 + bodyW / 2 + 2} ${h * 0.55} Q30 ${h * 0.58} ${30 - bodyW / 2 - 2} ${h * 0.55} Z`}
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
      />

      {/* Arms — swing opposite to legs */}
      <line x1={30 - bodyW / 2} y1={shoulderY + 2} x2={30 - bodyW / 2 - 8 + armSwing} y2={h * 0.48} stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />
      <line x1={30 + bodyW / 2} y1={shoulderY + 2} x2={30 + bodyW / 2 + 8 - armSwing} y2={h * 0.48} stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />

      {/* Legs — walk animation */}
      <line x1="26" y1={h * 0.55} x2={22 - legSwing} y2={h - 4} stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="34" y1={h * 0.55} x2={38 + legSwing} y2={h - 4} stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Subtle ground shadow */}
      <ellipse cx="30" cy={h - 2} rx="14" ry="2" fill="rgba(255,255,255,0.04)" />
    </svg>
  );
}

const QUEUE_PEOPLE = [
  { label: 'WAITING', delay: 0 },
  { label: 'WAITING', delay: 0.1 },
  { label: 'WAITING', delay: 0.2 },
  { label: 'WAITING', delay: 0.3 },
  { label: 'WAITING', delay: 0.4 },
];

export default function MicroFrictionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [walkPhase, setWalkPhase] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !panelRef.current) return;

    const ctx = gsap.context(() => {
      const panels = panelRef.current!;
      const scrollWidth = panels.scrollWidth - window.innerWidth;

      gsap.to(panels, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => '+=' + scrollWidth,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Walk phase drives the leg animation via scroll progress
      const walkProxy = { phase: 0 };
      gsap.to(walkProxy, {
        phase: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => '+=' + (scrollWidth * 0.6),
          scrub: true,
          onUpdate: () => setWalkPhase(walkProxy.phase),
        },
      });

      // People walk forward (translate left) then fade out as they "leave the queue"
      const people = containerRef.current!.querySelectorAll('.queue-person');
      people.forEach((person, i) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: () => '+=' + (scrollWidth * 0.6),
            scrub: true,
          },
        });

        // Each person walks forward (to the left) at staggered timing
        tl.to(person, {
          x: -(80 + i * 30),
          duration: 0.6,
          delay: i * 0.08,
          ease: 'power1.inOut',
        })
        // Then fades out as they walk off
        .to(person, {
          opacity: 0,
          y: -20,
          duration: 0.4,
          ease: 'power2.in',
        }, '>-0.15');
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative overflow-hidden">
      <div className="absolute top-6 left-6 z-10">
        <span className="hud-text text-muted/50 border border-line px-3 py-1">
          PHASE 1: THE MICRO-FRICTION (2008)
        </span>
      </div>

      <div ref={panelRef} className="flex h-screen">
        {/* Panel 1: The Queue Problem */}
        <div className="flex-shrink-0 w-screen h-full flex items-center px-8 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-7xl mx-auto">
            <div className="flex flex-col justify-center">
              <p className="hud-text text-zomato mb-4">SYS_LOG: ORIGIN_SPARK</p>
              <h2 className="text-5xl md:text-7xl font-display font-bold text-gradient mb-6">
                Bypassing<br />the Queue
              </h2>
              <p className="text-lg text-muted leading-relaxed font-mono">
                The origin story at Bain &amp; Company. The initial spark wasn't a grand vision,
                but the frustration of highly-paid consultants wasting time in physical queues
                just to read paper menus.
              </p>
            </div>

            <div className="flex items-end justify-center gap-3 md:gap-5">
              {QUEUE_PEOPLE.map((person, i) => (
                <div
                  key={i}
                  className="queue-person flex flex-col items-center"
                >
                  <PersonSilhouette index={i} walkPhase={walkPhase} />
                  <span className="hud-text text-zomato text-[10px] mt-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-zomato animate-pulse" />
                    {person.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 2: Transition Arrow */}
        <div className="flex-shrink-0 w-[50vw] h-full flex items-center justify-center">
          <div className="flex items-center gap-4">
            <ChevronRight className="text-zomato/30" size={40} />
            <ChevronRight className="text-zomato/50" size={40} />
            <ChevronRight className="text-zomato" size={40} />
          </div>
        </div>

        {/* Panel 3: The Solution */}
        <div className="flex-shrink-0 w-screen h-full flex items-center px-8 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-7xl mx-auto">
            <div className="relative glass rounded-xl p-4 max-w-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="hud-text text-muted/40 ml-4">Foodiebay.com</span>
              </div>
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src="/foodiebay-menus.png"
                  alt="Foodiebay interface"
                  className="w-full h-auto"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <p className="hud-text text-zomato mb-4">DEPLOY_LOG: FOODIEBAY.EXE</p>
              <h3 className="text-3xl md:text-5xl font-display font-bold text-gradient mb-4">
                The Solution
              </h3>
              <p className="text-lg text-muted leading-relaxed font-mono">
                A simple website that digitized restaurant menus. No delivery. No reviews.
                Just menus — accessible from any desk. The queue dissolved overnight.
              </p>
              <p className="hud-text text-muted/30 mt-8">
                // EPISODES: 0 → 1 // STATUS: FRICTION_ELIMINATED
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
