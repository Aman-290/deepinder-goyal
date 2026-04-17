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
        flipTl.from(chars, {
          z: -100,
          opacity: 0,
          stagger: 0.05,
          duration: 0.5,
          ease: 'power2.out',
        }, 0.5); // Starts halfway through the flip
      }

      // Horizontal lines expand outward after flip
      flipTl.from(lineLeftRef.current, {
        scaleX: 0,
        transformOrigin: 'right center',
        duration: 0.3,
        ease: 'power3.out',
      }, 0.8);
      flipTl.from(lineRightRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.3,
        ease: 'power3.out',
      }, 0.8);

      // Meta text fades up
      if (metaRef.current) {
        flipTl.from(metaRef.current.children, {
          y: 20,
          opacity: 0,
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
        src="/deepinder-portrait-hq.jpg"
        alt=""
        className="hidden"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(false)}
      />

      {/* 3D Flip Container */}
      <div 
        className="relative w-full max-w-5xl aspect-[16/9] md:aspect-[21/9] perspective-[1500px]"
      >
        <div 
          ref={flipContainerRef} 
          className="w-full h-full relative" 
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Face: The Image */}
          <div 
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center rounded-2xl overflow-hidden glass border border-line shadow-2xl backface-hidden"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            {imageLoaded ? (
              <img
                src="/deepinder-portrait-hq.jpg"
                alt="Deepinder Goyal Portrait"
                className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000"
              />
            ) : (
               <div className="w-full h-full bg-surface/50 border border-line flex items-center justify-center">
                 <span className="hud-text text-muted animate-pulse">LOADING_PORTRAIT.IMG...</span>
               </div>
            )}
            {/* Overlay gradient for cinematic effect on the image */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80 pointer-events-none"></div>
          </div>

          {/* Back Face: The Typography */}
          <div 
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center backface-hidden"
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

            {/* Decorative lines */}
            <div className="flex items-center gap-6 mt-12 w-full max-w-3xl px-8 relative z-10">
              <div ref={lineLeftRef} className="flex-1 h-px bg-gradient-to-l from-zomato/40 to-transparent" />
              <div className="w-2 h-2 rotate-45 border border-zomato/60" />
              <div ref={lineRightRef} className="flex-1 h-px bg-gradient-to-r from-zomato/40 to-transparent" />
            </div>

            {/* Meta information */}
            <div ref={metaRef} className="text-center mt-6 space-y-2 relative z-10">
              <p className="hud-text text-muted tracking-[0.25em] text-sm md:text-base">
                FOUNDER & CEO // ZOMATO & ETERNAL
              </p>
              <p className="hud-text text-muted/40 text-[10px] md:text-xs tracking-[0.35em]">
                IIT DELHI M.TECH '05 &nbsp;·&nbsp; ZOMATO '08 &nbsp;·&nbsp; NEW DELHI, INDIA
              </p>
              <p className="hud-text text-zomato text-[10px] tracking-[0.3em] mt-3 animate-pulse">
                SCROLL TO CONTINUE SEQUENCE ↓
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
