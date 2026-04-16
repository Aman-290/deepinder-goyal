import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function JourneySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to('.journey-bg-img', {
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.from('.journey-text-block', {
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative">
      <div className="px-6 md:px-12 pt-24 pb-8">
        <span className="hud-text text-muted/50 border border-line px-3 py-1">
          PHASE 0: THE DIRECTIONAL FOUNDATION
        </span>
      </div>

      <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/iit-delhi-campus.png"
            alt="IIT Delhi Campus"
            className="journey-bg-img w-full h-full object-cover scale-100"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-20">
          <h2 className="journey-text-block text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
            <span className="text-gradient">Formative</span><br />
            <span className="text-gradient">Crucibles</span>
          </h2>
          <div className="journey-text-block max-w-2xl">
            <p className="text-base md:text-lg text-muted leading-relaxed mb-4">
              Born in Muktsar, Punjab, Goyal's early life was punctuated by severe personal hurdles,
              most notably a pronounced struggle with stammering. These early experiences of vulnerability
              necessitated the rapid development of a resilient, internal locus of control.
            </p>
            <p className="text-base md:text-lg text-muted leading-relaxed">
              His academic journey led him to IIT Delhi, pursuing Mathematics and Computing.
              This rigorous discipline trained his mind to view the world not as static events,
              but as <span className="text-ink font-medium">complex optimization problems</span> awaiting efficiency.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="relative h-[50vh] overflow-hidden">
          <img
            src="/deepinder-early-days.png"
            alt="Deepinder Goyal early days"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/40 to-transparent" />
        </div>
        <div className="flex items-center p-8 md:p-16">
          <div className="journey-text-block">
            <p className="hud-text text-zomato mb-4">SYS_LOG: BAIN_ERA</p>
            <p className="text-lg md:text-xl text-muted leading-relaxed">
              At Bain & Company, a queue of highly-paid consultants wasting time to read paper menus
              became the catalyst. The friction was invisible to everyone else. To Goyal, it was
              <span className="text-ink font-medium"> an optimization problem screaming to be solved.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
