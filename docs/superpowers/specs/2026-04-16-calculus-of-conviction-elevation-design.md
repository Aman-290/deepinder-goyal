# PRD: The Calculus of Conviction — Top 1% Elevation

**Date:** 2026-04-16
**Status:** Approved
**Goal:** Transform a solid tribute website into a top 1% Awwwards-level immersive experience for Deepinder Goyal.

---

## 1. Project Context

**Current Stack:** React 19 + Vite 6 + Tailwind CSS 4 + Motion (Framer Motion) + Lucide Icons
**Current State:** 10 component sections, dark HUD/terminal aesthetic, canvas particle hero, horizontal scroll origin story, interactive delivery grid game, glassmorphic cards throughout.
**Subject:** Deepinder Goyal — founder of Zomato/Eternal, IIT Delhi M.Tech grad, systems thinker, now exploring longevity science (Continue Research / Temple) and aerospace (LAT).

---

## 2. Core Problem

The site is *informative* but not *experiential*. It tells you about Goyal rather than making you feel his journey. Visual monotony (dark cards on dark bg), weak imagery, no spatial depth, and long passive stretches between interactive moments prevent it from reaching top 1%.

---

## 3. Design Principles

1. **Friction-to-Flow** — Every section should embody Goyal's core philosophy: eliminating friction. Visual metaphors should move from disorder → order, chaos → clarity.
2. **Spatial Storytelling** — Use 3D depth, parallax layers, and camera movement to create physical space, not flat pages.
3. **Emotional Arc** — Build empathy (origin), create tension (scale challenges), deliver catharsis (frontier vision).
4. **Breathing Rhythm** — Alternate between dense interactive sections and full-bleed photographic pauses.
5. **Earned Interactivity** — Every interactive moment should teach something about Goyal's world.

---

## 4. New Dependencies

| Package | Purpose |
|---------|---------|
| `@splinetool/react-spline` | 3D scenes (hero, constellation) |
| `gsap` + `@gsap/react` | ScrollTrigger pinning, scrub, timeline sequencing |
| `lenis` | Smooth scroll physics |
| `@react-three/fiber` + `@react-three/drei` | Fallback 3D / brain visualization |
| `howler` (optional) | Ambient sound design |

---

## 5. Phases & Features

### PHASE 1: Foundation Layer (Scroll, Typography, Rhythm)

