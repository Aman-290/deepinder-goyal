import { useEffect, useState } from 'react';

const SECTION_IDS = [
  'hero',
  'portrait',
  'journey',
  'micro-friction',
  'eternal',
  'delivery-matrix',
  'timeline',
  'crucible',
  'flashcards',
  'frontier',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const SECTION_LABELS: Record<SectionId, string> = {
  hero: 'QUEUE',
  portrait: 'QUEUE',
  journey: 'CRUCIBLES',
  'micro-friction': 'FOODIEBAY',
  eternal: 'ETERNAL',
  'delivery-matrix': 'BLINKIT',
  timeline: 'TIMELINE',
  crucible: 'FRICTION',
  flashcards: 'MINDSET',
  frontier: 'FRONTIER',
};

export { SECTION_IDS };

export function useSectionObserver() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return activeSection;
}
