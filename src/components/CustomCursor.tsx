// src/components/CustomCursor.tsx
import { useEffect, useRef, useState } from 'react';
import { useSectionObserver, type SectionId } from '../hooks/useSectionObserver';

const SECTION_CURSOR_STYLE: Partial<Record<SectionId, string>> = {
  timeline: 'crosshair',
  frontier: 'glow',
};

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const activeSection = useSectionObserver();
  const cursorStyle = SECTION_CURSOR_STYLE[activeSection] || '';

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.body.classList.add('custom-cursor-active');

    const onMove = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, [data-cursor-hover]')) {
        setHovering(true);
      }
    };

    const onOut = () => setHovering(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mouseout', onOut, { passive: true });

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <div
      ref={dotRef}
      className={`cursor-dot ${hovering ? 'hovering' : ''} ${cursorStyle}`}
    />
  );
}