**1A. Lenis Smooth Scroll Integration**
- Install `lenis`, wrap app in Lenis provider
- Sync Lenis with GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`
- Replace all `motion` useScroll hooks with GSAP ScrollTrigger equivalents where pinning/scrubbing is needed
- Keep Motion for entrance animations and AnimatePresence

**1B. Scroll Narrative Progress Bar**
- Replace hazard-stripe top bar with a horizontal journey indicator
- Nodes: `[QUEUE] → [FOODIEBAY] → [ZOMATO] → [IPO] → [ETERNAL] → [FRONTIER]`
- Each node lights up (opacity + scale + color) as user passes through that section
- Fixed position, glassmorphic background, subtle — not distracting
- Uses Intersection Observer or GSAP ScrollTrigger to track active section

**1C. Custom Cursor System**
- Default: Small red dot with faint particle trail
- Timeline sections: Crosshair cursor
- Frontier section: Soft blue/purple glow
- Interactive elements: Scale up on hover
- Implementation: CSS `cursor: none` + absolutely positioned div tracking `mousemove`
- Mobile: disabled entirely (touch devices)

**1D. Text Reveal Animations**
- Section headers: Word-by-word or character-by-character reveal on viewport entry
- Stats (24M+, <10m, etc.): Animated number counter roll-up
- Body text: Fade-up with slight Y-translate, staggered by line
- Use GSAP SplitText or manual character splitting with staggered tweens

---

### PHASE 2: Hero Transformation

**2A. Spline 3D Hero Scene — "The Queue That Changed Everything"**
- **Scene:** Stylized office cafeteria. A queue of 5-6 abstract human silhouettes standing before a counter with paper menus on the wall.
- **Scroll interaction:** As user scrolls (0-100% of hero section):
  - 0-30%: Camera is static, particles float, typing animation plays "DREAM WITHOUT ACTION IS HALLUCINATION."
  - 30-60%: Camera slowly dollies forward through the queue. Silhouettes begin to fade/dissolve.
  - 60-90%: Paper menus on the wall morph into glowing digital screens. A phone floats up from the counter showing a Foodiebay-style UI.
  - 90-100%: Scene fully transitions — queue gone, single glowing screen remains. Text transitions to "SYSTEMIC ANNIHILATION OF FRICTION" as the subtitle.
- **Fallback:** If Spline scene fails to load, keep current canvas particle system as graceful degradation.
- **Technical:** `@splinetool/react-spline` with scroll progress mapped to Spline event triggers. Scene hosted on Spline CDN.
- **Note:** Spline scene must be designed in Spline's editor (requires manual design work). Implementation will set up the React integration, scroll binding, and fallback. Placeholder scene used until final design is ready.

**2B. Hero Portrait Integration**
- After the 3D scene, before JourneySection, add a full-viewport portrait moment
- Large, high-res portrait of Deepinder Goyal — centered, no filters, clean background
- Single line of small HUD text below: name, title, coordinates
- This anchors the experience to a real person after the abstract 3D intro

---

### PHASE 3: Section-by-Section Elevation

**3A. Journey Section — Full-Bleed Photography**
- Replace small, filtered images with full-width editorial photography
- IIT Delhi campus: full-bleed background image with text overlaid in a glassmorphic strip
- Parallax depth: foreground text scrolls faster than background image
- Add a subtle Ken Burns (slow zoom) effect on images

**3B. MicroFriction Section — GSAP Horizontal Scroll**
- Replace Motion-based horizontal scroll with GSAP ScrollTrigger `pin` + `scrub`
- Frame-perfect control over horizontal movement
- Animate the "WAITING" person cards: they should visibly leave the queue as user scrolls (walk away animation via CSS transforms)
- The Foodiebay mockup should "boot up" with a terminal-style startup sequence as it scrolls into view

**3C. Eternal Conglomerate — 3D Constellation**
- Replace flat pillar selector with a 3D solar system visualization
- Eternal (parent) as the central glowing orb
- Zomato, Blinkit, District, Hyperpure as orbiting planets at different distances
- Each planet color-coded to its brand
- Click/hover a planet: camera zooms in, planet rotates to reveal stats panel
- Orbit sizes reflect relative business scale (Blinkit orbit > Zomato orbit — tells the story)
- Implementation: React Three Fiber with Drei helpers (OrbitControls, Float, Text3D)
- Fallback: Enhanced version of current pillar selector with magnetic-tilt card animations

**3D. Delivery Matrix Game — "The 10-Minute Clock"**
- Keep the core game mechanic (it's good)
- Add a large 3D-styled countdown clock above the grid (CSS 3D transforms, not Three.js)
- Add a mini map-style visualization showing order → rider → delivery path
- When game completes successfully: particle confetti explosion
- When game fails: glitch effect + system crash aesthetic
- Add sound effects (opt-in): click sounds, clock ticking, success/fail audio cues

**3E. System Log Timeline — Line-Draw Animation**
- Vertical timeline line draws itself as user scrolls (GSAP drawSVG or stroke-dashoffset animation)
- Each node pulses when it enters viewport
- Cards slide in from alternating sides (left/right) instead of all from the right
- Add micro-detail: each card has a blinking cursor that types out the log entry text

**3F. Crucible Section — The Delivery Rider Day (NEW)**
- New subsection within or after CrucibleSection
- Visual shift: warm, documentary tone (desaturated warm palette) vs the rest of the site's cold HUD aesthetic
- Content: Goyal spending a day as a Zomato delivery rider with his wife
- Stats displayed: km traveled, orders delivered, tips received
- Closing quote: "For centuries, class divides kept the labor of the poor invisible to the rich."
- This is the emotional peak of the entire site

**3G. Founder Flashcards — Rubber Band Easter Egg**
- Add a small 3D rubber band element (CSS 3D or simple SVG animation)
- User can "stretch" it by dragging, and releasing triggers the next flashcard
- Connects to the real detail: Goyal keeps a rubber band near his MacBook as a complacency anchor

**3H. Frontier Section — Gravity Aging Brain Visualization**
- For the Continue Research / Temple card: add an animated brain visualization
- Translucent brain outline with red particle streams (blood flow)
- As user scrolls, particles slow from top → bottom (gravity effect)
- Temple device appears, particles reverse and brighten
- Implementation: Canvas 2D particle system (not full Three.js — keep it lightweight)
- Surrounding glow effect matches the purple brand color

---

### PHASE 4: Polish & Micro-Interactions

**4A. 21st.dev / Animated Component Upgrades**
- Replace flat cards with magnetic-tilt cards (cursor-tracking 3D rotation)
- Add hover glow that follows cursor position on card surfaces
- Button hover states: elastic/magnetic physics (scale + slight pull toward cursor)
- Image transitions: grayscale → color on scroll entry (not just hover)

**4B. "The 9-Digit Phone Number" Easter Egg**
- Hide a deliberate numerical error somewhere on the site (e.g., a stat shows "24,000,00+" with a missing digit)
- On hover/click, a tooltip appears: "You caught that. Deepinder would be proud." with a link to the Shark Tank clip context
- Rewards attentive visitors — deeply on-brand

**4C. Ambient Sound Design (Opt-In)**
- Small speaker icon in navigation, default OFF
- Hero: Low ambient hum + keyboard typing
- Queue section: Crowd murmur → silence
- Delivery section: Clock ticking + bike engine
- Frontier: Spacecraft ambience + neural pulses
- Implementation: Howler.js with crossfading between section-specific audio
- Audio files: small, looped, compressed MP3s (~50KB each)

**4D. Image Optimization**
- Convert all PNGs to WebP (fallback PNG)
- Add `loading="lazy"` to below-fold images
- Add `srcset` for responsive sizes
- Compress hero portrait for fast initial load (<100KB)

**4E. View Transitions**
- Use CSS View Transitions API for the Eternal pillar switcher
- Crossfade morphing between pillar data panels
- Fallback: current AnimatePresence for browsers without support

---

## 6. Section Order (Final)

1. **Hero** — Spline 3D queue scene + typing quote + scroll CTA
2. **Portrait Moment** — Full-viewport Goyal portrait (NEW)
3. **Formative Crucibles** — Full-bleed editorial photography
4. **Bypassing the Queue** — GSAP horizontal scroll with animated queue
5. **The Eternal Conglomerate** — 3D constellation / solar system
6. **The 10-Minute Matrix** — Enhanced delivery game with clock
7. **Timeline of Execution** — Line-draw SVG timeline
8. **Intentional Friction / The Delivery Rider Day** — Emotional peak (warm tones)
9. **Rewiring the Subconscious** — Flashcards with rubber band
10. **From Bytes to Atoms** — Frontier with brain visualization
11. **Footer** — End of log

---

## 7. Success Criteria

- First-time visitors say "I've never seen a website do this" at least once
- The site has 3+ genuinely interactive moments (not just scroll animations)
- There is a clear emotional arc: curiosity → understanding → tension → empathy → inspiration
- Mobile experience is graceful (3D falls back to 2D, sound disabled, touch-friendly)
- Lighthouse Performance score > 80 (despite 3D elements)
- Page load < 3s on 4G connection (lazy loading, code splitting)

---

## 8. Out of Scope

- Backend/API functionality
- CMS or content management
- User authentication or accounts
- Analytics integration
- SEO optimization (beyond basic meta tags already present)
- Hosting/deployment configuration

---

## 9. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Spline scene heavy (MB download) | Lazy load, show canvas particle fallback while loading, intersection observer trigger |
| Three.js bundle size | Dynamic import, code-split 3D sections |
| GSAP license | Free for non-commercial use; ScrollTrigger is free tier |
| Audio files size | Keep each loop < 50KB, lazy load on opt-in |
| Browser compat for View Transitions | Progressive enhancement — works without it |
| Spline scene design | Placeholder geometry until final design; React integration works with any scene URL |
