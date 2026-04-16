# The Calculus of Conviction — Elevation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Deepinder Goyal tribute website from informative to experiential — top 1% immersive web experience with 3D scenes, GSAP scroll animations, spatial storytelling, and emotional narrative arc.

**Architecture:** Replace the Motion-only scroll system with GSAP ScrollTrigger for pinning/scrubbing and Lenis for smooth scroll physics. Add Spline/R3F for 3D hero and constellation scenes. Keep Motion for entrance animations and AnimatePresence. Progressive enhancement — every 3D/advanced feature has a 2D fallback.

**Tech Stack:** React 19, Vite 6, Tailwind CSS 4, GSAP + ScrollTrigger, Lenis, @splinetool/react-spline, @react-three/fiber + drei, Howler.js (optional audio), Motion (existing)

---

## File Structure

### New Files to Create
- `src/providers/SmoothScrollProvider.tsx` — Lenis smooth scroll wrapper
- `src/components/ScrollProgressBar.tsx` — Narrative journey progress indicator
- `src/components/CustomCursor.tsx` — Section-aware custom cursor
- `src/components/PortraitSection.tsx` — Full-viewport Goyal portrait
- `src/components/EternalConstellation.tsx` — 3D solar system business visualization
- `src/components/DeliveryRiderDay.tsx` — Emotional empathy section (warm tones)
- `src/components/GravityBrainViz.tsx` — Canvas particle brain visualization
- `src/components/RubberBand.tsx` — Interactive rubber band for flashcards
- `src/components/AmbientSound.tsx` — Opt-in sound controller
- `src/hooks/useGSAPScrollTrigger.ts` — Shared GSAP+Lenis setup hook
- `src/hooks/useSectionObserver.ts` — Intersection observer for active section tracking
- `src/utils/textSplitter.ts` — Character/word splitting for reveal animations

### Files to Modify
- `package.json` — Add new dependencies
- `src/main.tsx` — Wrap with SmoothScrollProvider
- `src/App.tsx` — Add new sections, cursor, progress bar, sound controller
- `src/index.css` — New utility classes, cursor styles, warm palette, animations
- `src/components/HeroSection.tsx` — Spline 3D integration + fallback
- `src/components/JourneySection.tsx` — Full-bleed photography + Ken Burns
- `src/components/MicroFrictionSection.tsx` — GSAP horizontal scroll + queue animation
- `src/components/EternalConglomerateSection.tsx` — Link to 3D constellation
- `src/components/DeliveryMatrixGame.tsx` — Clock, confetti, sound hooks
- `src/components/SystemLogTimeline.tsx` — SVG line-draw + alternating cards
- `src/components/CrucibleSection.tsx` — Add Delivery Rider Day subsection
- `src/components/FounderFlashcards.tsx` — Rubber band integration
- `src/components/FrontierSection.tsx` — Brain visualization integration
- `src/components/EasterEggs.tsx` — Add 9-digit easter egg

---

## PHASE 1: Foundation Layer

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install all new packages**

```bash
npm install gsap @gsap/react lenis @splinetool/react-spline @react-three/fiber @react-three/drei three howler
```

- [ ] **Step 2: Install type definitions**

```bash
npm install -D @types/three
```

- [ ] **Step 3: Verify build still works**

Run: `npx vite build 2>&1 | tail -5`
Expected: Build succeeds with no errors

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add GSAP, Lenis, Spline, R3F, Howler dependencies"
```

---

### Task 2: Lenis Smooth Scroll Provider

**Files:**
- Create: `src/providers/SmoothScrollProvider.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Create the SmoothScrollProvider**

```tsx
// src/providers/SmoothScrollProvider.tsx
import { ReactNode, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 2: Wrap app in provider**

Modify `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SmoothScrollProvider from './providers/SmoothScrollProvider'
import App from './App.tsx'
import 'lenis/dist/lenis.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SmoothScrollProvider>
      <App />
    </SmoothScrollProvider>
  </StrictMode>,
)
```

- [ ] **Step 3: Verify smooth scroll works**

Run: `npx vite --port 5199`
Expected: Page scrolls with smooth physics instead of native scroll. All existing sections still render.

- [ ] **Step 4: Commit**

```bash
git add src/providers/SmoothScrollProvider.tsx src/main.tsx
git commit -m "feat: add Lenis smooth scroll with GSAP ScrollTrigger sync"
```

---

### Task 3: GSAP + Lenis Hook

**Files:**
- Create: `src/hooks/useGSAPScrollTrigger.ts`

- [ ] **Step 1: Create shared hook**

```ts
// src/hooks/useGSAPScrollTrigger.ts
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Returns a ref to attach to a section container.
 * Calls `onSetup(container, ScrollTrigger)` once mounted so each
 * component can create its own triggers without boilerplate.
 */
