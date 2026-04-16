import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, Wrench, RefreshCw, GitMerge, DollarSign, Target, Building2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const LOG_ENTRIES = [
  { date: '2008.07', tag: 'INIT', tagColor: '#F8CB46', icon: Terminal, text: 'Foodiebay.exe deployed. Intranet menu digitization complete.' },
  { date: '2010.11', tag: 'REFACTOR', tagColor: '#F8CB46', icon: Wrench, text: 'Rebranded to Zomato. Global expansion protocols initiated to avoid eBay naming conflicts.' },
  { date: '2015.04', tag: 'PIVOT', tagColor: '#F8CB46', icon: RefreshCw, text: 'Last-mile logistics engine integrated. Transitioned from asset-light data business to capital-intensive delivery network.' },
  { date: '2020.01', tag: 'MERGE', tagColor: '#8A2BE2', icon: GitMerge, text: 'UberEats_India acquired. Market share optimized.' },
  { date: '2021.07', tag: 'EXECUTE', tagColor: '#2E8B57', icon: DollarSign, text: 'Historic IPO. Oversubscribed 35x. $12B valuation achieved. Public market scrutiny engaged.' },
  { date: '2022.06', tag: 'ACQUIRE', tagColor: '#F8CB46', icon: Target, text: 'Blinkit integrated. Quick-commerce matrix established despite intense market skepticism.' },
  { date: '2025.01', tag: 'RESTRUCTURE', tagColor: '#E23744', icon: Building2, text: 'Eternal Limited holding company formed. Systemic risk isolated. Decentralized leadership empowered.' },
];

export default function SystemLogTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (lineRef.current) {
        const lineHeight = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, {
          strokeDasharray: lineHeight,
          strokeDashoffset: lineHeight,
        });
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 40%',
            end: 'bottom 60%',
            scrub: true,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>('.timeline-card').forEach((card, i) => {
        const fromLeft = i % 2 === 0;
        gsap.from(card, {
          x: fromLeft ? -60 : 60,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('.timeline-node').forEach((node) => {
        gsap.from(node, {
          scale: 0,
          duration: 0.5,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: node,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-40 px-4">
      <div className="text-center mb-20">
        <span className="hud-text text-zomato border border-zomato/30 px-3 py-1 inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-zomato" />
          SYSTEM LOG: EVOLUTIONARY ARCS
        </span>
        <h2 className="text-5xl md:text-7xl font-display font-bold mt-6">
          <span className="text-gradient">Timeline</span>
          {' '}
          <span className="text-gradient-zomato">Execution</span>
        </h2>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <svg className="absolute left-1/2 -translate-x-px top-0 h-full w-1 overflow-visible" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="0" y2="100%" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
          <line ref={lineRef} x1="0" y1="0" x2="0" y2="100%" stroke="url(#timeline-gradient)" strokeWidth="2" />
          <defs>
            <linearGradient id="timeline-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E23744" />
              <stop offset="50%" stopColor="#F8CB46" />
              <stop offset="100%" stopColor="#8A2BE2" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative space-y-16 md:space-y-24">
          {LOG_ENTRIES.map((entry, i) => {
            const isLeft = i % 2 === 0;
            const Icon = entry.icon;
            return (
              <div key={entry.date} className={`relative flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`timeline-card w-[calc(50%-2rem)] ${isLeft ? 'pr-4 text-right' : 'pl-4 text-left'}`}>
                  <div className="glass rounded-lg p-5 hover:border-line/30 transition-colors group">
                    <span className="hud-text text-xs inline-flex items-center gap-1.5 px-2 py-0.5 rounded border mb-3" style={{ color: entry.tagColor, borderColor: entry.tagColor + '33' }}>
                      <Icon size={12} />
                      {entry.tag}
                    </span>
                    <p className="text-muted leading-relaxed font-mono text-sm">{entry.text}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 z-10">
                  <div className="timeline-node w-4 h-4 rounded-full border-2 bg-bg" style={{ borderColor: entry.tagColor }} />
                </div>
                <div className={`w-[calc(50%-2rem)] ${isLeft ? 'pl-8' : 'pr-8 text-right'}`}>
                  <span className="hud-text text-muted/40 text-sm">[{entry.date}]</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
