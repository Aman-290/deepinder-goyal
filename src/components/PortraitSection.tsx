// src/components/PortraitSection.tsx
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PortraitSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(imgRef.current, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.from(textRef.current!.children, {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center py-32 overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(226,55,68,0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden mb-8 border border-line">
        <img
          ref={imgRef}
          src="/deepinder-hero-portrait.png"
          alt="Deepinder Goyal"
          className="w-full h-[130%] object-cover object-top"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            const parent = target.parentElement!;
            parent.classList.add('flex', 'items-center', 'justify-center', 'bg-surface');
            parent.innerHTML = '<span class="text-6xl font-display font-bold text-gradient">DG</span>';
          }}
        />
      </div>

      <div ref={textRef} className="text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-gradient mb-3">
          Deepinder Goyal
        </h2>
        <p className="hud-text text-muted tracking-[0.2em] mb-2">
          FOUNDER // ETERNAL LIMITED
        </p>
        <p className="hud-text text-muted/40 text-[10px] tracking-[0.3em]">
          IIT DELHI '05 // EST. 2008 // NEW DELHI, INDIA
        </p>
      </div>
    </section>
  );
}
