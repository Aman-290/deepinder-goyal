import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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

      gsap.to('.queue-person', {
        y: -80,
        opacity: 0,
        stagger: 0.05,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => '+=' + (scrollWidth * 0.5),
          scrub: true,
        },
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

            <div className="flex items-end justify-center gap-4">
              {QUEUE_PEOPLE.map((person, i) => (
                <div
                  key={i}
                  className="queue-person flex flex-col items-center"
                >
                  <div className="w-16 h-24 md:w-20 md:h-32 rounded-lg border border-line/30 bg-surface flex flex-col items-center justify-center gap-2">
                    <Users size={20} className="text-muted/40" />
                    <div className="w-8 h-1 bg-line rounded" />
                    <div className="w-6 h-1 bg-line rounded" />
                  </div>
                  <span className="hud-text text-zomato/60 text-[10px] mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-zomato/60" />
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