export function useGSAPSection(
  onSetup: (container: HTMLElement) => gsap.core.Timeline | gsap.core.Tween | ScrollTrigger | void,
  deps: unknown[] = []
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      onSetup(containerRef.current!);
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useGSAPScrollTrigger.ts
git commit -m "feat: add useGSAPSection hook for ScrollTrigger integration"
```

---

### Task 4: Section Observer Hook

**Files:**
- Create: `src/hooks/useSectionObserver.ts`

- [ ] **Step 1: Create intersection observer hook for tracking active section**

```ts
// src/hooks/useSectionObserver.ts
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
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useSectionObserver.ts
git commit -m "feat: add section observer hook for scroll progress tracking"
```

---

### Task 5: Scroll Narrative Progress Bar

**Files:**
- Create: `src/components/ScrollProgressBar.tsx`

- [ ] **Step 1: Create the progress bar component**

```tsx
// src/components/ScrollProgressBar.tsx
import { useSectionObserver, SECTION_IDS, SECTION_LABELS, type SectionId } from '../hooks/useSectionObserver';

// Deduplicate labels for the progress bar display
const PROGRESS_NODES: { id: SectionId; label: string }[] = [];
const seenLabels = new Set<string>();
for (const id of SECTION_IDS) {
  const label = SECTION_LABELS[id];
  if (!seenLabels.has(label)) {
    seenLabels.add(label);
    PROGRESS_NODES.push({ id, label });
  }
}

export default function ScrollProgressBar() {
  const activeSection = useSectionObserver();
  const activeIdx = PROGRESS_NODES.findIndex(
    (n) => SECTION_LABELS[activeSection] === n.label
  );

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-1 px-4 py-2 glass rounded-full">
      {PROGRESS_NODES.map((node, i) => {
        const isActive = i === activeIdx;
        const isPast = i < activeIdx;
        return (
          <div key={node.id} className="flex items-center">
            {i > 0 && (
              <div
                className="w-6 h-px mx-1 transition-colors duration-500"
                style={{
                  backgroundColor: isPast || isActive
                    ? 'rgba(226, 55, 68, 0.6)'
                    : 'rgba(255,255,255,0.1)',
                }}
              />
            )}
            <button
              onClick={() => {
                document.getElementById(node.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hud-text transition-all duration-500"
              style={{
                fontSize: '9px',
                letterSpacing: '0.15em',
                color: isActive
                  ? '#E23744'
                  : isPast
                    ? 'rgba(226, 55, 68, 0.5)'
                    : 'rgba(255,255,255,0.3)',
                textShadow: isActive ? '0 0 10px rgba(226,55,68,0.4)' : 'none',
              }}
            >
              {node.label}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: Verify renders correctly**

Run dev server, check top of page — should see a glassmorphic pill with section labels. Clicking a label scrolls to that section.

- [ ] **Step 3: Commit**

```bash
git add src/components/ScrollProgressBar.tsx
git commit -m "feat: add scroll narrative progress bar with section tracking"
```

---

### Task 6: Custom Cursor

**Files:**
- Create: `src/components/CustomCursor.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Add cursor-none utility and cursor styles to CSS**

Add to `src/index.css` after the existing custom classes:

```css
/* Custom cursor */
@media (pointer: fine) {
  .custom-cursor-active {
    cursor: none !important;
  }
  .custom-cursor-active * {
    cursor: none !important;
  }
}

.cursor-dot {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #E23744;
  transform: translate(-50%, -50%);
  transition: width 0.2s, height 0.2s, background 0.3s;
  mix-blend-mode: difference;
}

.cursor-dot.hovering {
  width: 32px;
  height: 32px;
  background: rgba(226, 55, 68, 0.3);
  border: 1px solid rgba(226, 55, 68, 0.6);
}

.cursor-dot.crosshair {
  width: 2px;
  height: 20px;
  border-radius: 0;
  background: rgba(226, 55, 68, 0.5);
  box-shadow: -9px 9px 0 -8px rgba(226,55,68,0.5),
              9px -9px 0 -8px rgba(226,55,68,0.5),
              -9px -9px 0 -8px transparent,
              9px 9px 0 -8px transparent;
}

.cursor-dot.glow {
  width: 16px;
  height: 16px;
  background: rgba(138, 43, 226, 0.4);
  box-shadow: 0 0 20px rgba(138, 43, 226, 0.3);
}
```

- [ ] **Step 2: Create CustomCursor component**

```tsx
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
    // Detect touch device — disable cursor
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

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
    };
  }, []);

  // Don't render on touch devices
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
```

- [ ] **Step 3: Verify cursor works**

Run dev server, move mouse — red dot follows. Hover over buttons — expands. Scroll to timeline — becomes crosshair. Scroll to frontier — becomes purple glow.

- [ ] **Step 4: Commit**

```bash
git add src/components/CustomCursor.tsx src/index.css
git commit -m "feat: add section-aware custom cursor with hover states"
```

---

### Task 7: Text Splitter Utility

**Files:**
- Create: `src/utils/textSplitter.ts`

- [ ] **Step 1: Create text splitting utility for reveal animations**

```ts
// src/utils/textSplitter.ts
import { type ReactNode, createElement } from 'react';

/**
 * Splits text into individual word spans for staggered reveal animations.
 * Each word gets a `data-word-index` attribute for GSAP targeting.
 */
export function splitWords(text: string, className = ''): ReactNode[] {
  return text.split(' ').map((word, i) =>
    createElement(
      'span',
      {
        key: i,
        className: `inline-block overflow-hidden ${className}`,
        'data-word-index': i,
      },
      createElement(
        'span',
        { className: 'inline-block word-reveal', style: { transform: 'translateY(100%)' } },
        word
      ),
      // Add space after each word except last
      i < text.split(' ').length - 1 ? '\u00A0' : ''
    )
  );
}

/**
 * Animates a counter from 0 to target value.
 * Returns a cleanup function.
 */
export function animateCounter(
  element: HTMLElement,
  target: number,
  duration = 2000,
  suffix = ''
): () => void {
  let start = 0;
  const startTime = performance.now();
  let rafId: number;

  function update(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    start = Math.round(target * eased);
    element.textContent = `${start.toLocaleString()}${suffix}`;

    if (progress < 1) {
      rafId = requestAnimationFrame(update);
    }
  }

  rafId = requestAnimationFrame(update);
  return () => cancelAnimationFrame(rafId);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/textSplitter.ts
git commit -m "feat: add text splitter utility for word-reveal animations"
```

---

### Task 8: Wire Foundation into App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add section IDs and new components to App.tsx**

Read current App.tsx, then modify it to:
1. Add `id` attributes to each section wrapper for IntersectionObserver targeting
2. Import and render `ScrollProgressBar` and `CustomCursor`
3. Add the new `PortraitSection` placeholder (empty div for now — built in Phase 2)

Replace the contents of `src/App.tsx` with:

```tsx
import HeroSection from './components/HeroSection'
import PortraitSection from './components/PortraitSection'
import JourneySection from './components/JourneySection'
import MicroFrictionSection from './components/MicroFrictionSection'
import EternalConglomerateSection from './components/EternalConglomerateSection'
import DeliveryMatrixGame from './components/DeliveryMatrixGame'
import SystemLogTimeline from './components/SystemLogTimeline'
import CrucibleSection from './components/CrucibleSection'
import FounderFlashcards from './components/FounderFlashcards'
import FrontierSection from './components/FrontierSection'
import EasterEggs from './components/EasterEggs'
import ScrollProgressBar from './components/ScrollProgressBar'
import CustomCursor from './components/CustomCursor'

function App() {
  return (
    <div className="bg-bg text-ink min-h-screen font-sans overflow-x-hidden">
      <CustomCursor />
      <ScrollProgressBar />
      <EasterEggs />

      <div id="hero">
        <HeroSection />
      </div>
      <div id="portrait">
        <PortraitSection />
      </div>
      <div id="journey">
        <JourneySection />
      </div>
      <div id="micro-friction">
        <MicroFrictionSection />
      </div>
      <div id="eternal">
        <EternalConglomerateSection />
      </div>
      <div id="delivery-matrix">
        <DeliveryMatrixGame />
      </div>
      <div id="timeline">
        <SystemLogTimeline />
      </div>
      <div id="crucible">
        <CrucibleSection />
      </div>
      <div id="flashcards">
        <FounderFlashcards />
      </div>
      <div id="frontier">
        <FrontierSection />
      </div>

      {/* Footer */}
      <footer className="relative py-20 text-center border-t border-line">
        <p className="hud-text text-zomato mb-2">/// END OF LOG</p>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-gradient mb-4">
          THE CALCULUS OF CONVICTION
        </h2>
        <p className="hud-text text-muted">
          SYSTEM OPTIMIZED // DEEPINDER GOYAL
        </p>
        <p className="hud-text text-muted/50 mt-8">
          BUILT BY FORCE AT{' '}
          <a href="#" className="text-zomato hover:underline">Brokai Labs</a>
        </p>
      </footer>
    </div>
  )
}

export default App
```

- [ ] **Step 2: Create placeholder PortraitSection**

```tsx
// src/components/PortraitSection.tsx
export default function PortraitSection() {
  return <section className="min-h-screen" />;
}
```

- [ ] **Step 3: Verify app still renders**

Run: `npx vite --port 5199`
Expected: All sections render. Progress bar visible at top. Custom cursor active on desktop.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/components/PortraitSection.tsx
git commit -m "feat: wire foundation components into App — progress bar, cursor, section IDs"
```

---

## PHASE 2: Hero Transformation

### Task 9: Spline 3D Hero Scene Integration

**Files:**
- Modify: `src/components/HeroSection.tsx`

- [ ] **Step 1: Refactor HeroSection with Spline integration + canvas fallback**

The Spline scene URL will be a placeholder until the 3D scene is designed in Spline's editor. The key is wiring up scroll-driven events and providing the canvas particle fallback.

Read the current `src/components/HeroSection.tsx` fully, then replace with:

```tsx
// src/components/HeroSection.tsx
import { useRef, useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Lazy load Spline to avoid blocking initial render
const Spline = lazy(() =>
  import('@splinetool/react-spline').then((mod) => ({ default: mod.default }))
);

// ── Canvas Particle Fallback (existing system, cleaned up) ──────────
class Particle {
  x: number; y: number; vx: number; vy: number;
  targetX: number; targetY: number;
  color: string; size: number;

  constructor(canvasW: number, canvasH: number, gridX: number, gridY: number) {
    this.x = Math.random() * canvasW;
    this.y = Math.random() * canvasH;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.targetX = gridX;
    this.targetY = gridY;
    this.color = Math.random() > 0.7 ? '#E23744' : '#555555';
    this.size = Math.random() * 2 + 1;
  }

  update(progress: number, canvasW: number, canvasH: number) {
    if (progress < 0.1) {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvasW) this.vx *= -1;
      if (this.y < 0 || this.y > canvasH) this.vy *= -1;
    } else {
      const ease = Math.min((progress - 0.1) / 0.9, 1);
      this.x += (this.targetX - this.x) * ease * 0.05;
      this.y += (this.targetY - this.y) * ease * 0.05;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function CanvasFallback({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  const initParticles = useCallback((w: number, h: number) => {
    const cols = 40, rows = 20;
    const particles: Particle[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const gx = (c / (cols - 1)) * w;
        const gy = (r / (rows - 1)) * h;
        particles.push(new Particle(w, h, gx, gy));
      }
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.fillStyle = 'rgba(3, 3, 3, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef.current) {
        p.update(progress, canvas.width, canvas.height);
        p.draw(ctx);
      }
      // Draw connections at high progress
      if (progress > 0.5) {
        ctx.strokeStyle = `rgba(226, 55, 68, ${(progress - 0.5) * 0.1})`;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particlesRef.current.length; i++) {
          for (let j = i + 1; j < Math.min(i + 10, particlesRef.current.length); j++) {
            const a = particlesRef.current[i], b = particlesRef.current[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            if (dx * dx + dy * dy < 2500) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [progress, initParticles]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ── Typing Animation ────────────────────────────────────────────────
function useTypingAnimation(text: string, speed = 80) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

// ── Main Hero Component ─────────────────────────────────────────────
export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const { displayed, done } = useTypingAnimation('DREAM WITHOUT ACTION IS HALLUCINATION.');

  // GSAP ScrollTrigger for hero scroll progress
  useEffect(() => {
    if (!containerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        setProgress(self.progress);
      },
    });

    return () => trigger.kill();
  }, []);

  // SPLINE_SCENE_URL: Replace with your actual Spline scene URL once designed
  const SPLINE_SCENE_URL = '';

  return (
    <section
      ref={containerRef}
      className="relative h-[200vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 3D Scene or Canvas Fallback */}
        {SPLINE_SCENE_URL && !splineError ? (
          <Suspense fallback={<CanvasFallback progress={progress} />}>
            <Spline
              scene={SPLINE_SCENE_URL}
              onLoad={() => setSplineLoaded(true)}
              onError={() => setSplineError(true)}
              className="absolute inset-0 w-full h-full"
            />
            {/* Show canvas while Spline loads */}
            {!splineLoaded && <CanvasFallback progress={progress} />}
          </Suspense>
        ) : (
          <CanvasFallback progress={progress} />
        )}

        {/* HUD Overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-4"
          style={{ opacity: Math.max(0, 1 - progress * 2.5) }}
        >
          {/* System label */}
          <p className="hud-text text-muted mb-6 tracking-[0.3em]">
            SYSTEMIC ANNIHILATION OF FRICTION
          </p>

          {/* Main quote */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-display font-bold leading-[0.9] text-center max-w-6xl">
            {displayed}
            {!done && (
              <span className="inline-block w-[3px] h-[0.8em] bg-zomato ml-1 animate-pulse" />
            )}
          </h1>

          {/* Scroll CTA */}
          <p
            className="hud-text text-muted/50 mt-12 tracking-[0.2em]"
            style={{ opacity: done ? 1 : 0, transition: 'opacity 1s' }}
          >
            SCROLL TO OPTIMIZE →
          </p>
        </div>

        {/* Corner HUD elements */}
        <div className="absolute top-4 left-4 hud-text text-muted/30 text-[10px]">
          <div>SYS.OPT V2.0</div>
          <div>LAT: 28.6139° N</div>
          <div>LON: 77.2090° E</div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify hero renders with canvas fallback**

Run dev server. Hero should show typing animation, particle canvas, and fade out on scroll. Since SPLINE_SCENE_URL is empty, it uses the canvas fallback.

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat: refactor hero with Spline 3D integration, GSAP scroll, canvas fallback"
```

---

### Task 10: Portrait Section

**Files:**
- Modify: `src/components/PortraitSection.tsx`

- [ ] **Step 1: Build full-viewport portrait section**

```tsx
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
      // Parallax on portrait image
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

      // Text reveal
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
      {/* Subtle radial glow behind portrait */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(226,55,68,0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Portrait */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden mb-8 border border-line">
        <img
          ref={imgRef}
          src="/deepinder-hero-portrait.png"
          alt="Deepinder Goyal"
          className="w-full h-[130%] object-cover object-top"
          onError={(e) => {
            // Fallback: show initials
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.classList.add(
              'flex', 'items-center', 'justify-center', 'bg-surface'
            );
            e.currentTarget.parentElement!.innerHTML =
              '<span class="text-6xl font-display font-bold text-gradient">DG</span>';
          }}
        />
      </div>

      {/* Name and details */}
      <div ref={textRef} className="text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-gradient mb-3">
          Deepinder Goyal
        </h2>
        <p className="hud-text text-muted tracking-[0.2em] mb-2">
          FOUNDER // ETERNAL LIMITED
        </p>
        <p className="hud-text text-muted/40 text-[10px] tracking-[0.3em]">
          IIT DELHI &apos;05 // EST. 2008 // NEW DELHI, INDIA
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify portrait section renders**

Run dev server, scroll past hero. Should see a circular portrait with name and HUD details below.

- [ ] **Step 3: Commit**

```bash
git add src/components/PortraitSection.tsx
git commit -m "feat: add full-viewport portrait section with parallax and text reveal"
```

---

## PHASE 3: Section-by-Section Elevation

### Task 11: Journey Section — Full-Bleed Photography + Ken Burns

**Files:**
- Modify: `src/components/JourneySection.tsx`

- [ ] **Step 1: Read current JourneySection.tsx**

Read `src/components/JourneySection.tsx` fully.

- [ ] **Step 2: Rewrite with full-bleed photography and GSAP animations**

Replace contents with:

```tsx
// src/components/JourneySection.tsx
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function JourneySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Ken Burns slow zoom on background image
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

      // Text blocks stagger in
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
      {/* Phase label */}
      <div className="px-6 md:px-12 pt-24 pb-8">
        <span className="hud-text text-muted/50 border border-line px-3 py-1">
          PHASE 0: THE DIRECTIONAL FOUNDATION
        </span>
      </div>

      {/* Full-bleed IIT Delhi image with text overlay */}
      <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/iit-delhi-campus.png"
            alt="IIT Delhi Campus"
            className="journey-bg-img w-full h-full object-cover scale-100"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
        </div>

        {/* Text content at bottom of image */}
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

      {/* Early days image — editorial style */}
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
```

- [ ] **Step 3: Verify renders correctly**

Run dev server, scroll to Journey section. Should see full-bleed IIT Delhi image with text overlaid, Ken Burns zoom effect on scroll.

- [ ] **Step 4: Commit**

```bash
git add src/components/JourneySection.tsx
git commit -m "feat: elevate JourneySection with full-bleed photography and Ken Burns effect"
```

---

### Task 12: MicroFriction — GSAP Horizontal Scroll

**Files:**
- Modify: `src/components/MicroFrictionSection.tsx`

- [ ] **Step 1: Read current MicroFrictionSection.tsx**

Read `src/components/MicroFrictionSection.tsx` fully.

- [ ] **Step 2: Rewrite with GSAP ScrollTrigger pin + scrub**

Replace contents with:

```tsx
// src/components/MicroFrictionSection.tsx
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, ChevronRight, Monitor } from 'lucide-react';

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

      // Pin the section and scrub horizontally
      gsap.to(panels, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${scrollWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Animate queue people walking away as scroll progresses
      gsap.to('.queue-person', {
        y: -80,
        opacity: 0,
        stagger: 0.05,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${scrollWidth * 0.5}`,
          scrub: true,
        },
      });

      // Foodiebay mockup boot-up sequence
      gsap.from('.mockup-boot', {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.5,
        scrollTrigger: {
          trigger: '.foodiebay-panel',
          start: 'left center',
          containerAnimation: gsap.getById?.('horizontal') || undefined,
          toggleActions: 'play none none reverse',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative overflow-hidden">
      {/* Phase label — visible before scroll locks */}
      <div className="absolute top-6 left-6 z-10">
        <span className="hud-text text-muted/50 border border-line px-3 py-1">
          PHASE 1: THE MICRO-FRICTION (2008)
        </span>
      </div>

      {/* Horizontal scroll panels */}
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
                The origin story at Bain & Company. The initial spark wasn't a grand vision,
                but the frustration of highly-paid consultants wasting time in physical queues
                just to read paper menus.
              </p>
            </div>

            {/* Queue visualization */}
            <div className="flex items-end justify-center gap-4">
              {QUEUE_PEOPLE.map((person, i) => (
                <div
                  key={i}
                  className="queue-person flex flex-col items-center"
                  style={{ animationDelay: `${person.delay}s` }}
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

        {/* Panel 2: The Arrow / Transition */}
        <div className="flex-shrink-0 w-[50vw] h-full flex items-center justify-center">
          <div className="flex items-center gap-4">
            <ChevronRight className="text-zomato/30" size={40} />
            <ChevronRight className="text-zomato/50" size={40} />
            <ChevronRight className="text-zomato" size={40} />
          </div>
        </div>

        {/* Panel 3: The Solution — Foodiebay */}
        <div className="foodiebay-panel flex-shrink-0 w-screen h-full flex items-center px-8 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-7xl mx-auto">
            {/* Mockup */}
            <div className="relative glass rounded-xl p-4 max-w-lg">
              {/* macOS chrome */}
              <div className="mockup-boot flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="hud-text text-muted/40 ml-4">Foodiebay.com</span>
              </div>
              {/* Content */}
              <div className="mockup-boot relative rounded-lg overflow-hidden">
                <img
                  src="/foodiebay-menus.png"
                  alt="Foodiebay interface"
                  className="w-full h-auto"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                {/* Scanline effect */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <p className="mockup-boot hud-text text-zomato mb-4">
                DEPLOY_LOG: FOODIEBAY.EXE
              </p>
              <h3 className="mockup-boot text-3xl md:text-5xl font-display font-bold text-gradient mb-4">
                The Solution
              </h3>
              <p className="mockup-boot text-lg text-muted leading-relaxed font-mono">
                A simple website that digitized restaurant menus. No delivery. No reviews.
                Just menus — accessible from any desk. The queue dissolved overnight.
              </p>
              <p className="mockup-boot hud-text text-muted/30 mt-8">
                // EPISODES: 0 → 1 // STATUS: FRICTION_ELIMINATED
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify horizontal scroll**

Run dev server. The MicroFriction section should pin in place while user scrolls, panning horizontally through the queue → arrow → Foodiebay panels. Queue people should animate upward and fade out.

- [ ] **Step 4: Commit**

```bash
git add src/components/MicroFrictionSection.tsx
git commit -m "feat: rewrite MicroFriction with GSAP pin+scrub horizontal scroll"
```

---

### Task 13: Eternal Conglomerate — 3D Constellation

**Files:**
- Create: `src/components/EternalConstellation.tsx`
- Modify: `src/components/EternalConglomerateSection.tsx`

- [ ] **Step 1: Create the 3D constellation component**

```tsx
// src/components/EternalConstellation.tsx
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface PillarData {
  name: string;
  color: string;
  orbitRadius: number;
  size: number;
  speed: number;
  stat: string;
  description: string;
}

const PILLARS: PillarData[] = [
  { name: 'Zomato', color: '#E23744', orbitRadius: 3, size: 0.4, speed: 0.3, stat: '24M+', description: 'Monthly Active Customers' },
  { name: 'Blinkit', color: '#F8CB46', orbitRadius: 4.5, size: 0.5, speed: 0.5, stat: '<10m', description: 'Delivery in Minutes' },
  { name: 'District', color: '#8A2BE2', orbitRadius: 2, size: 0.3, speed: 0.4, stat: '20%', description: 'of Eternal Business' },
  { name: 'Hyperpure', color: '#2E8B57', orbitRadius: 3.5, size: 0.35, speed: 0.2, stat: '300K+', description: 'Restaurant Partners' },
];

function Planet({ pillar, onClick, isActive }: { pillar: PillarData; onClick: () => void; isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    angleRef.current += delta * pillar.speed * 0.5;
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(angleRef.current) * pillar.orbitRadius;
      meshRef.current.position.z = Math.sin(angleRef.current) * pillar.orbitRadius;
      meshRef.current.position.y = Math.sin(angleRef.current * 2) * 0.3;
    }
  });

  return (
    <Float speed={2} floatIntensity={0.3}>
      <mesh ref={meshRef} onClick={onClick} scale={isActive ? 1.5 : 1}>
        <sphereGeometry args={[pillar.size, 32, 32]} />
        <meshStandardMaterial
          color={pillar.color}
          emissive={pillar.color}
          emissiveIntensity={isActive ? 0.8 : 0.3}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </Float>
  );
}

function OrbitRing({ radius, color }: { radius: number; color: string }) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={color} opacity={0.15} transparent />
    </line>
  );
}

function CentralOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#E23744"
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

export default function EternalConstellation({
  activePillar,
  onPillarClick,
}: {
  activePillar: string | null;
  onPillarClick: (name: string) => void;
}) {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 5, 8], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#E23744" />

        <CentralOrb />

        {PILLARS.map((pillar) => (
          <group key={pillar.name}>
            <OrbitRing radius={pillar.orbitRadius} color={pillar.color} />
            <Planet
              pillar={pillar}
              isActive={activePillar === pillar.name}
              onClick={() => onPillarClick(pillar.name)}
            />
          </group>
        ))}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Integrate constellation into EternalConglomerateSection**

Read current `src/components/EternalConglomerateSection.tsx`, then modify it to import and render the constellation. Add a `useState` for `activePillar` and wire it to both the constellation and the existing data display.

At the top of EternalConglomerateSection.tsx, add:

```tsx
import { lazy, Suspense } from 'react';
const EternalConstellation = lazy(() => import('./EternalConstellation'));
```

Then in the JSX, replace the existing pillar buttons layout with a two-column layout:
- Left column: 3D constellation (with Suspense fallback being the existing button list)
- Right column: Active pillar data display (keep existing)

The exact edit depends on the current file structure — read it first and surgically add the constellation above or alongside the existing pillar selector.

- [ ] **Step 3: Verify 3D constellation renders**

Run dev server, scroll to Eternal section. Should see orbiting planets with click-to-select. Fallback shows existing buttons while Canvas loads.

- [ ] **Step 4: Commit**

```bash
git add src/components/EternalConstellation.tsx src/components/EternalConglomerateSection.tsx
git commit -m "feat: add 3D Eternal constellation with orbiting business unit planets"
```

---

### Task 14: Enhanced Delivery Matrix Game

**Files:**
- Modify: `src/components/DeliveryMatrixGame.tsx`

- [ ] **Step 1: Read current DeliveryMatrixGame.tsx**

Read `src/components/DeliveryMatrixGame.tsx` fully (404 lines).

- [ ] **Step 2: Add countdown clock, confetti, and visual enhancements**

This is a surgical modification — add these features to the existing game:

1. **Countdown clock**: Add a large "10:00" display that counts down from 10 minutes (visual only, ticks faster than real time for dramatic effect — 1 game second = 6 real-world seconds displayed)
2. **Confetti on success**: When game completes with score > 10, trigger a CSS particle burst
3. **Glitch on failure**: When friction hits 100%, apply a CSS glitch animation to the whole section

Add this CSS to `src/index.css`:

```css
/* Confetti burst */
@keyframes confetti-fall {
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}

.confetti-particle {
  position: fixed;
  width: 8px;
  height: 8px;
  top: 0;
  animation: confetti-fall 2s ease-in forwards;
  pointer-events: none;
  z-index: 100;
}

/* Glitch effect */
@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-3px, 3px); }
  40% { transform: translate(3px, -3px); }
  60% { transform: translate(-2px, -2px); }
  80% { transform: translate(2px, 2px); }
  100% { transform: translate(0); }
}

.glitch-active {
  animation: glitch 0.3s ease-in-out 3;
}
```

In the DeliveryMatrixGame component, add:
- A `<div className="text-4xl md:text-6xl font-mono text-center text-blinkit font-bold">` showing the countdown time formatted as `MM:SS`
- On game over with high score: spawn 30 absolutely-positioned colored divs with confetti-fall animation
- On game over with failure: add `glitch-active` class to the section container

The exact edits are surgical additions to the existing 404-line file — read it first, identify the game state JSX, and add the clock display and game-over effects.

- [ ] **Step 3: Verify enhancements**

Run dev server, play the game. Should see countdown timer. Complete the game successfully → confetti. Let friction hit 100% → glitch effect.

- [ ] **Step 4: Commit**

```bash
git add src/components/DeliveryMatrixGame.tsx src/index.css
git commit -m "feat: enhance delivery game with countdown clock, confetti, and glitch effects"
```

---

### Task 15: System Log Timeline — SVG Line Draw + Alternating Cards

**Files:**
- Modify: `src/components/SystemLogTimeline.tsx`

- [ ] **Step 1: Read current SystemLogTimeline.tsx**

Read `src/components/SystemLogTimeline.tsx` fully.

- [ ] **Step 2: Replace Motion-based timeline with GSAP SVG line-draw**

Rewrite the vertical timeline line as an SVG path with `stroke-dasharray` + `stroke-dashoffset` animated by GSAP ScrollTrigger. Cards should alternate left/right instead of all being on the right.

Replace contents with:

```tsx
// src/components/SystemLogTimeline.tsx
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
      // SVG line draw animation
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

      // Stagger cards in from alternating sides
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

      // Node pulse on enter
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
      {/* Section header */}
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

      {/* Timeline container */}
      <div className="relative max-w-5xl mx-auto">
        {/* SVG center line */}
        <svg
          className="absolute left-1/2 -translate-x-px top-0 h-full w-1 overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Background track */}
          <line x1="0" y1="0" x2="0" y2="100%" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
          {/* Animated fill line */}
          <line
            ref={lineRef}
            x1="0" y1="0" x2="0" y2="100%"
            stroke="url(#timeline-gradient)"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="timeline-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E23744" />
              <stop offset="50%" stopColor="#F8CB46" />
              <stop offset="100%" stopColor="#8A2BE2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Log entries */}
        <div className="relative space-y-16 md:space-y-24">
          {LOG_ENTRIES.map((entry, i) => {
            const isLeft = i % 2 === 0;
            const Icon = entry.icon;

            return (
              <div
                key={entry.date}
                className={`relative flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Card */}
                <div className={`timeline-card w-[calc(50%-2rem)] ${isLeft ? 'pr-4 text-right' : 'pl-4 text-left'}`}>
                  <div className="glass rounded-lg p-5 hover:border-line/30 transition-colors group">
                    <span
                      className="hud-text text-xs inline-flex items-center gap-1.5 px-2 py-0.5 rounded border mb-3"
                      style={{
                        color: entry.tagColor,
                        borderColor: `${entry.tagColor}33`,
                      }}
                    >
                      <Icon size={12} />
                      {entry.tag}
                    </span>
                    <p className="text-muted leading-relaxed font-mono text-sm">
                      {entry.text}
                    </p>
                  </div>
                </div>

                {/* Center node */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10">
                  <div
                    className="timeline-node w-4 h-4 rounded-full border-2 bg-bg"
                    style={{ borderColor: entry.tagColor }}
                  />
                </div>

                {/* Date on opposite side */}
                <div className={`w-[calc(50%-2rem)] ${isLeft ? 'pl-8' : 'pr-8 text-right'}`}>
                  <span className="hud-text text-muted/40 text-sm">
                    [{entry.date}]
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify timeline renders**

Run dev server. Cards should alternate left/right. SVG line draws as you scroll. Nodes pop in with spring animation.

- [ ] **Step 4: Commit**

```bash
git add src/components/SystemLogTimeline.tsx
git commit -m "feat: rewrite timeline with SVG line-draw and alternating card layout"
```

---

### Task 16: Delivery Rider Day — Emotional Peak Section

**Files:**
- Create: `src/components/DeliveryRiderDay.tsx`
- Modify: `src/components/CrucibleSection.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Add warm palette CSS**

Add to `src/index.css`:

```css
/* Warm documentary palette */
.warm-section {
  --warm-bg: #1a1410;
  --warm-text: #e8ddd0;
  --warm-muted: #9c8b7a;
  --warm-accent: #c97a3a;
  background: var(--warm-bg);
  color: var(--warm-text);
}

.warm-section .hud-text {
  color: var(--warm-muted);
}
```

- [ ] **Step 2: Create DeliveryRiderDay component**

```tsx
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
      // Stats count up
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

      // Quote fade in
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
        {/* Section intro */}
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

        {/* Stats grid */}
        <div className="rider-stats grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {RIDER_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-6 rounded-lg border"
                style={{
                  borderColor: 'rgba(201, 122, 58, 0.2)',
                  background: 'rgba(201, 122, 58, 0.05)',
                }}
              >
                <Icon size={20} style={{ color: 'var(--warm-accent)' }} className="mb-3" />
                <div className="flex items-baseline gap-1 mb-1">
                  <span
                    className="rider-stat-value text-3xl md:text-4xl font-display font-bold"
                    style={{ color: 'var(--warm-text)' }}
                  >
                    {stat.value}
                  </span>
                  <span className="hud-text text-sm" style={{ color: 'var(--warm-muted)' }}>
                    {stat.unit}
                  </span>
                </div>
                <p className="hud-text text-xs" style={{ color: 'var(--warm-muted)' }}>
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* The quote — emotional peak */}
        <div className="rider-quote max-w-3xl mx-auto text-center py-12 border-t border-b" style={{ borderColor: 'rgba(201,122,58,0.15)' }}>
          <p
            className="text-2xl md:text-3xl font-display leading-relaxed italic"
            style={{ color: 'var(--warm-text)' }}
          >
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
```

- [ ] **Step 3: Import DeliveryRiderDay into CrucibleSection**

Read `src/components/CrucibleSection.tsx`. Add at the bottom of the component's return JSX, after the existing Crucible content:

```tsx
import DeliveryRiderDay from './DeliveryRiderDay';
// ... at end of CrucibleSection JSX:
<DeliveryRiderDay />
```

- [ ] **Step 4: Verify warm section renders**

Run dev server. After the Crucible section, should see a warm-toned section with rider stats and the quote.

- [ ] **Step 5: Commit**

```bash
git add src/components/DeliveryRiderDay.tsx src/components/CrucibleSection.tsx src/index.css
git commit -m "feat: add Delivery Rider Day emotional section with warm documentary palette"
```

---

### Task 17: Founder Flashcards — Rubber Band Interaction

**Files:**
- Create: `src/components/RubberBand.tsx`
- Modify: `src/components/FounderFlashcards.tsx`

- [ ] **Step 1: Create the RubberBand component**

```tsx
// src/components/RubberBand.tsx
import { useRef, useState, useCallback } from 'react';

interface RubberBandProps {
  onSnap: () => void;
}

export default function RubberBand({ onSnap }: RubberBandProps) {
  const bandRef = useRef<HTMLDivElement>(null);
  const [stretch, setStretch] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);

  const handleStart = useCallback((clientY: number) => {
    setIsDragging(true);
    startYRef.current = clientY;
  }, []);

  const handleMove = useCallback((clientY: number) => {
    if (!isDragging) return;
    const delta = Math.max(0, clientY - startYRef.current);
    setStretch(Math.min(delta, 100));
  }, [isDragging]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (stretch > 40) {
      // Snap!
      setStretch(0);
      onSnap();
      // Quick vibration if supported
      navigator.vibrate?.(50);
    } else {
      setStretch(0);
    }
  }, [isDragging, stretch, onSnap]);

  return (
    <div
      className="flex flex-col items-center select-none touch-none cursor-grab active:cursor-grabbing"
      onMouseDown={(e) => handleStart(e.clientY)}
      onMouseMove={(e) => handleMove(e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      <p className="hud-text text-muted/40 text-[10px] mb-2">PULL TO SNAP → NEXT CARD</p>
      <div
        ref={bandRef}
        className="relative w-20 transition-transform"
        style={{
          transform: `scaleY(${1 + stretch / 100})`,
          transformOrigin: 'top center',
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Rubber band SVG */}
        <svg viewBox="0 0 80 24" className="w-full">
          <ellipse
            cx="40" cy="12" rx="36" ry="8"
            fill="none"
            stroke={stretch > 40 ? '#E23744' : '#666'}
            strokeWidth="3"
            style={{
              transition: isDragging ? 'none' : 'stroke 0.3s',
            }}
          />
        </svg>
      </div>
      {stretch > 40 && (
        <p className="hud-text text-zomato text-[10px] mt-1 animate-pulse">RELEASE</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Integrate into FounderFlashcards**

Read `src/components/FounderFlashcards.tsx`. Add the rubber band below the card stack. Wire `onSnap` to the existing card cycling function. Import:

```tsx
import RubberBand from './RubberBand';
```

Add `<RubberBand onSnap={cycleCard} />` below the flashcard deck in the JSX, where `cycleCard` is the existing function that moves the front card to the back.

- [ ] **Step 3: Verify rubber band interaction**

Run dev server. Pull the rubber band down past the threshold and release — it should snap back and cycle to the next flashcard.

- [ ] **Step 4: Commit**

```bash
git add src/components/RubberBand.tsx src/components/FounderFlashcards.tsx
git commit -m "feat: add interactive rubber band to flashcards section"
```

---

### Task 18: Frontier Section — Gravity Brain Visualization

**Files:**
- Create: `src/components/GravityBrainViz.tsx`
- Modify: `src/components/FrontierSection.tsx`

- [ ] **Step 1: Create canvas-based brain particle visualization**

```tsx
// src/components/GravityBrainViz.tsx
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Simple brain outline as an array of point clusters
const BRAIN_POINTS: [number, number][] = [];
// Generate a brain-shaped point cloud (ellipse with irregular bumps)
for (let i = 0; i < 200; i++) {
  const angle = (i / 200) * Math.PI * 2;
  const rx = 120 + Math.sin(angle * 3) * 20 + Math.sin(angle * 7) * 10;
  const ry = 90 + Math.cos(angle * 2) * 15 + Math.cos(angle * 5) * 8;
  BRAIN_POINTS.push([
    Math.cos(angle) * rx + (Math.random() - 0.5) * 40,
    Math.sin(angle) * ry + (Math.random() - 0.5) * 30,
  ]);
}
// Fill interior
for (let i = 0; i < 150; i++) {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.random() * 80;
  BRAIN_POINTS.push([
    Math.cos(angle) * r + (Math.random() - 0.5) * 20,
    Math.sin(angle) * r * 0.75 + (Math.random() - 0.5) * 15,
  ]);
}

interface BloodParticle {
  x: number;
  y: number;
  baseY: number;
  speed: number;
  size: number;
  brightness: number;
}

export default function GravityBrainViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const [templeActive, setTempleActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const W = 400, H = 300;
    canvas.width = W;
    canvas.height = H;
    const cx = W / 2, cy = H / 2;

    // Blood particles
    const particles: BloodParticle[] = Array.from({ length: 80 }, () => ({
      x: cx + (Math.random() - 0.5) * 200,
      y: cy + (Math.random() - 0.5) * 160,
      baseY: 0,
      speed: 0.3 + Math.random() * 0.7,
      size: 1 + Math.random() * 2,
      brightness: 0.5 + Math.random() * 0.5,
    }));
    particles.forEach(p => p.baseY = p.y);

    // ScrollTrigger for progress
    const trigger = ScrollTrigger.create({
      trigger: canvas.parentElement,
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        setTempleActive(self.progress > 0.6);
      },
    });

    let rafId: number;
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      const progress = progressRef.current;
      const gravityEffect = progress < 0.6 ? progress / 0.6 : 1 - (progress - 0.6) / 0.4;
      const reversed = progress > 0.6;

      // Draw brain outline points
      for (const [bx, by] of BRAIN_POINTS) {
        ctx.fillStyle = `rgba(138, 43, 226, ${0.08 + (reversed ? 0.1 : 0)})`;
        ctx.beginPath();
        ctx.arc(cx + bx, cy + by, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Animate blood particles
      for (const p of particles) {
        if (reversed) {
          // Temple active: particles flow upward, brighten
          p.y -= p.speed * 1.5;
          if (p.y < cy - 80) p.y = cy + 80;
          p.brightness = Math.min(1, p.brightness + 0.01);
        } else {
          // Gravity pulls blood down, particles slow at top
          p.y += p.speed * gravityEffect * 0.8;
          if (p.y > cy + 80) p.y = cy - 80;
          // Dim particles at the top
          const verticalPos = (p.y - (cy - 80)) / 160;
          p.brightness = 0.2 + verticalPos * 0.6 * (1 - gravityEffect * 0.5);
        }

        const alpha = p.brightness;
        ctx.fillStyle = reversed
          ? `rgba(226, 55, 68, ${alpha})`
          : `rgba(226, 55, 68, ${alpha * (1 - gravityEffect * 0.4)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Temple device indicator
      if (reversed) {
        ctx.strokeStyle = 'rgba(138, 43, 226, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx + 130, cy - 20, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(138, 43, 226, 0.3)';
        ctx.fill();
      }

      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      trigger.kill();
    };
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full max-w-md mx-auto"
        style={{ aspectRatio: '4/3' }}
      />
      {templeActive && (
        <p className="hud-text text-center mt-2 text-[10px]" style={{ color: '#8A2BE2' }}>
          TEMPLE DEVICE ACTIVE // BLOOD FLOW RESTORED
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Integrate into FrontierSection**

Read `src/components/FrontierSection.tsx`. Add the brain visualization inside the Continue Research / brain card. Import:

```tsx
import GravityBrainViz from './GravityBrainViz';
```

Place `<GravityBrainViz />` inside the brain research card, replacing or supplementing the static image.

- [ ] **Step 3: Verify brain visualization**

Run dev server. Scroll to Frontier section. The brain should show particles slowing/dimming from gravity, then reversing when Temple activates.

- [ ] **Step 4: Commit**

```bash
git add src/components/GravityBrainViz.tsx src/components/FrontierSection.tsx
git commit -m "feat: add gravity aging brain visualization with Temple reversal effect"
```

---

## PHASE 4: Polish & Micro-Interactions

### Task 19: Magnetic Tilt Cards + Cursor Glow

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add magnetic tilt and cursor-glow CSS**

Add to `src/index.css`:

```css
/* Magnetic tilt card */
.magnetic-card {
  transform-style: preserve-3d;
  perspective: 800px;
  transition: transform 0.1s ease-out;
}

.magnetic-card .card-inner {
  transition: transform 0.3s ease-out;
}

/* Cursor glow effect on cards */
.cursor-glow {
  position: relative;
  overflow: hidden;
}

.cursor-glow::before {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(226, 55, 68, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s;
}

.cursor-glow:hover::before {
  opacity: 1;
}
```

- [ ] **Step 2: Add magnetic tilt JS to existing glass cards**

Create a lightweight function that can be applied to any card element. Add this to `src/index.css` as a pure CSS approach first. The actual JS tilt tracking will be added to specific components that benefit most (EternalConglomerate pillar cards, timeline cards).

For the components that use `.glass` class, add `cursor-glow` class alongside it. This is a find-and-replace in the components modified in previous tasks.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add magnetic tilt and cursor glow CSS utilities"
```

---

### Task 20: 9-Digit Phone Number Easter Egg

**Files:**
- Modify: `src/components/EasterEggs.tsx`

- [ ] **Step 1: Read current EasterEggs.tsx**

Read `src/components/EasterEggs.tsx` fully.

- [ ] **Step 2: Add the 9-digit easter egg**

Add a new element to the EasterEggs component. Find a stat somewhere on the page (the "24M+" in EternalConglomerateSection works well) and add a companion element in EasterEggs that, when active, shows a tooltip.

Alternatively, add the easter egg as a standalone fixed element — a small number displayed somewhere subtle (like near the karma counter) that reads "24,000,00+" (missing a digit). On click/hover:

```tsx
// Add inside the EasterEggs component's return JSX:
<div className="fixed bottom-4 left-4 z-50 group">
  <span className="hud-text text-muted/20 text-[10px] cursor-pointer hover:text-muted/60 transition-colors">
    USR_COUNT: 24,000,00+
  </span>
  <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
    <div className="glass rounded-lg px-4 py-3 max-w-xs">
      <p className="text-xs text-ink mb-1">You caught that missing digit.</p>
      <p className="text-[10px] text-muted">
        Deepinder once caught a 9-digit phone number on Shark Tank.
        He'd be proud of your attention to detail.
      </p>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Verify easter egg**

Run dev server. Look at bottom-left corner — subtle number visible. Hover over it to see the tooltip.

- [ ] **Step 4: Commit**

```bash
git add src/components/EasterEggs.tsx
git commit -m "feat: add 9-digit phone number easter egg tribute"
```

---

### Task 21: Ambient Sound Controller

**Files:**
- Create: `src/components/AmbientSound.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create ambient sound controller**

```tsx
// src/components/AmbientSound.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Howl } from 'howler';
import { useSectionObserver, type SectionId } from '../hooks/useSectionObserver';

// Audio files — these need to be created/sourced and placed in /public/audio/
// For now, this component gracefully handles missing files
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

  // Preload audio files
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

  // Crossfade between section audio
  useEffect(() => {
    if (!enabled) return;

    const newSrc = SECTION_AUDIO[activeSection] || null;
    if (newSrc === currentRef.current) return;

    // Fade out current
    if (currentRef.current) {
      const oldHowl = howlsRef.current.get(currentRef.current);
      if (oldHowl) {
        oldHowl.fade(oldHowl.volume(), 0, 1000);
        setTimeout(() => oldHowl.stop(), 1000);
      }
    }

    // Fade in new
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
      // Stop all audio
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
```

- [ ] **Step 2: Add AmbientSound to App.tsx**

Import and add `<AmbientSound />` inside the App component, after `<EasterEggs />`.

- [ ] **Step 3: Verify sound toggle renders**

Run dev server. Speaker icon should appear at bottom-right. Clicking toggles between muted/enabled states. Audio playback depends on audio files existing in `/public/audio/` — component handles missing files gracefully.

- [ ] **Step 4: Commit**

```bash
git add src/components/AmbientSound.tsx src/App.tsx
git commit -m "feat: add opt-in ambient sound controller with section-based crossfading"
```

---

### Task 22: Image Optimization

**Files:**
- Modify: Multiple component files

- [ ] **Step 1: Add lazy loading to all below-fold images**

In every component that renders `<img>` tags (JourneySection, MicroFrictionSection, EternalConglomerateSection, FrontierSection), add `loading="lazy"` to images that are below the initial viewport.

The hero portrait in PortraitSection should NOT be lazy (it's the first image the user sees after the hero).

- [ ] **Step 2: Convert images to WebP (if tools available)**

Run: `which cwebp` — if available, convert all PNG images:

```bash
for f in public/*.png; do cwebp -q 80 "$f" -o "${f%.png}.webp"; done
```

If cwebp is not available, skip this step — the PNG images work fine, this is an optimization.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "perf: add lazy loading to below-fold images"
```

---

### Task 23: View Transitions for Eternal Pillar Switcher

**Files:**
- Modify: `src/components/EternalConglomerateSection.tsx`

- [ ] **Step 1: Add View Transition API to pillar switching**

In the pillar switching logic of EternalConglomerateSection.tsx, wrap the state change in `document.startViewTransition()`:

```tsx
const handlePillarClick = (name: string) => {
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      setActivePillar(name);
    });
  } else {
    setActivePillar(name);
  }
};
```

Add to `src/index.css`:

```css
/* View Transition for pillar switcher */
::view-transition-old(pillar-data) {
  animation: fade-out 0.2s ease-out;
}
::view-transition-new(pillar-data) {
  animation: fade-in 0.3s ease-in;
}
@keyframes fade-out {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.98); }
}
@keyframes fade-in {
  from { opacity: 0; transform: scale(1.02); }
  to { opacity: 1; transform: scale(1); }
}
```

And on the data display div, add: `style={{ viewTransitionName: 'pillar-data' }}`

- [ ] **Step 2: Verify transition works**

Run dev server in Chrome (View Transitions require Chrome 111+). Click between pillars — should see smooth crossfade instead of hard swap.

- [ ] **Step 3: Commit**

```bash
git add src/components/EternalConglomerateSection.tsx src/index.css
git commit -m "feat: add View Transitions API for pillar switcher crossfade"
```

---

### Task 24: Final Integration & Cleanup

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Ensure all section IDs are correct and ordered**

Verify `src/App.tsx` has all sections in the correct narrative order:
1. hero → portrait → journey → micro-friction → eternal → delivery-matrix → timeline → crucible → flashcards → frontier

- [ ] **Step 2: Remove any unused imports from Motion that were replaced by GSAP**

Check each modified component for `useScroll`, `useTransform`, `useMotionValueEvent` imports from `motion/react` that are no longer used. Remove them.

- [ ] **Step 3: Test full page scroll end-to-end**

Run dev server and scroll through the entire page. Check:
- Lenis smooth scroll feels right
- Progress bar updates as you scroll
- Custom cursor changes per section
- Hero typing + particle canvas works
- Portrait section renders with parallax
- Journey has full-bleed images with Ken Burns
- MicroFriction pins and scrolls horizontally
- Eternal constellation renders (or fallback)
- Delivery game works with clock
- Timeline draws SVG line with alternating cards
- Crucible + Delivery Rider Day renders with warm tones
- Flashcards + rubber band interaction works
- Frontier brain viz animates on scroll
- Easter eggs work (9-digit, garage, billboard)
- Sound toggle appears and toggles state

- [ ] **Step 4: Fix any visual issues found during testing**

Address any layout breaks, z-index conflicts, or animation timing issues discovered.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: final integration cleanup and unused import removal"
```

---

## Summary

| Phase | Tasks | What It Delivers |
|-------|-------|-----------------|
| 1: Foundation | Tasks 1-8 | Lenis scroll, GSAP integration, progress bar, custom cursor, text utilities |
| 2: Hero | Tasks 9-10 | Spline 3D hero (with fallback), full-viewport portrait section |
| 3: Sections | Tasks 11-18 | Full-bleed photography, GSAP horizontal scroll, 3D constellation, enhanced game, SVG timeline, delivery rider day, rubber band, brain viz |
| 4: Polish | Tasks 19-24 | Magnetic cards, easter egg, ambient sound, image optimization, view transitions, cleanup |
