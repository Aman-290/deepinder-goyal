import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Howl } from 'howler';
import { useSectionObserver, type SectionId } from '../hooks/useSectionObserver';

const SECTION_AUDIO: Partial<Record<SectionId, string>> = {
  hero: '/audio/ambient-hum.mp3',
  'micro-friction': '/audio/crowd-murmur.mp3',
  'delivery-matrix': '/audio/clock-tick.mp3',
  frontier: '/audio/space-ambient.mp3',
};

export default function AmbientSound() {
  const [enabled, setEnabled] = useState(false);
  const activeSection = useSectionObserver();
  const howlsRef = useRef<Map<string, Howl>>(new Map());
  const currentRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    for (const [, src] of Object.entries(SECTION_AUDIO)) {
      if (!howlsRef.current.has(src)) {
        const howl = new Howl({
          src: [src],
          loop: true,
          volume: 0,
          preload: true,
        });
        howlsRef.current.set(src, howl);
      }
    }

    return () => {
      howlsRef.current.forEach((h) => h.unload());
      howlsRef.current.clear();
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const newSrc = SECTION_AUDIO[activeSection] || null;
    if (newSrc === currentRef.current) return;

    if (currentRef.current) {
      const oldHowl = howlsRef.current.get(currentRef.current);
      if (oldHowl) {
        oldHowl.fade(oldHowl.volume(), 0, 1000);
        setTimeout(() => oldHowl.stop(), 1000);
      }
    }

    if (newSrc) {
      const newHowl = howlsRef.current.get(newSrc);
      if (newHowl) {
        newHowl.play();
        newHowl.fade(0, 0.15, 1000);
      }
    }

    currentRef.current = newSrc;
  }, [activeSection, enabled]);

  const toggle = useCallback(() => {
    if (enabled) {
      howlsRef.current.forEach((h) => h.stop());
      currentRef.current = null;
    }
    setEnabled(!enabled);
  }, [enabled]);

  return (
    <button
      onClick={toggle}
      className="fixed bottom-4 right-4 z-50 glass rounded-full p-3 hover:border-line/30 transition-colors group"
      aria-label={enabled ? 'Mute ambient sound' : 'Enable ambient sound'}
      data-cursor-hover
    >
      {enabled ? (
        <Volume2 size={16} className="text-zomato" />
      ) : (
        <VolumeX size={16} className="text-muted/40 group-hover:text-muted" />
      )}
    </button>
  );
}
