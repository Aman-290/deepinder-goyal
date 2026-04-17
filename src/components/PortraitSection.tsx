// src/components/PortraitSection.tsx
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PortraitSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const flipContainerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const lineLeftRef = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || !flipContainerRef.current) return;

    const ctx = gsap.context(() => {
      
      // 3D Flip animation based on scroll progress
      const flipTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=800', // 800px of scrolling to complete the flip
          pin: true,    // Pin the section while flipping
          scrub: 1,     // Smooth scrubbing
        }
      });

      flipTl.to(flipContainerRef.current, {
        rotateX: 180,
        ease: 'none',
        duration: 1
      });

      // Name reveal characters pop in slightly as the back face is revealed
      if (nameRef.current) {
        const chars = nameRef.current.querySelectorAll('.char');
        flipTl.fromTo(chars, {
          z: -100,
          opacity: 0,
        }, {
          z: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.5,
          ease: 'power2.out',
        }, 0.5); // Starts halfway through the flip
      }

      // Horizontal lines expand outward after flip
      gsap.set(lineLeftRef.current, { transformOrigin: 'right center' });
      gsap.set(lineRightRef.current, { transformOrigin: 'left center' });

      flipTl.fromTo(lineLeftRef.current, { scaleX: 0 }, {
        scaleX: 1,
        duration: 0.3,
        ease: 'power3.out',
      }, 0.8);
      flipTl.fromTo(lineRightRef.current, { scaleX: 0 }, {
        scaleX: 1,
        duration: 0.3,
        ease: 'power3.out',
      }, 0.8);

      // Meta text fades up
      if (metaRef.current) {
        flipTl.fromTo(metaRef.current.children, {
          y: 20,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.4,
          ease: 'power3.out',
        }, 0.7);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const firstName = 'DEEPINDER';
  const lastName = 'GOYAL';

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-bg"
    >
      {/* Subtle radial glow behind the text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[800px] h-[400px] opacity-50"
          style={{
            background: 'radial-gradient(ellipse, rgba(226,55,68,0.15) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Hidden image loader */}
      <img
        src="/deepinder-hero-portrait.png"
        alt=""
        className="hidden"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(false)}
      />

      {/* 3D Flip Container (Only Image <-> Text) */}
      <div 
        className="relative w-full max-w-6xl h-[300px] md:h-[400px] flex items-center justify-center perspective-[1500px]"
      >
        <div 
          ref={flipContainerRef} 
          className="w-full h-full relative" 
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Face: The Image */}
          <div 
            className="absolute inset-0 flex items-center justify-center backface-hidden"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <div className="w-56 h-56 md:w-80 md:h-80 rounded-full overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(226,55,68,0.1)] relative">
              {imageLoaded ? (
                <img
                  src="/deepinder-hero-portrait.png"
                  alt="Deepinder Goyal Portrait"
                  className="w-full h-[120%] object-cover object-top grayscale hover:grayscale-0 transition-all duration-1000"
                />
              ) : (
                <div className="w-full h-full bg-surface/50 border border-line flex items-center justify-center">
                  <span className="hud-text text-[10px] text-muted animate-pulse">IMG_LOAD...</span>
                </div>
              )}
            </div>
          </div>

          {/* Back Face: The Typography */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center backface-hidden"
            style={{ 
              transform: 'rotateX(180deg)', 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden' 
            }}
          >
            {/* Main name display */}
            <div className="relative text-center w-full">
              <h2
                ref={nameRef}
                className="font-display font-bold tracking-tight leading-none select-none flex flex-col items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <span
                  className="block text-6xl md:text-8xl lg:text-[9rem] text-white/90"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {firstName.split('').map((char, i) => (
                    <span key={`f-${i}`} className="char inline-block" style={{ transformStyle: 'preserve-3d' }}>
                      {char}
                    </span>
                  ))}
                </span>
                <span
                  className="block text-7xl md:text-9xl lg:text-[11rem] text-gradient mt-[-0.1em]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {lastName.split('').map((char, i) => (
                    <span key={`l-${i}`} className="char inline-block" style={{ transformStyle: 'preserve-3d' }}>
                      {char}
                    </span>
                  ))}
                </span>
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative lines (Stays Fixed) */}
      <div className="flex items-center gap-6 mt-8 w-full max-w-3xl px-8 relative z-10">
        <div ref={lineLeftRef} className="flex-1 h-px bg-gradient-to-l from-zomato/40 to-transparent" />
        <div className="w-2 h-2 rotate-45 border border-zomato/60" />
        <div ref={lineRightRef} className="flex-1 h-px bg-gradient-to-r from-zomato/40 to-transparent" />
      </div>

      {/* Meta information (Stays Fixed) */}
      <div ref={metaRef} className="text-center mt-6 space-y-2 relative z-10">
        <p className="hud-text text-muted tracking-[0.25em] text-sm md:text-base">
          FOUNDER & CEO // ZOMATO & ETERNAL
        </p>
        <p className="hud-text text-muted/40 text-[10px] md:text-xs tracking-[0.35em]">
          IIT DELHI M.TECH '05 &nbsp;·&nbsp; ZOMATO '08 &nbsp;·&nbsp; NEW DELHI, INDIA
        </p>
        <p className="hud-text text-zomato text-[10px] tracking-[0.3em] mt-3 animate-[pulse_2s_ease-in-out_infinite]">
          SCROLL TO CONTINUE SEQUENCE ↓
        </p>
      </div>
    </section>
  );
}
