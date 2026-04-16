// src/components/DeliveryRiderDay.tsx
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bike, MapPin, Clock, IndianRupee } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const RIDER_STATS = [
  { icon: Bike, value: '47', unit: 'km', label: 'Distance Traveled' },
  { icon: MapPin, value: '12', unit: 'orders', label: 'Deliveries Made' },
  { icon: Clock, value: '9', unit: 'hrs', label: 'Shift Duration' },
  { icon: IndianRupee, value: '830', unit: '', label: 'Total Earned' },
];

export default function DeliveryRiderDay() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.rider-stat-value', {
        textContent: 0,
        duration: 2,
        ease: 'power2.out',
        snap: { textContent: 1 },
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.rider-stats',
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from('.rider-quote', {
        y: 40,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.rider-quote',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="warm-section py-24 md:py-40 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <p className="hud-text tracking-[0.3em] mb-6" style={{ color: 'var(--warm-accent)' }}>
          THE DAY THE CEO BECAME A RIDER
        </p>
        <h3 className="text-4xl md:text-6xl font-display font-bold mb-6" style={{ color: 'var(--warm-text)' }}>
          Walking the<br />Last Mile
        </h3>
        <p className="text-lg max-w-2xl leading-relaxed mb-16" style={{ color: 'var(--warm-muted)' }}>
          In 2024, Deepinder Goyal and his wife Grecia spent a full day as Zomato delivery riders.
          No cameras planned. No PR team. Just a bike, a bag, and the reality of the gig economy
          experienced firsthand.
        </p>

        <div className="rider-stats grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {RIDER_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="p-6 rounded-lg border" style={{ borderColor: 'rgba(201, 122, 58, 0.2)', background: 'rgba(201, 122, 58, 0.05)' }}>
                <Icon size={20} style={{ color: 'var(--warm-accent)' }} className="mb-3" />
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="rider-stat-value text-3xl md:text-4xl font-display font-bold" style={{ color: 'var(--warm-text)' }}>
                    {stat.value}
                  </span>
                  <span className="hud-text text-sm">{stat.unit}</span>
                </div>
                <p className="hud-text text-xs">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="rider-quote max-w-3xl mx-auto text-center py-12 border-t border-b" style={{ borderColor: 'rgba(201,122,58,0.15)' }}>
          <p className="text-2xl md:text-3xl font-display leading-relaxed italic" style={{ color: 'var(--warm-text)' }}>
            "For centuries, class divides kept the labor of the poor invisible to the rich.
            Technology is changing that — making the invisible, visible."
          </p>
          <p className="hud-text mt-6" style={{ color: 'var(--warm-accent)' }}>
            — DEEPINDER GOYAL
          </p>
        </div>
      </div>
    </section>
  );
}
